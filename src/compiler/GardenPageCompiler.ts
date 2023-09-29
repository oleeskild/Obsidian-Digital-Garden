import {
	Component,
	MetadataCache,
	Notice,
	TFile,
	Vault,
	arrayBufferToBase64,
	getLinkpath,
} from "obsidian";
import DigitalGardenSettings from "../models/settings";
import { PathRewriteRule } from "../publisher/DigitalGardenSiteManager";
import Publisher from "../publisher/Publisher";
import {
	escapeRegExp,
	fixSvgForXmlSerializer,
	generateUrlPath,
	getGardenPathForNote,
	getRewriteRules,
	sanitizePermalink,
} from "../utils/utils";
import { ExcalidrawCompiler } from "./ExcalidrawCompiler";
import { getAPI } from "obsidian-dataview";
import slugify from "@sindresorhus/slugify";
import { fixMarkdownHeaderSyntax } from "../utils/markdown";
import {
	CODEBLOCK_REGEX,
	CODE_FENCE_REGEX,
	EXCALIDRAW_REGEX,
	FRONTMATTER_REGEX,
	BLOCKREF_REGEX,
	TRANSCLUDED_SVG_REGEX,
} from "../utils/regexes";
import Logger from "js-logger";
import { PublishFile } from "../publisher/PublishFile";

export interface Asset {
	path: string;
	content: string;
}
export interface Assets {
	images: Array<Asset>;
}

export type TCompiledFile = [string, Assets];

export type TCompilerStep = (
	publishFile: PublishFile,
) =>
	| ((partiallyCompiledContent: string) => Promise<string>)
	| ((partiallyCompiledContent: string) => string);

export class GardenPageCompiler {
	private readonly vault: Vault;
	private readonly settings: DigitalGardenSettings;
	private excalidrawCompiler: ExcalidrawCompiler;
	private metadataCache: MetadataCache;
	private readonly getFilesMarkedForPublishing: Publisher["getFilesMarkedForPublishing"];

	private rewriteRules: PathRewriteRule[];

	constructor(
		vault: Vault,
		settings: DigitalGardenSettings,
		metadataCache: MetadataCache,
		getFilesMarkedForPublishing: Publisher["getFilesMarkedForPublishing"],
	) {
		this.vault = vault;
		this.settings = settings;
		this.metadataCache = metadataCache;
		this.getFilesMarkedForPublishing = getFilesMarkedForPublishing;
		this.excalidrawCompiler = new ExcalidrawCompiler(vault);
		this.rewriteRules = getRewriteRules(this.settings.pathRewriteRules);
	}

	async generateMarkdown(file: PublishFile): Promise<TCompiledFile> {
		const assets: Assets = { images: [] };

		const vaultFileText = await file.cachedRead();

		if (file.file.name.endsWith(".excalidraw.md")) {
			return [
				await this.excalidrawCompiler.compileMarkdown({
					includeExcaliDrawJs: true,
				})(file)(vaultFileText),
				assets,
			];
		}

		// ORDER MATTERS!
		const COMPILE_STEPS: TCompilerStep[] = [
			this.convertFrontMatter,
			this.convertCustomFilters,
			this.createBlockIDs,
			this.createTranscludedText(0),
			this.convertDataViews,
			this.convertLinksToFullPath,
			this.removeObsidianComments,
			this.createSvgEmbeds,
		];

		const compiledText = await COMPILE_STEPS.reduce(
			async (previousStep, compilerStep) => {
				const previousStepText = await previousStep;

				return compilerStep(file)(previousStepText);
			},
			Promise.resolve(vaultFileText),
		);

		const text_and_images = await this.convertImageLinks(
			compiledText,
			file.getPath(),
		);

		return [text_and_images[0], { images: text_and_images[1] }];
	}

	convertCustomFilters: TCompilerStep = () => (text) => {
		for (const filter of this.settings.customFilters) {
			try {
				text = text.replace(
					RegExp(filter.pattern, filter.flags),
					filter.replace,
				);
			} catch (e) {
				Logger.error(
					`Invalid regex: ${filter.pattern} ${filter.flags}`,
				);

				new Notice(
					`Your custom filters contains an invalid regex: ${filter.pattern}. Skipping it.`,
				);
			}
		}

		return text;
	};

	createBlockIDs: TCompilerStep = () => (text: string) => {
		const block_pattern = / \^([\w\d-]+)/g;
		const complex_block_pattern = /\n\^([\w\d-]+)\n/g;

		text = text.replace(
			complex_block_pattern,
			(_match: string, $1: string) => {
				return `{ #${$1}}\n\n`;
			},
		);

		text = text.replace(block_pattern, (match: string, $1: string) => {
			return `\n{ #${$1}}\n`;
		});

		return text;
	};

	removeObsidianComments: TCompilerStep = () => (text) => {
		const obsidianCommentsRegex = /%%.+?%%/gms;
		const obsidianCommentsMatches = text.match(obsidianCommentsRegex);
		const codeBlocks = text.match(CODEBLOCK_REGEX) || [];
		const codeFences = text.match(CODE_FENCE_REGEX) || [];
		const excalidraw = text.match(EXCALIDRAW_REGEX) || [];

		if (obsidianCommentsMatches) {
			for (const commentMatch of obsidianCommentsMatches) {
				//If comment is in a code block, code fence, or excalidrawing, leave it in
				if (
					codeBlocks.findIndex((x) => x.contains(commentMatch)) > -1
				) {
					continue;
				}

				if (
					codeFences.findIndex((x) => x.contains(commentMatch)) > -1
				) {
					continue;
				}

				if (
					excalidraw.findIndex((x) => x.contains(commentMatch)) > -1
				) {
					continue;
				}
				text = text.replace(commentMatch, "");
			}
		}

		return text;
	};

	convertFrontMatter: TCompilerStep = (file) => (text) => {
		const replaced = text.replace(FRONTMATTER_REGEX, (_match, _p1) => {
			return file.getCompiledFrontmatter();
		});

		return replaced;
	};

	convertDataViews: TCompilerStep = (file) => async (text) => {
		let replacedText = text;
		const dataViewRegex = /```dataview\s(.+?)```/gms;
		const dvApi = getAPI();

		if (!dvApi) return replacedText;
		const matches = text.matchAll(dataViewRegex);

		const dataviewJsPrefix = dvApi.settings.dataviewJsKeyword;

		const dataViewJsRegex = new RegExp(
			"```" + escapeRegExp(dataviewJsPrefix) + "\\s(.+?)```",
			"gsm",
		);
		const dataviewJsMatches = text.matchAll(dataViewJsRegex);

		const inlineQueryPrefix = dvApi.settings.inlineQueryPrefix;

		const inlineDataViewRegex = new RegExp(
			"`" + escapeRegExp(inlineQueryPrefix) + "(.+?)`",
			"gsm",
		);
		const inlineMatches = text.matchAll(inlineDataViewRegex);

		const inlineJsQueryPrefix = dvApi.settings.inlineJsQueryPrefix;

		const inlineJsDataViewRegex = new RegExp(
			"`" + escapeRegExp(inlineJsQueryPrefix) + "(.+?)`",
			"gsm",
		);
		const inlineJsMatches = text.matchAll(inlineJsDataViewRegex);

		if (
			!matches &&
			!inlineMatches &&
			!dataviewJsMatches &&
			!inlineJsMatches
		) {
			return text;
		}

		//Code block queries
		for (const queryBlock of matches) {
			try {
				const block = queryBlock[0];
				const query = queryBlock[1];

				const markdown = await dvApi.tryQueryMarkdown(
					query,
					file.getPath(),
				);

				replacedText = replacedText.replace(
					block,
					`${markdown}\n{ .block-language-dataview}`,
				);
			} catch (e) {
				console.log(e);

				new Notice(
					"Unable to render dataview query. Please update the dataview plugin to the latest version.",
				);

				return queryBlock[0];
			}
		}

		for (const queryBlock of dataviewJsMatches) {
			try {
				const block = queryBlock[0];
				const query = queryBlock[1];

				const div = createEl("div");
				const component = new Component();
				await dvApi.executeJs(query, div, component, file.getPath());
				component.load();

				replacedText = replacedText.replace(block, div.innerHTML);
			} catch (e) {
				console.log(e);

				new Notice(
					"Unable to render dataviewjs query. Please update the dataview plugin to the latest version.",
				);

				return queryBlock[0];
			}
		}

		//Inline queries
		for (const inlineQuery of inlineMatches) {
			try {
				const code = inlineQuery[0];
				const query = inlineQuery[1];

				const dataviewResult = dvApi.tryEvaluate(query, {
					// @ts-expect-error errors are caught
					this: dvApi.page(path),
				});

				if (dataviewResult) {
					replacedText = replacedText.replace(
						code,
						// @ts-expect-error errors are caught
						dataviewResult.toString(),
					);
				}
			} catch (e) {
				console.log(e);

				new Notice(
					"Unable to render inline dataview query. Please update the dataview plugin to the latest version.",
				);

				return inlineQuery[0];
			}
		}

		for (const inlineJsQuery of inlineJsMatches) {
			try {
				const code = inlineJsQuery[0];
				const query = inlineJsQuery[1];

				const div = createEl("div");
				const component = new Component();
				await dvApi.executeJs(query, div, component, file.getPath());
				component.load();

				replacedText = replacedText.replace(code, div.innerHTML);
			} catch (e) {
				console.log(e);

				new Notice(
					"Unable to render inline dataviewjs query. Please update the dataview plugin to the latest version.",
				);

				return inlineJsQuery[0];
			}
		}

		return replacedText;
	};

	stripAwayCodeFencesAndFrontmatter: TCompilerStep = () => (text) => {
		let textToBeProcessed = text;
		textToBeProcessed = textToBeProcessed.replace(EXCALIDRAW_REGEX, "");
		textToBeProcessed = textToBeProcessed.replace(CODEBLOCK_REGEX, "");
		textToBeProcessed = textToBeProcessed.replace(CODE_FENCE_REGEX, "");

		textToBeProcessed = textToBeProcessed.replace(FRONTMATTER_REGEX, "");

		return textToBeProcessed;
	};

	convertLinksToFullPath: TCompilerStep = (file) => async (text) => {
		let convertedText = text;

		const textToBeProcessed =
			await this.stripAwayCodeFencesAndFrontmatter(file)(text);

		const linkedFileRegex = /\[\[(.+?)\]\]/g;
		const linkedFileMatches = textToBeProcessed.match(linkedFileRegex);

		if (linkedFileMatches) {
			for (const linkMatch of linkedFileMatches) {
				try {
					const textInsideBrackets = linkMatch.substring(
						linkMatch.indexOf("[") + 2,
						linkMatch.lastIndexOf("]") - 1,
					);

					let [linkedFileName, linkDisplayName] =
						textInsideBrackets.split("|");

					if (linkedFileName.endsWith("\\")) {
						linkedFileName = linkedFileName.substring(
							0,
							linkedFileName.length - 1,
						);
					}

					linkDisplayName = linkDisplayName || linkedFileName;
					let headerPath = "";

					// detect links to headers or blocks
					if (linkedFileName.includes("#")) {
						const headerSplit = linkedFileName.split("#");
						linkedFileName = headerSplit[0];

						//currently no support for linking to nested heading with multiple #s
						headerPath =
							headerSplit.length > 1 ? `#${headerSplit[1]}` : "";
					}
					const fullLinkedFilePath = getLinkpath(linkedFileName);

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						fullLinkedFilePath,
						file.getPath(),
					);

					if (!linkedFile) {
						convertedText = convertedText.replace(
							linkMatch,
							`[[${linkedFileName}${headerPath}\\|${linkDisplayName}]]`,
						);
						continue;
					}

					if (linkedFile.extension === "md") {
						const extensionlessPath = linkedFile.path.substring(
							0,
							linkedFile.path.lastIndexOf("."),
						);

						convertedText = convertedText.replace(
							linkMatch,
							`[[${extensionlessPath}${headerPath}\\|${linkDisplayName}]]`,
						);
					}
				} catch (e) {
					console.log(e);
					continue;
				}
			}
		}

		return convertedText;
	};

	createTranscludedText =
		(currentDepth: number): TCompilerStep =>
		(file) =>
		async (text) => {
			if (currentDepth >= 4) {
				return text;
			}

			const { notes: publishedFiles } =
				await this.getFilesMarkedForPublishing();

			let transcludedText = text;

			const transcludedRegex = /!\[\[(.+?)\]\]/g;
			const transclusionMatches = text.match(transcludedRegex);
			let numberOfExcaliDraws = 0;

			for (const transclusionMatch of transclusionMatches ?? []) {
				try {
					const [transclusionFileName, headerName] = transclusionMatch
						.substring(
							transclusionMatch.indexOf("[") + 2,
							transclusionMatch.indexOf("]"),
						)
						.split("|");

					const transclusionFilePath =
						getLinkpath(transclusionFileName);

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						transclusionFilePath,
						file.getPath(),
					);

					if (!linkedFile) {
						console.error(
							`can't find transcluded file ${transclusionFilePath}}`,
						);
						continue;
					}

					const publishLinkedFile = new PublishFile({
						file: linkedFile,
						compiler: this,
						metadataCache: this.metadataCache,
						vault: this.vault,
						settings: this.settings,
					});
					let sectionID = "";

					if (linkedFile.name.endsWith(".excalidraw.md")) {
						numberOfExcaliDraws++;
						const isFirstDrawing = numberOfExcaliDraws === 1;

						const fileText = await publishLinkedFile.cachedRead();

						const excaliDrawCode =
							await this.excalidrawCompiler.compileMarkdown({
								includeExcaliDrawJs: isFirstDrawing,
								idAppendage: `${numberOfExcaliDraws}`,
								includeFrontMatter: false,
							})(publishLinkedFile)(fileText);

						transcludedText = transcludedText.replace(
							transclusionMatch,
							excaliDrawCode,
						);
					} else if (linkedFile.extension === "md") {
						let fileText = await this.vault.cachedRead(linkedFile);

						const metadata =
							this.metadataCache.getFileCache(linkedFile);

						if (transclusionFileName.includes("#^")) {
							// Transclude Block
							const refBlock =
								transclusionFileName.split("#^")[1];
							sectionID = `#${slugify(refBlock)}`;

							const blockInFile =
								metadata?.blocks && metadata.blocks[refBlock];

							if (blockInFile) {
								fileText = fileText
									.split("\n")
									.slice(
										blockInFile.position.start.line,
										blockInFile.position.end.line + 1,
									)
									.join("\n")
									.replace(`^${refBlock}`, "");
							}
						} else if (transclusionFileName.includes("#")) {
							// transcluding header only
							const refHeader =
								transclusionFileName.split("#")[1];

							const headerInFile = metadata?.headings?.find(
								(header) => header.heading === refHeader,
							);

							sectionID = `#${slugify(refHeader)}`;

							if (headerInFile && metadata?.headings) {
								const headerPosition =
									metadata.headings.indexOf(headerInFile);

								// Embed should copy the content proparly under the given block
								const cutTo = metadata.headings
									.slice(headerPosition + 1)
									.find(
										(header) =>
											header.level <= headerInFile.level,
									);

								if (cutTo) {
									const cutToLine =
										cutTo?.position?.start?.line;

									fileText = fileText
										.split("\n")
										.slice(
											headerInFile.position.start.line,
											cutToLine,
										)
										.join("\n");
								} else {
									fileText = fileText
										.split("\n")
										.slice(headerInFile.position.start.line)
										.join("\n");
								}
							}
						}
						//Remove frontmatter from transclusion
						fileText = fileText.replace(FRONTMATTER_REGEX, "");

						// Apply custom filters to transclusion
						fileText =
							await this.convertCustomFilters(publishLinkedFile)(
								fileText,
							);

						// Remove block reference
						fileText = fileText.replace(BLOCKREF_REGEX, "");

						const header = this.generateTransclusionHeader(
							headerName,
							linkedFile,
						);

						const headerSection = header
							? `$<div class="markdown-embed-title">\n\n${header}\n\n</div>\n`
							: "";
						let embedded_link = "";

						const publishedFilesContainsLinkedFile =
							publishedFiles.find(
								(f) => f.getPath() == linkedFile.path,
							);

						if (publishedFilesContainsLinkedFile) {
							const permalink =
								metadata?.frontmatter &&
								metadata.frontmatter["dg-permalink"];

							const gardenPath = permalink
								? sanitizePermalink(permalink)
								: `/${generateUrlPath(
										getGardenPathForNote(
											linkedFile.path,
											this.rewriteRules,
										),
								  )}`;
							embedded_link = `<a class="markdown-embed-link" href="${gardenPath}${sectionID}" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a>`;
						}

						fileText =
							`\n<div class="transclusion internal-embed is-loaded">${embedded_link}<div class="markdown-embed">\n\n${headerSection}\n\n` +
							fileText +
							"\n\n</div></div>\n";

						if (fileText.match(transcludedRegex)) {
							fileText = await this.createTranscludedText(
								currentDepth + 1,
							)(publishLinkedFile)(fileText);
						}

						//This should be recursive up to a certain depth
						transcludedText = transcludedText.replace(
							transclusionMatch,
							fileText,
						);
					}
				} catch (error) {
					console.error(error);
					continue;
				}
			}

			return transcludedText;
		};

	createSvgEmbeds: TCompilerStep = (file) => async (text) => {
		function setWidth(svgText: string, size: string): string {
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
			const svgElement = svgDoc.getElementsByTagName("svg")[0];
			svgElement.setAttribute("width", size);
			fixSvgForXmlSerializer(svgElement);
			const svgSerializer = new XMLSerializer();

			return svgSerializer.serializeToString(svgDoc);
		}

		const transcludedSvgs = text.match(TRANSCLUDED_SVG_REGEX);

		if (transcludedSvgs) {
			for (const svg of transcludedSvgs) {
				try {
					const [imageName, size] = svg
						.substring(svg.indexOf("[") + 2, svg.indexOf("]"))
						.split("|");
					const imagePath = getLinkpath(imageName);

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						imagePath,
						file.getPath(),
					);

					if (!linkedFile) {
						continue;
					}

					let svgText = await this.vault.read(linkedFile);

					if (svgText && size) {
						svgText = setWidth(svgText, size);
					}
					text = text.replace(svg, svgText);
				} catch {
					continue;
				}
			}
		}

		//!()[image.svg]
		const linkedSvgRegex = /!\[(.*?)\]\((.*?)(\.(svg))\)/g;
		const linkedSvgMatches = text.match(linkedSvgRegex);

		if (linkedSvgMatches) {
			for (const svg of linkedSvgMatches) {
				try {
					const [_imageName, size] = svg
						.substring(svg.indexOf("[") + 2, svg.indexOf("]"))
						.split("|");
					const pathStart = svg.lastIndexOf("(") + 1;
					const pathEnd = svg.lastIndexOf(")");
					const imagePath = svg.substring(pathStart, pathEnd);

					if (imagePath.startsWith("http")) {
						continue;
					}

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						imagePath,
						file.getPath(),
					);

					if (!linkedFile) {
						continue;
					}

					let svgText = await this.vault.read(linkedFile);

					if (svgText && size) {
						svgText = setWidth(svgText, size);
					}
					text = text.replace(svg, svgText);
				} catch {
					continue;
				}
			}
		}

		return text;
	};

	extractImageLinks = async (file: PublishFile) => {
		const text = await file.cachedRead();
		const assets = [];

		//![[image.png]]
		const transcludedImageRegex =
			/!\[\[(.*?)(\.(png|jpg|jpeg|gif|webp))\|(.*?)\]\]|!\[\[(.*?)(\.(png|jpg|jpeg|gif|webp))\]\]/g;
		const transcludedImageMatches = text.match(transcludedImageRegex);

		if (transcludedImageMatches) {
			for (let i = 0; i < transcludedImageMatches.length; i++) {
				try {
					const imageMatch = transcludedImageMatches[i];

					const [imageName, _] = imageMatch
						.substring(
							imageMatch.indexOf("[") + 2,
							imageMatch.indexOf("]"),
						)
						.split("|");
					const imagePath = getLinkpath(imageName);

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						imagePath,
						file.getPath(),
					);

					if (!linkedFile) {
						continue;
					}

					assets.push(linkedFile.path);
				} catch (e) {
					continue;
				}
			}
		}

		//![](image.png)
		const imageRegex = /!\[(.*?)\]\((.*?)(\.(png|jpg|jpeg|gif|webp))\)/g;
		const imageMatches = text.match(imageRegex);

		if (imageMatches) {
			for (let i = 0; i < imageMatches.length; i++) {
				try {
					const imageMatch = imageMatches[i];

					const pathStart = imageMatch.lastIndexOf("(") + 1;
					const pathEnd = imageMatch.lastIndexOf(")");
					const imagePath = imageMatch.substring(pathStart, pathEnd);

					if (imagePath.startsWith("http")) {
						continue;
					}

					const decodedImagePath = decodeURI(imagePath);

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						decodedImagePath,
						file.getPath(),
					);

					if (!linkedFile) {
						continue;
					}

					assets.push(linkedFile.path);
				} catch {
					continue;
				}
			}
		}

		return assets;
	};

	async convertImageLinks(
		text: string,
		filePath: string,
	): Promise<[string, Array<Asset>]> {
		const assets = [];

		let imageText = text;

		//![[image.png]]
		const transcludedImageRegex =
			/!\[\[(.*?)(\.(png|jpg|jpeg|gif|webp))\|(.*?)\]\]|!\[\[(.*?)(\.(png|jpg|jpeg|gif|webp))\]\]/g;
		const transcludedImageMatches = text.match(transcludedImageRegex);

		if (transcludedImageMatches) {
			for (let i = 0; i < transcludedImageMatches.length; i++) {
				try {
					const imageMatch = transcludedImageMatches[i];

					//[image.png|100]
					//[image.png|meta1 meta2|100]
					const [imageName, ...metaDataAndSize] = imageMatch
						.substring(
							imageMatch.indexOf("[") + 2,
							imageMatch.indexOf("]"),
						)
						.split("|");

					const lastValue =
						metaDataAndSize[metaDataAndSize.length - 1];
					const lastValueIsSize = !isNaN(parseInt(lastValue));

					const size = lastValueIsSize ? lastValue : undefined;
					let metaData = "";

					if (metaDataAndSize.length > 1) {
						metaData = metaDataAndSize
							.slice(0, metaDataAndSize.length - 1)
							.join(" ");
					}

					if (!lastValueIsSize) {
						metaData += ` ${lastValue}`;
					}

					const imagePath = getLinkpath(imageName);

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						imagePath,
						filePath,
					);

					if (!linkedFile) {
						continue;
					}
					const image = await this.vault.readBinary(linkedFile);
					const imageBase64 = arrayBufferToBase64(image);

					const cmsImgPath = `/img/user/${linkedFile.path}`;

					let name = "";

					if (metaData && size) {
						name = `${imageName}|${metaData}|${size}`;
					} else if (size) {
						name = `${imageName}|${size}`;
					} else {
						name = imageName;
					}

					const imageMarkdown = `![${name}](${encodeURI(
						cmsImgPath,
					)})`;

					assets.push({ path: cmsImgPath, content: imageBase64 });

					imageText = imageText.replace(imageMatch, imageMarkdown);
				} catch (e) {
					Logger.debug(e);
					continue;
				}
			}
		}

		//![](image.png)
		const imageRegex = /!\[(.*?)\]\((.*?)(\.(png|jpg|jpeg|gif|webp))\)/g;
		const imageMatches = text.match(imageRegex);

		if (imageMatches) {
			for (let i = 0; i < imageMatches.length; i++) {
				try {
					const imageMatch = imageMatches[i];

					const nameStart = imageMatch.indexOf("[") + 1;
					const nameEnd = imageMatch.indexOf("]");
					const imageName = imageMatch.substring(nameStart, nameEnd);

					const pathStart = imageMatch.lastIndexOf("(") + 1;
					const pathEnd = imageMatch.lastIndexOf(")");
					const imagePath = imageMatch.substring(pathStart, pathEnd);

					if (imagePath.startsWith("http")) {
						continue;
					}

					const decodedImagePath = decodeURI(imagePath);

					const linkedFile = this.metadataCache.getFirstLinkpathDest(
						decodedImagePath,
						filePath,
					);

					if (!linkedFile) {
						continue;
					}
					const image = await this.vault.readBinary(linkedFile);
					const imageBase64 = arrayBufferToBase64(image);
					const cmsImgPath = `/img/user/${linkedFile.path}`;
					const imageMarkdown = `![${imageName}](${cmsImgPath})`;
					assets.push({ path: cmsImgPath, content: imageBase64 });
					imageText = imageText.replace(imageMatch, imageMarkdown);
				} catch (e) {
					Logger.debug(e);
					continue;
				}
			}
		}

		return [imageText, assets];
	}

	generateTransclusionHeader(
		headerName: string | undefined,
		transcludedFile: TFile,
	) {
		if (!headerName) {
			return headerName;
		}

		const titleVariable = "{{title}}";

		if (headerName.includes(titleVariable)) {
			headerName = headerName.replace(
				titleVariable,
				transcludedFile.basename,
			);
		}

		return fixMarkdownHeaderSyntax(headerName);
	}
}

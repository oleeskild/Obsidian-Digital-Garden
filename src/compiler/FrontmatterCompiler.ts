import { FrontMatterCache } from "obsidian";
import {
	getGardenPathForNote,
	sanitizePermalink,
	generateUrlPath,
	kebabize,
	getRewriteRules,
} from "../utils/utils";
import DigitalGardenSettings from "../models/settings";
import { PathRewriteRules } from "../repositoryConnection/DigitalGardenSiteManager";
import { PublishFile } from "../publishFile/PublishFile";

export type TFrontmatter = Record<string, unknown> & {
	"dg-path"?: string;
	"dg-permalink"?: string;
	"dg-home"?: boolean;
	"dg-hide-in-graph"?: boolean;
	"dg-hide"?: boolean;
	"dg-pinned"?: boolean;
	"dg-metatags"?: string;
	tags?: string;
};

export type TPublishedFrontMatter = Record<string, unknown> & {
	tags?: string[];
	metatags?: string;
	pinned?: boolean;
	permalink?: string;
	hide?: boolean;
};

export class FrontmatterCompiler {
	private readonly settings: DigitalGardenSettings;
	private readonly rewriteRules: PathRewriteRules;

	constructor(settings: DigitalGardenSettings) {
		this.settings = settings;
		this.rewriteRules = getRewriteRules(settings.pathRewriteRules);
	}

	compile(file: PublishFile, frontmatter: FrontMatterCache): string {
		const fileFrontMatter = { ...frontmatter };
		delete fileFrontMatter["position"];

		let publishedFrontMatter: TPublishedFrontMatter = {
			"dg-publish": true,
		};

		publishedFrontMatter = this.addPermalink(
			fileFrontMatter,
			publishedFrontMatter,
			file.getPath(),
		);

		publishedFrontMatter = this.addDefaultPassThrough(
			fileFrontMatter,
			publishedFrontMatter,
		);

		publishedFrontMatter = this.addContentClasses(
			fileFrontMatter,
			publishedFrontMatter,
		);

		publishedFrontMatter = this.addPageTags(
			fileFrontMatter,
			publishedFrontMatter,
		);

		publishedFrontMatter = this.addFrontMatterSettings(
			fileFrontMatter,
			publishedFrontMatter,
		);

		publishedFrontMatter = this.addNoteIconFrontMatter(
			fileFrontMatter,
			publishedFrontMatter,
		);

		publishedFrontMatter =
			this.addTimestampsFrontmatter(file)(publishedFrontMatter);

		const fullFrontMatter = publishedFrontMatter?.dgPassFrontmatter
			? { ...fileFrontMatter, ...publishedFrontMatter }
			: publishedFrontMatter;

		const frontMatterString = JSON.stringify(fullFrontMatter);

		return `---\n${frontMatterString}\n---\n`;
	}

	private addPermalink(
		baseFrontMatter: TFrontmatter,
		newFrontMatter: TPublishedFrontMatter,
		filePath: string,
	) {
		const publishedFrontMatter = { ...newFrontMatter };

		const gardenPath =
			baseFrontMatter && baseFrontMatter["dg-path"]
				? baseFrontMatter["dg-path"]
				: getGardenPathForNote(filePath, this.rewriteRules);

		if (gardenPath != filePath) {
			publishedFrontMatter["dg-path"] = gardenPath;
		}

		if (baseFrontMatter && baseFrontMatter["dg-permalink"]) {
			publishedFrontMatter["dg-permalink"] =
				baseFrontMatter["dg-permalink"];

			publishedFrontMatter["permalink"] = sanitizePermalink(
				baseFrontMatter["dg-permalink"],
			);
		} else {
			publishedFrontMatter["permalink"] =
				"/" + generateUrlPath(gardenPath, this.settings.slugifyEnabled);
		}

		return publishedFrontMatter;
	}

	private addDefaultPassThrough(
		baseFrontMatter: TFrontmatter,
		newFrontMatter: TPublishedFrontMatter,
	) {
		// Eventually we will add other pass-throughs here. e.g. tags.
		const publishedFrontMatter = { ...newFrontMatter };

		if (baseFrontMatter) {
			if (baseFrontMatter["title"]) {
				publishedFrontMatter["title"] = baseFrontMatter["title"];
			}

			if (baseFrontMatter["dg-metatags"]) {
				publishedFrontMatter["metatags"] =
					baseFrontMatter["dg-metatags"];
			}

			if (baseFrontMatter["dg-hide"]) {
				publishedFrontMatter["hide"] = baseFrontMatter["dg-hide"];
			}

			if (baseFrontMatter["dg-hide-in-graph"]) {
				publishedFrontMatter["hideInGraph"] =
					baseFrontMatter["dg-hide-in-graph"];
			}

			if (baseFrontMatter["dg-pinned"]) {
				publishedFrontMatter["pinned"] = baseFrontMatter["dg-pinned"];
			}
		}

		return publishedFrontMatter;
	}

	private addPageTags(
		fileFrontMatter: TFrontmatter,
		publishedFrontMatterWithoutTags: TPublishedFrontMatter,
	) {
		const publishedFrontMatter = { ...publishedFrontMatterWithoutTags };

		if (fileFrontMatter) {
			const tags =
				(typeof fileFrontMatter["tags"] === "string"
					? fileFrontMatter["tags"].split(/,\s*/)
					: fileFrontMatter["tags"]) || [];

			if (fileFrontMatter["dg-home"] && !tags.contains("gardenEntry")) {
				tags.push("gardenEntry");
			}

			if (tags.length > 0) {
				publishedFrontMatter["tags"] = tags;
			}
		}

		return publishedFrontMatter;
	}

	private addContentClasses(
		baseFrontMatter: TFrontmatter,
		newFrontMatter: TPublishedFrontMatter,
	) {
		const publishedFrontMatter = { ...newFrontMatter };

		if (baseFrontMatter) {
			const contentClassesKey = this.settings.contentClassesKey;
			const contentClasses = baseFrontMatter[contentClassesKey];

			if (contentClassesKey && contentClasses) {
				if (typeof contentClasses == "string") {
					publishedFrontMatter["contentClasses"] = contentClasses;
				} else if (Array.isArray(contentClasses)) {
					publishedFrontMatter["contentClasses"] =
						contentClasses.join(" ");
				} else {
					publishedFrontMatter["contentClasses"] = "";
				}
			}
		}

		return publishedFrontMatter;
	}

	/**
	 * Adds the created and updated timestamps to the compiled frontmatter if specified in user settings
	 */
	private addTimestampsFrontmatter =
		(file: PublishFile) => (newFrontMatter: TPublishedFrontMatter) => {
			//If all note icon settings are disabled, don't change the frontmatter, so that people won't see all their notes as changed in the publication center
			const { showCreatedTimestamp, showUpdatedTimestamp } =
				this.settings;

			const updatedAt = file.meta.getUpdatedAt();
			const createdAt = file.meta.getCreatedAt();

			if (createdAt && showCreatedTimestamp) {
				newFrontMatter["created"] = createdAt;
			}

			if (updatedAt && showUpdatedTimestamp) {
				newFrontMatter["updated"] = updatedAt;
			}

			return newFrontMatter;
		};

	private addNoteIconFrontMatter(
		baseFrontMatter: TFrontmatter,
		newFrontMatter: TPublishedFrontMatter,
	) {
		if (!baseFrontMatter) {
			baseFrontMatter = {};
		}

		//If all note icon settings are disabled, don't change the frontmatter, so that people won't see all their notes as changed in the publication center
		if (
			!this.settings.showNoteIconInFileTree &&
			!this.settings.showNoteIconOnInternalLink &&
			!this.settings.showNoteIconOnTitle &&
			!this.settings.showNoteIconOnBackLink
		) {
			return newFrontMatter;
		}

		const publishedFrontMatter = { ...newFrontMatter };
		const noteIconKey = this.settings.noteIconKey;

		if (baseFrontMatter[noteIconKey] !== undefined) {
			publishedFrontMatter["noteIcon"] = baseFrontMatter[noteIconKey];
		} else {
			publishedFrontMatter["noteIcon"] = this.settings.defaultNoteIcon;
		}

		return publishedFrontMatter;
	}

	private addFrontMatterSettings(
		baseFrontMatter: Record<string, unknown>,
		newFrontMatter: Record<string, unknown>,
	) {
		if (!baseFrontMatter) {
			baseFrontMatter = {};
		}
		const publishedFrontMatter = { ...newFrontMatter };

		for (const key of Object.keys(this.settings.defaultNoteSettings)) {
			const settingValue = baseFrontMatter[kebabize(key)];

			if (settingValue) {
				publishedFrontMatter[key] = settingValue;
			}
		}

		const dgPassFrontmatter =
			this.settings.defaultNoteSettings.dgPassFrontmatter;

		if (dgPassFrontmatter) {
			publishedFrontMatter.dgPassFrontmatter = dgPassFrontmatter;
		}

		return publishedFrontMatter;
	}
}

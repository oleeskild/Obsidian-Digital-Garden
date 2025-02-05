import { MetadataCache, TFile, Vault } from "obsidian";
import { FRONTMATTER_REGEX } from "../utils/regexes";

export interface IFrontMatterEngine {
	set(key: string, value: string | boolean | number): IFrontMatterEngine;
	remove(key: string): IFrontMatterEngine;
	get(key: string): string | boolean | number;
	apply(): Promise<void>;
}

export default class ObsidianFrontMatterEngine implements IFrontMatterEngine {
	metadataCache: MetadataCache;
	file: TFile;
	vault: Vault;

	generatedFrontMatter: Record<string, unknown> = {};

	constructor(vault: Vault, metadataCache: MetadataCache, file: TFile) {
		this.metadataCache = metadataCache;
		this.vault = vault;
		this.file = file;
	}

	set(
		key: string,
		value: string | boolean | number,
	): ObsidianFrontMatterEngine {
		this.generatedFrontMatter[key] = value;

		return this;
	}

	remove(key: string): ObsidianFrontMatterEngine {
		this.generatedFrontMatter[key] = undefined;

		return this;
	}

	get(key: string): string | boolean | number {
		return this.getFrontMatterSnapshot()[key];
	}

	async apply(): Promise<void> {
		const newFrontMatter = this.getFrontMatterSnapshot();

		const content = await this.vault.cachedRead(this.file);
		const yaml = this.frontMatterToYaml(newFrontMatter);
		let newContent = "";

		if (content.match(FRONTMATTER_REGEX)) {
			newContent = content.replace(FRONTMATTER_REGEX, (_match) => {
				return yaml;
			});
		} else {
			newContent = `${yaml}\n${content}`;
		}

		await this.vault.modify(this.file, newContent);
	}

	private frontMatterToYaml(frontMatter: Record<string, unknown>) {
		for (const key of Object.keys(frontMatter)) {
			if (frontMatter[key] === undefined) {
				delete frontMatter[key];
			}
		}

		if (Object.keys(frontMatter).length === 0) {
			return "";
		}

		let yaml = "---\n";

		for (const key of Object.keys(frontMatter)) {
			yaml += `${key}: ${frontMatter[key]}\n`;
		}
		yaml += "---";

		return yaml;
	}

	private getFrontMatterSnapshot() {
		const cachedFrontMatter = {
			...this.metadataCache.getCache(this.file?.path)?.frontmatter,
		};
		delete cachedFrontMatter["position"];

		return { ...cachedFrontMatter, ...this.generatedFrontMatter };
	}
}

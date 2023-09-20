import { Notice, Plugin, addIcon } from "obsidian";
import Publisher from "./src/publisher/Publisher";
import DigitalGardenSettings from "./src/models/settings";
import { PublishStatusBar } from "./src/ui/PublishStatusBar";
import { seedling } from "src/ui/suggest/constants";
import { PublishModal } from "src/ui/PublishModal";
import PublishStatusManager from "src/publisher/PublishStatusManager";
import ObsidianFrontMatterEngine from "src/publisher/ObsidianFrontMatterEngine";
import DigitalGardenSiteManager from "src/publisher/DigitalGardenSiteManager";
import { DigitalGardenSettingTab } from "./src/ui/DigitalGardenSettingTab";

const DEFAULT_SETTINGS: DigitalGardenSettings = {
	githubRepo: "",
	githubToken: "",
	githubUserName: "",
	gardenBaseUrl: "",
	prHistory: [],
	baseTheme: "dark",
	theme: '{"name": "default", "modes": ["dark"]}',
	faviconPath: "",
	noteSettingsIsInitialized: false,
	siteName: "Digital Garden",
	slugifyEnabled: true,
	// Note Icon Related Settings
	noteIconKey: "dg-note-icon",
	defaultNoteIcon: "",
	showNoteIconOnTitle: false,
	showNoteIconInFileTree: false,
	showNoteIconOnInternalLink: false,
	showNoteIconOnBackLink: false,

	// Timestamp related settings
	showCreatedTimestamp: false,
	createdTimestampKey: "dg-created",
	showUpdatedTimestamp: false,
	updatedTimestampKey: "dg-updated",
	timestampFormat: "MMM dd, yyyy h:mm a",

	styleSettingsCss: "",
	pathRewriteRules: "",
	customFilters: [],

	contentClassesKey: "dg-content-classes",

	defaultNoteSettings: {
		dgHomeLink: true,
		dgPassFrontmatter: false,
		dgShowBacklinks: false,
		dgShowLocalGraph: false,
		dgShowInlineTitle: false,
		dgShowFileTree: false,
		dgEnableSearch: false,
		dgShowToc: false,
		dgLinkPreview: false,
		dgShowTags: false,
	},
};

export default class DigitalGarden extends Plugin {
	settings!: DigitalGardenSettings;
	appVersion!: string;

	publishModal!: PublishModal;

	async onload() {
		this.appVersion = this.manifest.version;

		console.log("Initializing DigitalGarden plugin v" + this.appVersion);
		await this.loadSettings();

		this.addSettingTab(new DigitalGardenSettingTab(this.app, this));

		await this.addCommands();

		addIcon("digital-garden-icon", seedling);
		this.addRibbonIcon(
			"digital-garden-icon",
			"Digital Garden Publication Center",
			async () => {
				this.openPublishModal();
			},
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async addCommands() {
		this.addCommand({
			id: "quick-publish-and-share-note",
			name: "Quick Publish And Share Note",
			callback: async () => {
				new Notice("Adding publish flag to note and publishing it.");
				await this.addPublishFlag();
				const activeFile = this.app.workspace.getActiveFile();
				const event = this.app.metadataCache.on(
					"changed",
					async (file, _data, _cache) => {
						if (file.path === activeFile?.path) {
							const successfullyPublished =
								await this.publishSingleNote();
							if (successfullyPublished) {
								await this.copyGardenUrlToClipboard();
							}
							this.app.metadataCache.offref(event);
						}
					},
				);

				// Remove the event listener after 5 seconds in case the file is not changed.
				setTimeout(() => {
					this.app.metadataCache.offref(event);
				}, 5000);
			},
		});

		this.addCommand({
			id: "publish-note",
			name: "Publish Single Note",
			callback: async () => {
				await this.publishSingleNote();
			},
		});

		this.addCommand({
			id: "publish-multiple-notes",
			name: "Publish Multiple Notes",
			callback: async () => {
				const statusBarItem = this.addStatusBarItem();
				try {
					new Notice("Processing files to publish...");
					const { vault, metadataCache } = this.app;
					const publisher = new Publisher(
						vault,
						metadataCache,
						this.settings,
					);
					const siteManager = new DigitalGardenSiteManager(
						metadataCache,
						this.settings,
					);
					const publishStatusManager = new PublishStatusManager(
						siteManager,
						publisher,
					);

					const publishStatus =
						await publishStatusManager.getPublishStatus();
					const filesToPublish = publishStatus.changedNotes.concat(
						publishStatus.unpublishedNotes,
					);
					const filesToDelete = publishStatus.deletedNotePaths;
					const imagesToDelete = publishStatus.deletedImagePaths;
					const statusBar = new PublishStatusBar(
						statusBarItem,
						filesToPublish.length +
							filesToDelete.length +
							imagesToDelete.length,
					);

					let errorFiles = 0;
					let errorDeleteFiles = 0;
					let errorDeleteImage = 0;
					new Notice(
						`Publishing ${filesToPublish.length} notes, deleting ${filesToDelete.length} notes and ${imagesToDelete.length} images. See the status bar in lower right corner for progress.`,
						8000,
					);
					for (const file of filesToPublish) {
						try {
							statusBar.increment();
							await publisher.publish(file);
						} catch {
							errorFiles++;
							new Notice(
								`Unable to publish note ${file.name}, skipping it.`,
							);
						}
					}
					for (const filePath of filesToDelete) {
						try {
							statusBar.increment();
							await publisher.deleteNote(filePath);
						} catch {
							errorDeleteFiles++;
							new Notice(
								`Unable to delete note ${filePath}, skipping it.`,
							);
						}
					}

					for (const filePath of imagesToDelete) {
						try {
							statusBar.increment();
							await publisher.deleteImage(filePath);
						} catch {
							errorDeleteImage++;
							new Notice(
								`Unable to delete image ${filePath}, skipping it.`,
							);
						}
					}

					statusBar.finish(8000);
					new Notice(
						`Successfully published ${
							filesToPublish.length - errorFiles
						} notes to your garden.`,
					);
					if (filesToDelete.length > 0) {
						new Notice(
							`Successfully deleted ${
								filesToDelete.length - errorDeleteFiles
							} notes from your garden.`,
						);
					}
					if (imagesToDelete.length > 0) {
						new Notice(
							`Successfully deleted ${
								imagesToDelete.length - errorDeleteImage
							} images from your garden.`,
						);
					}
				} catch (e) {
					statusBarItem.remove();
					console.error(e);
					new Notice(
						"Unable to publish multiple notes, something went wrong.",
					);
				}
			},
		});

		this.addCommand({
			id: "copy-garden-url",
			name: "Copy Garden URL",
			callback: async () => {
				this.copyGardenUrlToClipboard();
			},
		});

		this.addCommand({
			id: "dg-open-publish-modal",
			name: "Open Publication Center",
			callback: async () => {
				this.openPublishModal();
			},
		});

		this.addCommand({
			id: "dg-mark-note-for-publish",
			name: "Add publish flag",
			callback: async () => {
				this.addPublishFlag();
			},
		});
	}

	async copyGardenUrlToClipboard() {
		try {
			const { metadataCache, workspace } = this.app;
			const currentFile = workspace.getActiveFile();
			if (!currentFile) {
				new Notice(
					"No file is open/active. Please open a file and try again.",
				);
				return;
			}

			const siteManager = new DigitalGardenSiteManager(
				metadataCache,
				this.settings,
			);
			const fullUrl = siteManager.getNoteUrl(currentFile);

			await navigator.clipboard.writeText(fullUrl);
			new Notice(`Note URL copied to clipboard`);
		} catch (e) {
			console.log(e);
			new Notice(
				"Unable to copy note URL to clipboard, something went wrong.",
			);
		}
	}

	async publishSingleNote() {
		try {
			const { vault, workspace, metadataCache } = this.app;

			const currentFile = workspace.getActiveFile();
			if (!currentFile) {
				new Notice(
					"No file is open/active. Please open a file and try again.",
				);
				return;
			}
			if (currentFile.extension !== "md") {
				new Notice(
					"The current file is not a markdown file. Please open a markdown file and try again.",
				);
				return;
			}

			new Notice("Publishing note...");
			const publisher = new Publisher(
				vault,
				metadataCache,
				this.settings,
			);
			const publishSuccessful = await publisher.publish(currentFile);

			if (publishSuccessful) {
				new Notice(`Successfully published note to your garden.`);
			}
			return publishSuccessful;
		} catch (e) {
			console.error(e);
			new Notice("Unable to publish note, something went wrong.");
			return false;
		}
	}
	async addPublishFlag() {
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile === null) {
			new Notice("No active file!");
			return;
		}
		const engine = new ObsidianFrontMatterEngine(
			this.app.vault,
			this.app.metadataCache,
			activeFile,
		);
		engine.set("dg-publish", true).apply();
	}

	openPublishModal() {
		if (!this.publishModal) {
			const siteManager = new DigitalGardenSiteManager(
				this.app.metadataCache,
				this.settings,
			);
			const publisher = new Publisher(
				this.app.vault,
				this.app.metadataCache,
				this.settings,
			);
			const publishStatusManager = new PublishStatusManager(
				siteManager,
				publisher,
			);
			this.publishModal = new PublishModal(
				this.app,
				publishStatusManager,
				publisher,
				siteManager,
				this.settings,
			);
		}
		this.publishModal.open();
	}
}

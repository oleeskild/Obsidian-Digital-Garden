import { Setting, debounce } from "obsidian";
import SettingView from "./SettingView";
import { Octokit } from "@octokit/core";

export class GithubSettings {
	settings: SettingView;
	connectionStatus: "loading" | "connected" | "error";
	private settingsRootElement: HTMLElement;
	connectionStatusElement: HTMLElement;

	constructor(settings: SettingView, settingsRootElement: HTMLElement) {
		this.settings = settings;
		this.settingsRootElement = settingsRootElement;
		this.settingsRootElement.id = "github-settings";
		this.settingsRootElement.classList.add("settings-tab-content");
		this.connectionStatus = "loading";

		this.connectionStatusElement = this.settingsRootElement.createEl(
			"span",
			{ cls: "connection-status" },
		);
		this.initializeHeader();
		this.initializeGitHubRepoSetting();
		this.initializeGitHubUserNameSetting();
		this.initializeGitHubTokenSetting();
	}

	initializeHeader = () => {
		this.connectionStatusElement.style.cssText = "margin-left: 10px;";
		this.checkConnectionAndSaveSettings();

		const githubSettingsHeader = createEl("h3", {
			text: "GitHub Authentication (required)",
		});
		githubSettingsHeader.append(this.connectionStatusElement);
		githubSettingsHeader.prepend(this.settings.getIcon("github"));

		this.settingsRootElement.prepend(githubSettingsHeader);
	};

	checkConnectionAndSaveSettings = async () => {
		this.settings.saveSettings();
		this.debouncedUpdateConnectionStatus();
	};

	updateConnectionStatus = async () => {
		const oktokit = new Octokit({
			auth: this.settings.settings.githubToken,
		});

		try {
			const response = await oktokit.request(
				"GET /repos/{owner}/{repo}",
				{
					owner: this.settings.settings.githubUserName,
					repo: this.settings.settings.githubRepo,
				},
			);

			// If other permissions are needed, add them here and indicate to user on insufficient permissions
			// Github now advocates for hyper-specific tokens
			if (response.data.permissions?.admin) {
				this.connectionStatus = "connected";
			}
		} catch (error) {
			this.connectionStatus = "error";
		}
		this.updateConnectionStatusIndicator();
	};

	debouncedUpdateConnectionStatus = debounce(
		this.updateConnectionStatus,
		500,
		true,
	);

	updateConnectionStatusIndicator = () => {
		if (this.connectionStatus === "loading") {
			this.connectionStatusElement.innerText = "⏳";
		}

		if (this.connectionStatus === "connected") {
			this.connectionStatusElement.innerText = "✅";
		}

		if (this.connectionStatus === "error") {
			this.connectionStatusElement.innerText = "❌";
		}
	};

	private initializeGitHubRepoSetting() {
		new Setting(this.settingsRootElement)
			.setName("GitHub repo name")
			.setDesc("The name of the GitHub repository")
			.addText((text) =>
				text
					.setPlaceholder("mydigitalgarden")
					.setValue(this.settings.settings.githubRepo)
					.onChange(async (value) => {
						this.settings.settings.githubRepo = value;
						await this.checkConnectionAndSaveSettings();
					}),
			);
	}

	private initializeGitHubUserNameSetting() {
		new Setting(this.settingsRootElement)
			.setName("GitHub Username")
			.setDesc("Your GitHub Username")
			.addText((text) =>
				text
					.setPlaceholder("myusername")
					.setValue(this.settings.settings.githubUserName)
					.onChange(async (value) => {
						this.settings.settings.githubUserName = value;
						await this.checkConnectionAndSaveSettings();
					}),
			);
	}

	private initializeGitHubTokenSetting() {
		const desc = document.createDocumentFragment();

		desc.createEl("span", undefined, (span) => {
			span.innerText =
				"A GitHub token with contents permissions. You can see how to generate it ";

			span.createEl("a", undefined, (link) => {
				link.href =
					"https://dg-docs.ole.dev/advanced/fine-grained-access-token/";
				link.innerText = "here!";
			});
		});

		new Setting(this.settingsRootElement)
			.setName("GitHub token")
			.setDesc(desc)
			.addText((text) =>
				text
					.setPlaceholder("Secret Token")
					.setValue(this.settings.settings.githubToken)
					.onChange(async (value) => {
						this.settings.settings.githubToken = value;
						await this.checkConnectionAndSaveSettings();
					}),
			);
	}
}

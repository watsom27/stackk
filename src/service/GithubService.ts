const GITHUB_RELEASE_URL = 'https://api.github.com/repos/watsom27/stackk/releases/latest';

export interface Release {
    title: string;
    version: string;
    notes: string;
}

class GithubService {
    private latestRelease?: Release;

    public async getLatestRelease(): Promise<Release> {
        let result: Release;

        if (this.latestRelease) {
            result = this.latestRelease;
        } else {
            const response = await fetch(GITHUB_RELEASE_URL);
            if (response.ok) {
                const { name, tag_name: tagName, body } = await response.json();

                result = {
                    title: name,
                    version: tagName,
                    notes: body,
                };

                this.latestRelease = result;
            } else {
                throw new Error('Github rate exceeded');
            }
        }

        return result;
    }
}

export const githubService = new GithubService();

const GITHUB_RELEASE_URL = 'https://api.github.com/repos/watsom27/stackk/releases/latest';

export interface Release {
    title: string;
    version: string;
    notes: string;
}

const RATE_LIMIT_RESPONSE: Release = {
    title: 'Error',
    version: '',
    notes: 'Github Rate Limit Exceeded',
};

class GithubService {
    private failed = false;
    private latestRelease?: Release;

    public async getLatestRelease(): Promise<Release> {
        let result: Release;

        if (!this.failed) {
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
                    this.failed = true;
                    result = RATE_LIMIT_RESPONSE;
                }
            }
        } else {
            result = RATE_LIMIT_RESPONSE;
        }

        return result;
    }
}

export const githubService = new GithubService();

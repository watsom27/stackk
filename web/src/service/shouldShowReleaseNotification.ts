import { db } from '~data/Db';
import { githubService } from '~service/githubService';

export async function shouldShowReleaseNotification(): Promise<boolean> {
    const { version: githubVersion } = await githubService.getLatestRelease();
    const latestRelease = await db.getLatestRelease();

    return latestRelease !== githubVersion;
}

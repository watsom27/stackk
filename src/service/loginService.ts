import firebase from 'firebase/app';
import 'firebase/auth';
import { Feature, FeaturesConfig } from '~config/featuresConfig';
import { Logger } from '~service/logger';

export class LoginService {
    public static addStateChangeListener(listener: (user: firebase.User | null) => void): firebase.Unsubscribe {
        return firebase.auth().onAuthStateChanged(listener);
    }

    public static async validateUser(username: string, password: string): Promise<boolean> {
        let success = false;

        try {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await firebase.auth().signInWithEmailAndPassword(username, password);

            success = true;
        } catch (e) {
            Logger.error(e);
        }

        return success;
    }

    public static async registerUser(username: string, password: string): Promise<boolean> {
        let success = false;

        if (FeaturesConfig.get(Feature.UserRegistration)) {
            try {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                await firebase.auth().createUserWithEmailAndPassword(username, password);

                success = true;
            } catch (e) {
                Logger.error(e);
            }
        }

        return success;
    }

    public static logout(): void {
        firebase.auth().signOut();
    }

    public static isLoggedIn(): boolean {
        return Boolean(firebase.auth().currentUser);
    }

    public static getUserId(): string {
        const uId = firebase.auth().currentUser?.uid;

        if (!uId) {
            throw new Error('Tried to read userId when not logged in');
        }

        return uId;
    }
}

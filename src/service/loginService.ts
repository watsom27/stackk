import firebase from 'firebase/app';
import 'firebase/auth';
import { Feature, FeaturesConfig } from '~config/featuresConfig';
import { db } from '~data/Db';
import { Logger } from '~service/logger';

interface LoginResponse {
    success: boolean;
    reason?: string;
}

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

    public static async registerUser(username: string, password: string): Promise<LoginResponse> {
        let result: LoginResponse = {
            success: false,
        };

        if (FeaturesConfig.get(Feature.UserRegistration)) {
            try {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                await firebase.auth().createUserWithEmailAndPassword(username, password);

                result = {
                    success: true,
                };
            } catch (e) {
                result = {
                    success: false,
                    reason: e.message,
                };

                Logger.log(e.message);
            }
        }

        return result;
    }

    public static logout(): void {
        firebase.auth().signOut();
        db.signOut();
    }

    public static sendResetEmail(): void {
        firebase.auth().sendPasswordResetEmail(this.getUserEmail());
    }

    public static async deleteAccount(): Promise<void> {
        await firebase.auth().currentUser?.delete();
        db.signOut();
    }

    public static async reAuth(password: string): Promise<LoginResponse> {
        let result: LoginResponse;

        try {
            const authCredential = await firebase.auth.EmailAuthProvider.credential(this.getUserEmail(), password);

            if (authCredential) {
                await firebase.auth().currentUser?.reauthenticateWithCredential(authCredential);
                result = {
                    success: true,
                };
            } else {
                result = {
                    success: false,
                    reason: 'Something shit itself',
                };
            }
        } catch (e) {
            result = {
                success: false,
                reason: e.message,
            };

            Logger.log(e.message);
        }

        return result;
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

    public static getUserEmail(): string {
        const email = firebase.auth().currentUser?.email;

        if (!email) {
            throw new Error('Tried to read email when not logged in');
        }

        return email;
    }
}

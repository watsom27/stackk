export enum Feature {
    UserRegistration,
}

const features = new Map<Feature, boolean>([
    [Feature.UserRegistration, true],
]);

export class FeaturesConfig {
    public static get(feature: Feature): boolean {
        return features.get(feature) ?? false;
    }
}

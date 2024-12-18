module.exports = {
  name: 'first-pharm',
  slug: 'first-pharm',
  version: '1.0.0',
  scheme: 'first-pharm',
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    ['expo-router'],
    ['expo-secure-store'],
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
        recordAudioAndroid: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.firstpark.firstpharm',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.firstpark.firstpharm',
  },

  extra: {
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },
};

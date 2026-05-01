const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;
const origin = replitDevDomain
  ? `https://${replitDevDomain}`
  : "https://replit.com/";

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: "المصحف المثمن",
    slug: "mushaf",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "mushaf",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/logo.png",
      resizeMode: "contain",
      backgroundColor: "#F0E6C8",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.seifkamel.mushaf",
    },
    android: {
      package: "com.seifkamel.mushaf",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#F0E6C8",
      },
    },
    web: {
      favicon: "./assets/images/logo.png",
    },
    plugins: [
      [
        "expo-router",
        {
          origin,
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    extra: {
      router: {
        origin,
      },
      eas: {
        projectId: "b42b5e53-f77d-4e24-aeda-7286c063e56f",
      },
    },
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};

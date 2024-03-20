

export default {
	expo: {
	  version: "1.0.9",
	  name: "GetBetter.",
	  slug: "getb",
	  orientation: "portrait",
	  icon: "./assets/icon.png",
	  runtimeVersion: "1.0.0",
	  platforms: ["ios"],
	  splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#000000"
	  },
	  assetBundlePatterns: ["**/*"],
	  ios: {
		supportsTablet: true,
		bundleIdentifier: "com.bensone146.getbetter",
		config: {
		  usesNonExemptEncryption: false
		}
	  },
	  extra: {
		eas: {
			  projectId: "a4bda6f3-c73a-4e87-a62e-5b48a9d8671b",
			SENTRY_AUTH_TOKEN:  process.env.SENTRY_AUTH_TOKEN ?? ''
		}
	  },
	  owner: "bensone146",
	  updates: {
		url: "https://u.expo.dev/a4bda6f3-c73a-4e87-a62e-5b48a9d8671b"
	  },
	  plugins: [
		[
		  "expo-font",
		  {
			fonts: [
			  "./assets/fonts/Inter-Black.ttf",
			  "./assets/fonts/Inter-Bold.ttf",
			  "./assets/fonts/Inter-ExtraBold.ttf",
			  "./assets/fonts/Inter-ExtraLight.ttf",
			  "./assets/fonts/Inter-Light.ttf",
			  "./assets/fonts/Inter-Medium.ttf",
			  "./assets/fonts/Inter-Regular.ttf",
			  "./assets/fonts/Inter-SemiBold.ttf",
			  "./assets/fonts/Inter-Thin.ttf"
			]
		  }
		],
		[
		  "expo-camera",
		  {
			cameraPermission: "Allow GetBetter to access your camera.",
			microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone"
		  }
		],
		[
		  "expo-image-picker",
		  {
			photosPermission: "The app accesses your photos to let you share them with your friends."
		  }
		],
		[
		  "@sentry/react-native/expo",
		  {
			url: "https://sentry.io/",
			organization: "benson-e4",
			  project: "get-better",
		  }
		]
	  ]
	},
	packagerOpts: {
	  config: "metro.config.js",
	  sourceExts: ["js", "jsx", "svg", "ts", "tsx"]
	}
  };
  
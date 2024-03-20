import { AuthProvider } from '@context/auth/AuthProvider';
import { ThemeContextProvider } from '@context/theme/ThemeContextProvider';
import { toastConfig } from '@context/theme/toastConfig';
import * as Sentry from '@sentry/react-native';
import 'expo-dev-client';
import React from 'react';
import Toast from 'react-native-toast-message';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
	dsn: 'https://5728c28ba041addaf03fc22c9fbab2c8@o4506748669919232.ingest.us.sentry.io/4506748872359936',
	enableAutoSessionTracking: true,
	environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
	// debug: process.env.EXPO_PUBLIC_ENVIRONMENT !== 'production',
	tracesSampleRate: 0.1,
	integrations: [
		new Sentry.ReactNativeTracing({
			routingInstrumentation,
		}),
	],
});

const App = () => {
	return (
		<>
			<ThemeContextProvider>
			<AuthProvider routingInstrumentation={routingInstrumentation} />
			</ThemeContextProvider>
		<Toast config={toastConfig} />
		</>
	);
};

export default Sentry.wrap(App);

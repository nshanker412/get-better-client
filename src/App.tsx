import { AuthProvider } from '@context/auth/AuthProvider';
import { ThemeContextProvider } from '@context/theme/ThemeContextProvider';
import { toastConfig } from '@context/theme/toastConfig';
import * as Sentry from '@sentry/react-native';
import 'expo-dev-client';
import React from 'react';
import Toast from 'react-native-toast-message';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
	dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
	enableAutoSessionTracking: true,
	environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
	debug: process.env.EXPO_PUBLIC_ENVIRONMENT !== 'production',
	tracesSampleRate: 1.0,
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


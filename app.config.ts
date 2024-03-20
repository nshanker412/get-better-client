
import { ConfigContext, ExpoConfig } from 'expo/config';



export default ({ config }: ConfigContext): Partial<ExpoConfig> => {

	console.log('process.env', process.env);
	if (!process.env.SENTRY_AUTH_TOKEN) {
		throw new Error('SENTRY_DSN and SENTRY_AUTH_TOKEN must be set');
	}


	return {
		...config,
		extra: {
			...config.extra,
			SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
		},
			
	};
}
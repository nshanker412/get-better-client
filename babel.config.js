module.exports = (api) => {
	api.cache(false);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					root: ['./src'],
					extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
					alias: {
						'@assets': './assets',
						'@context': './src/context',
						'@types': './src/types',
					},
				},
				'react-native-reanimated/plugin',

			],
		],
	};
};

module.exports = {
	preset: 'jest-expo',
	setupFiles: ['<rootDir>/setupTests.js'],
	transformIgnorePatterns: [
		'/node_modules/@react-native-community/async-storage/(?!(lib))',
	],
	moduleNameMapper: {
		// Add your moduleNameMapper configurations here
		// For example:
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	// Add more Jest configurations as needed
	// For example:
	testPathIgnorePatterns: ['/node_modules/', '/dist/', ],
	testMatch: [
		'<rootDir>/src/**/*.test.tsx',
		'<rootDir>/src/**/*.test.ts',
		'<rootDir>/src/**/*.test.js',
		'<rootDir>/src/**/*.test.jsx',
	],
};

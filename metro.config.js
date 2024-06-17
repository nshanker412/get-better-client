// This replaces `const { getDefaultConfig } = require('expo/metro-config');`
// const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const { getDefaultConfig } = require('expo/metro-config');
// This replaces `const config = getDefaultConfig(__dirname);`
// const config = getSentryExpoConfig(__dirname);
const config = getDefaultConfig(__dirname);

module.exports = config;

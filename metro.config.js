const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite web WASM desteği
config.resolver.assetExts.push('wasm');

module.exports = config;

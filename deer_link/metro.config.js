const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Keep all default asset extensions (png, jpg, etc.) except svg
    assetExts: defaultConfig.resolver.assetExts.filter(
      ext => ext !== 'svg',
    ),
    // Add svg to source extensions for react-native-svg-transformer
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = withNativeWind(mergeConfig(defaultConfig, config), {
  input: './global.css',
});

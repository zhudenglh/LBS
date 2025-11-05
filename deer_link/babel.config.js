module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@api': './src/api',
          '@types': './src/types',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
          '@i18n': './src/i18n',
        },
      },
    ],
  ],
};

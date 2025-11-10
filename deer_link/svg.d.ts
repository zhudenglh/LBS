// SVG Type Declaration for react-native-svg-transformer
// This allows TypeScript to recognize .svg imports as React components

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

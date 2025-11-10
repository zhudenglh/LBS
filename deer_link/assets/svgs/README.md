# SVG Assets Mapping

This directory contains all SVG assets converted from Figma Desktop local server.

## URL to File Mapping

| Original Figma URL Hash | Local Filename | Usage Description |
|-------------------------|----------------|-------------------|
| 1e67e466904771282f83b62e84eab34b326ffea2 | bus-icon.svg | Bus icon in header |
| bbcadc8407cb387de8f261b1cd1545fa7877d2de | wifi-icon.svg | WiFi icon in header |
| 394c3b6c38e62d4a113ac138fe357650f8786c6d | arrow-right.svg | Right arrow for "more" buttons |
| 7077eaa97425335352e3ab56f42205c41778037a | toilet-icon.svg | Toilet service icon |
| 8d8aa485478eeff5b3aad3210e6f40643709dea7 | store-icon.svg | Convenience store icon |
| 4667c4f81e1863df773ace76d13e126ae02bacbe | pharmacy-icon.svg | Pharmacy icon |
| d6dfb9ac9d46e65c66bf93008c9f32a7cddffd81 | location-icon.svg | Location pin icon |
| c91d8e109b6f6e592e8c90360c4d60b46dc0c0e4 | card-bg.svg | Card background decoration |
| 7300ecaa1a0373f4692d551a6d12dea85da511e7 | more-dots.svg | Three dots "more" icon |
| 2b71a6171a816201f2a21bd4713397641bee21d2 | vector-arrow.svg | Vector arrow for transfers |
| 4daae69147fb03e94c4d4fc7f4d15166aa7e6b35 | reminder-icon.svg | Reminder bell icon |
| 5a837212022346c1333e4640725f92194cd12498 | rectangle-9707.svg | Decorative rectangle |
| e784c26e4c4f8250677dc40adc01c310e81c315f | rectangle-9708.svg | Decorative rectangle |
| fb23fc2749601be9fc18281f1de2e3e163580700 | car-shadow.svg | Car position shadow |
| ff1ec933214bc415ef5661e5cf53196074fb5883 | line-passed-gray.svg | Gray line for passed stations |
| cb14ed788c537eb9990c9d495d65a141bfaa6edc | line-future-green.svg | Green line for future stations |
| d8465e5e980eaece3c42795dca38c903bb3f1788 | dashed-arrow.svg | Dashed arrow decoration |
| 2060b5c8a1ddbbe78172d4533f2c67498b8465b6 | dot-passed-gray.svg | Gray dot for passed stations |
| e7db8fdc5418c49cad7db51a0990a2401d5aa8cc | dot-bus-gray.svg | Gray dot for bus position |
| 1fc795ef90105b1abf9e72571d6a1e8e57730422 | dot-next-big-green.svg | Big green dot for next station |
| 1945f4af92a0204f09245b30bfff5509e65ec6c7 | dot-future-green.svg | Green dot for future stations |

## Import Usage

```typescript
import BusIcon from '../../assets/svgs/bus-icon.svg';
import WifiIcon from '../../assets/svgs/wifi-icon.svg';

// In component:
<BusIcon width={20} height={20} />
<WifiIcon width={24} height={24} fill="#1293FE" />
```

## Notes

- All SVG files support standard props: `width`, `height`, `fill`, etc.
- Downloaded from Figma Desktop MCP server on 2025-11-09
- Used in React Native via `react-native-svg-transformer`
- **Cleaned**: All SVG files have been cleaned to remove React Native unsupported features:
  - CSS variables (`var(...)`) replaced with actual color values
  - Style tags and attributes removed
  - Class attributes removed
  - Unsupported attributes removed

## Updating SVG Files

If you need to re-download SVG files from Figma:

1. Download the SVG files to this directory
2. Run the cleaning script:
   ```bash
   node scripts/clean-svgs.js
   ```

This will automatically remove all React Native unsupported features.

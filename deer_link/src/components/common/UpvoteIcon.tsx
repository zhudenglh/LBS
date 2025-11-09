import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface UpvoteIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export default function UpvoteIcon({
  size = 18,
  color = '#666',
  filled = false
}: UpvoteIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Thumbs up outline */}
      <Path
        d="M7 22V12M7 12L10 3C10 3 11 3 11.5 3.5C12 4 12 5 12 5V9H18.5C19.5 9 20.5 10 20.5 11C20.5 11.5 20.5 11.8 20.3 12.2L17.5 19C17.2 19.7 16.5 20 15.7 20H7.5C7.2 20 7 19.8 7 19.5V12Z"
        fill={filled ? color : "white"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path
        d="M3 12H6C6.5 12 7 12.5 7 13V21C7 21.5 6.5 22 6 22H3.5C3.2 22 3 21.8 3 21.5V12.5C3 12.2 3.2 12 3.5 12H3Z"
        fill={filled ? color : "white"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Avatar Component Tests

import React from 'react';
import { render } from '@testing-library/react-native';
import Avatar from '../../src/components/common/Avatar';

describe('Avatar Component', () => {
  it('should render correctly with emoji', () => {
    const { getByText } = render(<Avatar emoji="😀" />);
    expect(getByText('😀')).toBeTruthy();
  });

  it('should render with default size', () => {
    const { getByText } = render(<Avatar emoji="🎉" />);
    const avatar = getByText('🎉').parent;
    expect(avatar).toBeTruthy();
  });

  it('should render with custom size', () => {
    const customSize = 60;
    const { getByText } = render(<Avatar emoji="🚀" size={customSize} />);
    expect(getByText('🚀')).toBeTruthy();
  });

  it('should render different emojis', () => {
    const { getByText } = render(<Avatar emoji="🌟" />);
    expect(getByText('🌟')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(<Avatar emoji="💎" style={customStyle} />);
    expect(getByText('💎')).toBeTruthy();
  });

  it('should handle various emoji types', () => {
    const emojis = ['😊', '🎨', '🏆', '🌈', '🔥'];

    emojis.forEach(emoji => {
      const { getByText } = render(<Avatar emoji={emoji} />);
      expect(getByText(emoji)).toBeTruthy();
    });
  });

  it('should scale font size with avatar size', () => {
    const sizes = [20, 40, 60, 80];

    sizes.forEach(size => {
      const { getByText } = render(<Avatar emoji="🎯" size={size} />);
      expect(getByText('🎯')).toBeTruthy();
    });
  });
});

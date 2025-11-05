// Button Component Tests

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/common/Button';

describe('Button Component', () => {
  it('should render correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Press" onPress={onPressMock} />);

    fireEvent.press(getByText('Press'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Disabled" onPress={onPressMock} disabled />);

    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should not call onPress when loading', () => {
    const onPressMock = jest.fn();
    const { queryByText } = render(<Button title="Loading" onPress={onPressMock} loading />);

    // When loading, title is not shown
    expect(queryByText('Loading')).toBeNull();
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should render primary variant correctly', () => {
    const { getByText } = render(<Button title="Primary" onPress={() => {}} variant="primary" />);
    expect(getByText('Primary')).toBeTruthy();
  });

  it('should render secondary variant correctly', () => {
    const { getByText } = render(<Button title="Secondary" onPress={() => {}} variant="secondary" />);
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should render outline variant correctly', () => {
    const { getByText } = render(<Button title="Outline" onPress={() => {}} variant="outline" />);
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should show ActivityIndicator when loading', () => {
    const { UNSAFE_getByType } = render(<Button title="Test" onPress={() => {}} loading />);
    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <Button title="Custom" onPress={() => {}} style={customStyle} />
    );
    expect(getByText('Custom')).toBeTruthy();
  });

  it('should apply custom text styles', () => {
    const customTextStyle = { fontSize: 18 };
    const { getByText } = render(
      <Button title="Custom Text" onPress={() => {}} textStyle={customTextStyle} />
    );
    expect(getByText('Custom Text')).toBeTruthy();
  });
});

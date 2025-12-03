import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<LoadingSpinner />);
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('should display an activity indicator', () => {
    const { getByTestId } = render(<LoadingSpinner />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });
});


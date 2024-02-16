import { render } from '@testing-library/react-native'; // Use react-native testing library
import React from 'react';
import { AuthProvider } from '/Users/eric/gb/get-better/src/context/auth/AuthProvider';

describe('AuthProvider', () => {
  it('renders without crashing', () => {
    const screen = render(<AuthProvider />);
    expect(screen).toBeDefined();

  });

  // it('calls signIn function when sign in button is clicked', () => {
  //   const { getByText } = render(<AuthProvider />);
  //   const signInButton = getByText('Sign In');
  //   const signInMock = jest.fn();
    
  //   fireEvent.press(signInButton); // Use fireEvent.press for button click
  //   expect(signInMock).toHaveBeenCalled();
  // });

  // it('calls signOut function when sign out button is clicked', () => {
  //   const { getByText } = render(<AuthProvider />);
  //   const signOutButton = getByText('Sign Out');
  //   const signOutMock = jest.fn();

  //   fireEvent.press(signOutButton); // Use fireEvent.press for button click
  //   expect(signOutMock).toHaveBeenCalled();
  // });

  // Add more tests for other functions and components as needed
});

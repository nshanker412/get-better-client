import { createContext } from 'react';
import { AuthContextProps } from './Auth.types';

const defaultContextValue: AuthContextProps = {
	userToken: null,
	sendPasswordResetEmail: () => Promise.resolve(),
	signIn: () => Promise.resolve(),
	signUp: () => Promise.resolve(),
	signOut: () => Promise.resolve(),
};

export const AuthContext = createContext<AuthContextProps>(
	defaultContextValue,
);

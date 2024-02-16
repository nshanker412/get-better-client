import { createContext } from 'react';
import { AuthContextProps } from './Auth.types';

export const AuthContext = createContext<AuthContextProps | undefined>(
	undefined,
);

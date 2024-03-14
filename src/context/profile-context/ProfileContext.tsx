import { createContext } from 'react';
import { ProfileContextValue, defaultProfileContextValue } from './ProfileContext.types';

export const ProfileContext = createContext<ProfileContextValue>(
	defaultProfileContextValue
);
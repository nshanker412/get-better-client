import { createContext } from 'react';
import { BottomTabNavContextValue } from './BottomTabNav.types';

export const BottomTabNavContext = createContext<
	BottomTabNavContextValue | undefined
>(undefined);

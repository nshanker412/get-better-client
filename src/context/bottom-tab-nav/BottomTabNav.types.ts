import { ReactNode } from 'react';

export interface BottomTabNavContextProps {
	tabnav: any;
	children: ReactNode;
}

export interface BottomTabNavContextValue {
	isHomeTabPressed: boolean;
	onHomeTabPressWhenFocused: (cb: () => void) => void;
}

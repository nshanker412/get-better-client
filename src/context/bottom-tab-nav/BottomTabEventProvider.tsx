import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BottomTabNavContext } from './BottomTabContext';
import {
	BottomTabNavContextProps,
	BottomTabNavContextValue,
} from './BottomTabNav.types';

export const BottomTabEventProvider: React.FC<BottomTabNavContextProps> = ({
	tabnav,
	children,
}) => {
	const [isTabPressed, setIsTabPressed] = useState<boolean>(false);
	// const [isFocused, setIsFocused] = useState<boolean>(false);
	const focusedRef = useRef(true);
	const [homeTabPressCallback, setHomeTabPressCallback] = useState<
		(() => void) | null
	>(null);

	useEffect(() => {
		const unsubscribeFocus = tabnav.addListener('focus', (e) => {
			console.log('focusChange', e);
			focusedRef.current = true;
		});

		const unsubscribeBlur = tabnav.addListener('blur', (e) => {
			console.log('blurChange', e);
			focusedRef.current = false;
		});

		return () => {
			unsubscribeFocus();
			unsubscribeBlur();
		};
	}, [tabnav]);

	useEffect(() => {
		console.log('registering cbn', homeTabPressCallback);
		const unsubscribeTabPress = tabnav.addListener('tabPress', (e) => {
			console.log('tabPress', e);

			if (focusedRef.current) {
				homeTabPressCallback && homeTabPressCallback();
			}

			setIsTabPressed(true);
		});

		return () => {
			unsubscribeTabPress();
		};
	}, [homeTabPressCallback]);

	useEffect(() => {
		console.log('isTabPressed', isTabPressed);
	}, [isTabPressed]);

	const onHomeTabPressWhenFocused = useCallback((cb: () => void) => {
		setHomeTabPressCallback(() => cb);
	}, []);

	const contextValue: BottomTabNavContextValue = {
		isHomeTabPressed: isTabPressed,
		onHomeTabPressWhenFocused,
	};

	return (
		<BottomTabNavContext.Provider value={contextValue}>
			{children}
		</BottomTabNavContext.Provider>
	);
};

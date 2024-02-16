import { useThemeContext } from '@context/theme/useThemeContext';
import React, { useCallback, useEffect, useRef } from 'react';
import { ScreenModeToggle } from './ScreenModeToggle';

/**
 * Toggle in profile settings to allow the user to toggle light/dark theme. Drives state management
 * through theme context provider. Dark mode by default, toggle enabled = lightMode
 * @returns
 */
export const ConnectedScreenModeToggle: React.FC = React.memo(() => {
	const { darkMode, updateDarkMode } = useThemeContext();
	const prevDarkMode = useRef<boolean | undefined>(undefined);

	const changeThemeMode = useCallback(
		(isNextThemeDark: boolean) => {
			// Only update if the value is different
			if (isNextThemeDark !== darkMode) {
				updateDarkMode(isNextThemeDark);
			}
		},
		[darkMode, updateDarkMode],
	);

	const toggle = useCallback(
		(isNextDarkMode: boolean) => {
			changeThemeMode(isNextDarkMode);
			console.log(`New screenMode ${isNextDarkMode}`);
		},
		[changeThemeMode],
	);

	useEffect(() => {
		// Check if darkMode has changed before logging
		if (prevDarkMode.current !== darkMode) {
			console.log(`ScreenMode is ${darkMode}`);
			// Update the ref to the current value
			prevDarkMode.current = darkMode;
		}
	}, [darkMode]);

	return (
		<ScreenModeToggle
			onToggle={toggle}
			isEnabled={!!darkMode}
		/>
	);
});

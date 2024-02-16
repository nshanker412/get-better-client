import React, { createContext, useCallback, useEffect, useState } from 'react';
import { fontAssets } from './fonts';
import { darkTheme, lightTheme } from './theme';

export const ThemeContext = createContext({
	theme: darkTheme,
	darkMode: true,
	updateDarkMode: (isNextDarkMode) => {},
	fontsLoaded: false,
});

export const ThemeContextProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(true);
	const [theme, setTheme] = useState(darkTheme);

	const [didLoad, setDidLoad] = useState(false);

	const handleLoadAssets = async () => {
		// assets preloading
		await Promise.all([...fontAssets]);
		setDidLoad(true);
	};
	useEffect(() => {
		handleLoadAssets();
	}, []);

	useEffect(() => {
		setTheme(darkMode ? darkTheme : lightTheme);
	}, [darkMode]);

	// Toggle function to switch between light and dark mode
	const updateDarkMode = useCallback(
		(isNextDarkMode) => {
			if (isNextDarkMode !== darkMode) {
				setDarkMode(isNextDarkMode);
			}
		},
		[darkMode, setDarkMode],
	);

	// Provide the state and functions through the context
	const contextValue = {
		theme,
		darkMode,
		updateDarkMode,
		fontsLoaded: didLoad,
	};

	// Render children when fonts are loaded
	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
};

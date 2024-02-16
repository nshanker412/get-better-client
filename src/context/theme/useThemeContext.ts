// useThemeContext.js
import { useContext } from 'react';
import { ThemeContext } from './ThemeContextProvider'; // Adjust the path based on your project structure

// Custom hook to access the theme context
export const useThemeContext = () => {
	return useContext(ThemeContext);
};

import React, { useCallback, useState } from 'react';
import { SearchBar } from './SearchBar';
import { ConnectedSearchBarProps } from './SearchBar.types';

/**
 * Connected SearchBar Component
 * Details:
 */
export const ConnectedSearchBar: React.FC<ConnectedSearchBarProps> = ({
	onSearchChange,
}) => {
	const [keyword, setKeyword] = useState<string | undefined>('');

	const inputChange = useCallback(
		(text) => {
			setKeyword(text);
			onSearchChange(text);
		},
		[onSearchChange],
	);

	return (
		<SearchBar
			onChangeText={inputChange}
			keyword={keyword}
		/>
	);
};

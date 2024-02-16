export interface ConnectedSearchBarProps {
	onSearchChange: (text: string | undefined) => void;
}

export interface SearchBarProps {
	keyword?: string;
	onChangeText: (text: string | undefined) => void;
}

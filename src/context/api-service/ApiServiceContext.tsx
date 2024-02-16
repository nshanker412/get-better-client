import React, { ReactNode, createContext, useContext } from 'react';
import ApiService from '../../service/api/ApiService';

interface ApiContextProviderProps {
	children: ReactNode;
}

// Create contexts for both services
const ApiServiceContext = createContext<ApiService | undefined>(undefined);

// Create a provider component that wraps your app
export const ApiServiceContextProvider: React.FC<ApiContextProviderProps> = ({
	children,
}) => {
	// Create singleton instances of services
	const api = new ApiService(process.env.EXPO_PUBLIC_SERVER_BASE_URL ?? ''); // Replace 'your-base-url' with the actual base URL

	return (
		<ApiServiceContext.Provider value={api}>
			{children}
		</ApiServiceContext.Provider>
	);
};

export const useApiService = (): ApiService => {
	const context = useContext(ApiServiceContext);

	if (!context) {
		throw new Error(
			'useApiService must be used within an ApiContextProvider',
		);
	}

	return context;
};

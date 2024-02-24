import React from 'react';
import { ProfileBody } from './ProfileBody';
import { ConnectedProfileBodyProps } from './ProfileBody.types';

/**
 * Connected ProfileBody Component
 * Details:
 */
export const ConnectedProfileBody: React.FC<ConnectedProfileBodyProps> = ({
	isMyProfile,
	username, 
}) => {


	return <ProfileBody isMyProfile={isMyProfile} username={username} />;
};

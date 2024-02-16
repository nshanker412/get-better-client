import React from 'react';
import { ProfileBody } from './ProfileBody';
import { ConnectedProfileBodyProps } from './ProfileBody.types';
/**
 * Connected ProfileBody Component
 * Details:
 */
export const ConnectedProfileBody: React.FC<ConnectedProfileBodyProps> = ({
	isMyProfile,
}) => {
	return <ProfileBody isMyProfile={isMyProfile} />;
};

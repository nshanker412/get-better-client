import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useNotifications } from '@context/notifications/useNotifications';
import { useThemeContext } from '@context/theme/useThemeContext';
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Linking, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { timeAgo } from '../../utils/timeAgo';
import { Header } from '../header/Header';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useNotificationsStyles } from './Notifications.styles';

export const Notifications = () => {
    const { theme } = useThemeContext();
    const navigation = useNavigation();
    const notificationStyles = useNotificationsStyles();
    const { notifications, permissionsGranted, refreshNotifications, setNotificationsSeen } = useNotifications();
    const [refreshing, setRefreshing] = useState(false);
    const {username: myUsername} = useMyUserInfo();


    useEffect(() => {
        setNotificationsSeen();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshNotifications();
        setRefreshing(false);
    };

    const renderItem = ({ item }) => {
        const itemUsername = item.content.split(' ')[0];
        const itemContent = item.content.split(' ').slice(1).join(' ');
        
        let itemLink = {
            screen: 'profile',
            params: { profileUsername: itemUsername },
        };

        if (itemContent.includes('motivating')){
            itemLink = {
                screen: 'profile',
                params: {
                    profileUsername: itemUsername,
                    linkPostID: item.timestamp,
                },
            };
        }
        else if (itemContent.includes('liked') || itemContent.includes('commented')) {
            itemLink = {
                screen: 'profile',
                params: {
                    profileUsername: myUsername,
                    linkPostID: item.timestamp,
                },
            };
        }
        else if (itemContent.includes('challenge')) {
            itemLink = {
                screen: 'createPost',
                params: {
                    challengeUsername: itemUsername,
                    challengeID: item.challengeID,
                    challenge: item.content,


                },
            };
        }

        return (
            <TouchableOpacity onPress={() => navigation.navigate(itemLink.screen, itemLink.params)} style={notificationStyles.notificationContainer}>
                <ConnectedProfileAvatar key={itemUsername} username={itemUsername} fetchSize={300} size={40} />
                <View style={notificationStyles.notificationInfoContainer}>
                    <Text style={notificationStyles.notificationUser}>{itemUsername}</Text>
                    <Text style={notificationStyles.notificationContent}>{itemContent}</Text>
                    <Text style={notificationStyles.timestamp}>{timeAgo(item.timestamp)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Header />
            <TouchableOpacity
                style={notificationStyles.backArrowContainer}
                onPress={() => navigation.goBack()}>
                <EvilIcons name="chevron-left" size={50} color={theme.textColorPrimary} />
            </TouchableOpacity>
            <View style={notificationStyles.notificationsContainer}>
                {!permissionsGranted && (
                    <View style={notificationStyles.settingsContainer}>
                        <Text style={{ color: theme.textColorPrimary }}>
                            Please enable notifications in your settings.
                        </Text>
                        <TouchableOpacity
                            style={notificationStyles.settingsButton}
                            onPress={() => Linking.openSettings()}>
                            <Text style={notificationStyles.settingsButtonText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `notification-${index}`}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.textColorPrimary]} />}
                    contentContainerStyle={notificationStyles.notificationsScroll}
                />
            </View>
        </>
    );
};

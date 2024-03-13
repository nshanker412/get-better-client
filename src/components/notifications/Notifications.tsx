import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useNotifications } from '@context/notifications/useNotifications';
import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { EvilIcons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { Linking, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { timeAgo } from '../../utils/timeAgo';
import { Header } from '../header/Header';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useNotificationsStyles } from './Notifications.styles';
import { ShimmerTile } from './skeleton/ShimmerTile';

// helper to remove preceding " {username} commented " text from comment notifications
const removeCommented = (content: string) => {
    return content.split(' ').slice(1).join(' ');
};

const CommentLoadingShimmer = () => {
	return (
		<View style={{ flex: 1 }}>
			<ShimmerTile opacity={0.6} />
			<ShimmerTile opacity={0.5} />
			<ShimmerTile opacity={0.4} />
			<ShimmerTile opacity={0.3} />
			<ShimmerTile opacity={0.2} />
			<ShimmerTile opacity={0.1} />
		</View>
	);
}


enum NotificationType {
    LIKE = 'like',
    COMMENT = 'comment',
    MOTIVATE = 'motivate',
    CHALLENGE = 'challenge',
}

export const Notifications = ({route}) => {
    const { theme } = useThemeContext();
    const {goBack, navigate, dispatch} = useNavigation();
    const notificationStyles = useNotificationsStyles();
    const { unreadNum, notifications, permissionsGranted, refreshNotifications, setNotificationsSeen } = useNotifications();
    const [refreshing, setRefreshing] = useState(false);
    const { username: myUsername } = useMyUserInfo();


    useEffect(() => {

        // if routed from deep link, refresh

        if (route?.params?.refreshNotifs) {
            refreshNotifications(myUsername);
        }
    }, [route?.params?.refreshNotifs]);


    useEffect(() => {

        return () => setNotificationsSeen();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (myUsername) {
            await refreshNotifications(myUsername);
        }
        setRefreshing(false);
    };

    const renderItem = ({ item, index }) => {

        console.log("notification packet=>>>> ", item);
        const itemUsername = item.content.split(' ')[0];
        const itemContent = item.content.split(' ').slice(1).join(' ');

        let itemLink = {
            screen: 'profile',
            params: { profileUsername: itemUsername },
        };
        let type: 'motivate' | 'like' | 'comment' | 'challenge' = 'motivate';

        if (itemContent.includes('motivating')){
            itemLink = {
                screen: 'profile',
                params: {
                    profileUsername: itemUsername,
                    linkPostID: undefined,
                },
            };
            type = 'motivate';
        }
        else if (itemContent.includes('liked')) {
            itemLink = {
                screen: 'profile',
                params: {
                    profileUsername: myUsername,
                    linkPostID: item.postID,
                },
            };
            type = 'like';
        }
        else if (itemContent.includes('commented')) {
            itemLink = {
                screen: 'profile',
                params: {
                    profileUsername: myUsername,
                    linkPostID: item.postID,
                },
            };
            type = 'comment';
        }
        else if (itemContent.includes('challenged')) {
            itemLink = {
                screen: 'post',
                params: {
                    challengeUsername: itemUsername,
                    challengeID: `${item.timestamp}`,
                    challenge: item.challenge,
                },
            };
            type = 'challenge';
        }

        let notifStyle = notificationStyles.unreadNotificationContainer;
        if (!unreadNum) {
            notifStyle = notificationStyles.notificationContainer;
        } else if (index >= unreadNum) {
            notifStyle = notificationStyles.notificationContainer;
        }

        const onNav = () => {
            if (itemLink) {
                
                dispatch(
                    CommonActions.navigate({
                        name: itemLink.screen,
                        params: itemLink.params,
                    })
                );
            }
        }

        switch (type) {
            case NotificationType.LIKE:
                return (
                    <TouchableOpacity
                        onPress={onNav}
                        style={notifStyle}>
                        <ConnectedProfileAvatar
                            key={itemUsername}
                            username={itemUsername}
                            fetchSize={300}
                            size={40}
                        />
                        <View style={notificationStyles.notificationInfoContainer}>
                            <View style={{ flexDirection: 'row'  }}>
                                <Text style={notificationStyles.notificationUser}>{itemUsername}</Text>
                                <Text style={notificationStyles.notificationTypeContent}>{" liked your post"}</Text>
                            </View>
                            <Text style={notificationStyles.timestamp}>{timeAgo(item.timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                );
            case NotificationType.COMMENT:
                return (
                    <TouchableOpacity
                        onPress={onNav}
                        style={notifStyle}>
                        <ConnectedProfileAvatar
                            key={itemUsername}
                            username={itemUsername}
                            fetchSize={300}
                            size={40}
                        />
                        <View style={notificationStyles.notificationInfoContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline'}}>
                                <Text style={notificationStyles.notificationUser}>{`${itemUsername} `}</Text>
                                <Text style={notificationStyles.notificationTypeContent}>{"commented"}</Text>
                            </View>
                            <Text style={notificationStyles.subcontentText}>{`"${removeCommented(itemContent)}"`}</Text>
                            <Text style={notificationStyles.timestamp}>{timeAgo(item.timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                );
            case NotificationType.MOTIVATE:
                return (
                    <TouchableOpacity
                        onPress={onNav}
                        style={notifStyle}>
                        <ConnectedProfileAvatar
                            key={itemUsername}
                            username={itemUsername}
                            fetchSize={300}
                            size={40}
                        />
                        <View style={notificationStyles.notificationInfoContainer}>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <Text style={notificationStyles.notificationUser}>{itemUsername}</Text>
                                <Text style={notificationStyles.notificationContent}>{itemContent}</Text>
                            </View>
                            <Text style={notificationStyles.timestamp}>{timeAgo(item.timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                );
                  case NotificationType.CHALLENGE:
                return (
                    <TouchableOpacity
                        onPress={onNav}
                        style={[notifStyle, {flexShrink: 1, maxHeight: 200, height: "auto", justifyContent: "flex-start", alignItems: "flex-start"} ] }>
                        <ConnectedProfileAvatar
                            key={itemUsername}
                            username={itemUsername}
                            fetchSize={300}
                            size={40}
                        />
                        <View style={[notificationStyles.notificationInfoContainer, {gap: 10}]}>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <Text style={notificationStyles.notificationUser}>{itemUsername}</Text>
                                <Text style={notificationStyles.notificationContent}>{itemContent}</Text>
                            </View>
                   

                            <Text style={notificationStyles.timestamp}>{timeAgo(item.timestamp)}</Text>
                            <View style={{ flexShrink: 1, alignSelf: "flex-start", borderColor: theme.innerBorderColor, borderWidth: 1,  borderRadius: 10, flexDirection: "column", justifyContent: "center", alignItems: "center",  width: "auto" , padding: 10 }}>
                                <View style={{ width: "100%", alignSelf: "flex-start",  justifyContent: "flex-start", flexDirection: "row", alignItems: "center",   padding: 10 }}>
                                    <Text style={{ color: theme.textColorPrimary, fontSize: 14, fontFamily: fonts.inter.black}}>{"Challenge:  "}</Text>
                                    <Text style={{ color: theme.textColorPrimary, fontSize: 14, fontFamily: fonts.inter.extra_light }}>{item.challenge}</Text>
                                </View>
                                <Pressable
                                    style={{ padding: 10, borderRadius: 10, backgroundColor: 'black', borderColor: theme.textColorPrimary, borderWidth: 1, width: "auto" }}
                                   
                                    onPress={onNav}
                                >

                                    <Text style={{ color: theme.textColorPrimary, fontSize: 16, fontFamily: fonts.inter.black }}>Complete</Text>
                                </Pressable>
                                
                            </View>
                            </View>


                    </TouchableOpacity>
                );
            default:
                return (
                    <TouchableOpacity
                        onPress={onNav}
                        style={notifStyle}>
                        <ConnectedProfileAvatar
                            key={itemUsername}
                            username={itemUsername}
                            fetchSize={300}
                            size={40}
                        />
                        <View style={notificationStyles.notificationInfoContainer}>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <Text style={notificationStyles.notificationUser}>{itemUsername}</Text>
                                <Text style={notificationStyles.notificationContent}>{itemContent}</Text>
                            </View>
                            <Text style={notificationStyles.timestamp}>{timeAgo(item.timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                );
        }
        
    };


    const NotificationListHeader = () => {
        return (
            <View style={notificationStyles.headerContainer}>
            <TouchableOpacity
                    // style={notificationStyles.backArrowContainer}
                style={{ height: 60, width: 50, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => goBack()}>
                <EvilIcons name="chevron-left" size={50} color={theme.textColorPrimary} />
            </TouchableOpacity>
            <View
                style={
                    notificationStyles.headerInnerContainer
                }>
                <Text style={notificationStyles.headerText}>
                    Notifications
                </Text>
            </View>
        </View>
        );
    }

	const Divider = () => {
        return (
            <View style={{padding: 5}} >
			<View style={{
				width: "90%",
				alignSelf: "center",
				backgroundColor: theme.div.color,
				opacity: theme.div.opacity,
				height: StyleSheet.hairlineWidth,
			}} />
            </View>
		);
	  };

    return (
        <>
            <Header />
      
            <View style={notificationStyles.notificationsContainer}>
                {!permissionsGranted && (
                    <View style={notificationStyles.settingsContainer}>
                        <Text style={{ color: theme.textColorPrimary }}>
                            Please enable notifications in your settings.
                        </Text>
                        <TouchableOpacity
                            style={notificationStyles.settingsButton}
                            onPress={() => Linking.openSettings()}>
                            <Text style={notificationStyles.notificationUser}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <NotificationListHeader />
                <View style={{flex: 1, width: "100%", minHeight: 400}}>
                <FlashList
                    data={notifications ??  []}
                    ListEmptyComponent={CommentLoadingShimmer }
                        renderItem={renderItem}
                    ItemSeparatorComponent={Divider}
                    keyExtractor={(item, index) => `notification-${index}`}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.textColorPrimary]} tintColor={theme.textColorPrimary} />}
                    estimatedItemSize={100}
                    // contentContainerStyle={notificationStyles.notificationsScroll}
                    />
                    </View>
            </View>
        </>
    );
};

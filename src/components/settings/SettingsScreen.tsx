import { ButtonAsync } from '@components/primitives/async-button/ButtonAsync';
import { ConnectedProfileAvatar } from '@components/profile-avatar/ConnectedProfileAvatar';
import { useAuth } from '@context/auth/useAuth';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useNotifications } from '@context/notifications/useNotifications';
import { blue, grayDark, red } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Switch } from '@rneui/base';
import * as Application from 'expo-application';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import axios from 'axios';

const PRIVACY_POLICY_URL = 'https://getbetterbrand.com/privacy-policy';
const EULA = 'https://getbetterbrand.com/eula';

export const SettingsScreen = ({ navigation }) => {
  
  const { removePushToken } = useNotifications();
  const { signOut, userToken, sendPasswordResetEmail } = useAuth();

  const [sendPasswordResetLoading, setSendPasswordResetLoading] = useState(false);


  const [appVersion, setAppVersion] = useState();
  const [buildVersion, setBuildVersion] = useState();


  useEffect(() => {

    // console.log('SettingsScreen mounted', Application.nativeApplicationVersion);
    const appVersion = Application.nativeApplicationVersion;
    setAppVersion(appVersion);


    const buildVersion = Application.nativeBuildVersion;
    console.log('appVersion', appVersion);
    setBuildVersion(buildVersion);

    // });
  }, []);


  

  const [logoutLoading, setLogoutLoading] = useState(false);
  const styles = useSettingsScreenStyles();
  const { username: myUsername, myData, onLogout } = useMyUserInfo();
  
  
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    allPushNotificationsEnabled: true,
  });

  const onPressEditProfile = () => {
    navigation.navigate('profileEdit');
  }
  const onBlockedUsersPage = () =>{
    navigation.navigate('blockedUsers');
  }


  const onLogoutPress = async (): Promise<void> => {
    setLogoutLoading(true);
		try {
			await onLogout();
			await removePushToken();
			await signOut();
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
      setLogoutLoading(false);

		}
  };

  const onConfirmPasswordReset = async (email : string) => {
    setSendPasswordResetLoading(true);
    try {
      console.log('onConfirmPasswordReset');
      await sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }
  
  const resetPasswordAlert = async() => {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
    );
    Alert.alert(
      'Reset Password', // Alert Title',
      `This action will send a reset password link to ${response.data.email}.`, // Alert Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: () => {
            console.log('Send Pressed');
            onConfirmPasswordReset(response.data.email);

          },
          style: 'destructive', // This will make the text color red on iOS
        },
      ],
      { cancelable: true }
    );
    }

  useEffect(() => {
    console.log('SettingsScreen mounted');
    return () => {
      console.log('SettingsScreen unmounted');
    };

  }, [logoutLoading]);

  const deleteAccountAlert = () => {
    Alert.alert(
      'Permanently Delete my account?', // Alert Title',
      'This action will delete your account and associated data. This cannot be undone.', // Alert Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            console.log('Delete Pressed');
            deleteAccountAlert2();
          },
          style: 'destructive', // This will make the text color red on iOS
        },
      ],
      { cancelable: true }
    );
  };
  const deleteAccountAPICall = async () => {
    try {
      await axios({
				method: "post",
				url: `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me/delete_user`,
				data: {"delete":true},
				headers: {"Authorization" : `Bearer ${userToken}`,'Content-Type': 'multipart/form-data'},
			}).then(res=>{
        console.log("deactivate res",res);
        
      }).catch(err=>{
        console.log("deactivate err",err);
      })
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }
  const deleteAccountAlert2 = () => {
    Alert.alert(
      'Absolutely sure?', // Alert Title',
      'This action is non-recoverable', // Alert Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            console.log('Delete Pressed');
            deleteAccountAPICall()
            onLogoutPress();
          },
          style: 'destructive', // This will make the text color red on iOS
        },
      ],
      { cancelable: true }
    );
  };


  const sendFeatureInDevelopmentAlert = () => {
    Alert.alert(
      'Feature in development', // Alert Title',
      'This feature is not yet available', // Alert Message
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={styles.container}>
      {/* <ScreenHeader title="Settings"  subtitle="edit your settings"/> */}

        <ScrollView

         
        >
          <View style={styles.profile}>
            <ConnectedProfileAvatar 
              username={myUsername}
              disableLink={true}
              size={80}
            />


          <Text style={styles.profileUsername}>{`@${myUsername}`}</Text>
            <Text style={styles.profileName}>{myData?.name}</Text>
            <Text style={styles.profileEmail}>{myData?.email}</Text>
            {/* {myData?.bio && (
              <View style={styles.bioContainer}>
                <Text style={styles.bioText}>
                  {myData?.bio}
                </Text>
              </View>
            )} */}


            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" ,  borderRadius: 20,}}>
						
						
						{/* <ButtonAsync
							containerStyle={{ width: 80, height: 25, backgroundColor: 'transparent', borderColor: blue.blue5,}}
                buttonStyle={{
                  width: 80,
                  height: 25,
                  paddingHorizontal: 2,
                  paddingVertical: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: blue.blue5,
                  // backgroundColor: blue.blue1,
                  backgroundColor: 'transparent'
                }}
							textStyle={{
								color: blue.blue5,
								fontSize: 10,
								fontFamily: fonts.inter.bold,
                
								fontWeight: 'bold',
							}}
							onPress={onPressEditProfile}
							title='edit profile'
							size='sm'
							type='outline'
						icon={<AntDesign name="edit" size={15} color={blue.blue5} />}
          
							loading={false}
							// loadingSize='sm'
							loadingStyle={{ marginRight: 0 }}
			/> */}
		  </View>

       
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="person" size={24} color={grayDark.gray10}  />
              <Text style={styles.sectionTitle}>Account</Text>
              </View>

            <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    onPressEditProfile();
                  
                  }}
                  style={styles.row}>
                  <Text style={styles.rowLabel}>Edit Public Profile</Text>
                  <View style={styles.rowSpacer} />
                  <AntDesign name="edit" size={25} color={blue.blue5} />
                  <FeatherIcon
                    color={blue.blue5}
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>
              </View>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    onBlockedUsersPage();
                  
                  }}
                  style={styles.row}>
                  <Text style={styles.rowLabel}>Blocked Users</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                  
                </TouchableOpacity>
              </View>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    resetPasswordAlert()
                  }}
                  style={styles.row}>
                  <Text style={styles.rowLabel}>Reset password</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>
              </View>

    

              {/* <View style={styles.rowWrapper}>
                <View style={styles.row}>
            

                  <Text style={styles.rowLabel}>Dark Mode</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={darkMode => setForm({ ...form, darkMode })}
                    value={form.darkMode} />
                </View>
              </View> */}

              <View style={styles.rowWrapper}>
      
              <View style={styles.row}>

                  <Text style={[styles.rowLabel, {color: red.red6}]}>Delete Account</Text>

                  <View style={styles.rowSpacer} />

                  {/* <Text style={styles.rowValue}>Los Angeles, CA</Text> */}
                  <TouchableOpacity
                    onPress={() => { deleteAccountAlert() }}>
                  <MaterialIcons name="delete" size={24} color={red.red6} />
              
                </TouchableOpacity>
                </View>
                </View> 
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <MaterialIcons name="notifications" size={24} color={grayDark.gray10} />
                <Text style={styles.sectionTitle}>Push Notifications</Text>
              </View>
              <View style={styles.sectionBody}>

              <View style={styles.rowWrapper}>
                  <View style={styles.row}>
                    
                    <Text style={styles.rowLabel}>Enable all</Text>

                    <View style={styles.rowSpacer} />
          

                    <Switch
                      onValueChange={allPushNotificationsEnabled =>
                        setForm({ ...form, allPushNotificationsEnabled })
                      }
                      value={form.allPushNotificationsEnabled}
                      
                    /> 
                    </View>

                </View>
                <View style={styles.rowWrapper}>

                <TouchableOpacity
                  onPress={
                    () => {
                      sendFeatureInDevelopmentAlert();
                  }
                  }
                  disabled={form.allPushNotificationsEnabled === true}
                  style={styles.row}>
                    
                    <Text style={[styles.rowLabel, form.allPushNotificationsEnabled === true && {color: grayDark.gray6}]}>Customize</Text>

                    <View style={[styles.rowSpacer]} />
                        <FeatherIcon
                      color={form.allPushNotificationsEnabled === true ? grayDark.gray6 : "#C6C6C6"}
                    name="chevron-right"
                    size={20} />

      
                  </TouchableOpacity>
                  </View>
              </View> 
            </View>
          
            
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <MaterialIcons name="info-outline" size={24} color={grayDark.gray10} />
                <Text style={styles.sectionTitle}>App Details</Text>
              </View>
              <View style={styles.sectionBody}>

              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={
                    () => {
                    Linking.openURL(PRIVACY_POLICY_URL);
                  }}
                    style={styles.row}
                  >
                    <Text style={styles.rowLabel}>Privacy Policy</Text>
                    <View style={styles.rowSpacer} />
                    <Text style={styles.rowValue}>View</Text>

                        <FeatherIcon
                            color="#C6C6C6"
                            name="chevron-right"
                            size={20} />


                  </TouchableOpacity>
                  </View>

                  <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={
                    () => {
                    Linking.openURL(EULA);
                  }}
                    style={styles.row}
                  >
                    <Text style={styles.rowLabel}>EULA</Text>
                    <View style={styles.rowSpacer} />
                    <Text style={styles.rowValue}>View</Text>

                        <FeatherIcon
                            color="#C6C6C6"
                            name="chevron-right"
                            size={20} />


                  </TouchableOpacity>
                  </View>


                <View style={styles.rowWrapper}>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>App Version</Text>

                    <View style={styles.rowSpacer} />
                                   <Text style={styles.rowValue}>{`${appVersion}`?? "-"}</Text>


      
                  </View>
                </View>
                
                <View style={styles.rowWrapper}>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Build Version</Text>

                    <View style={styles.rowSpacer} />
                    <Text style={styles.rowValue}>{buildVersion ?? "-"}</Text>

      
                  </View>
                  </View>
              </View> 
            </View>

          </View>
          <ButtonAsync 
            hasLG={false}
            containerStyle={
              {
                width: '100%',
                padding: 25,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }
            }
            buttonStyle={ 
              {
                color: red.red8,
                width: '100%',
                borderWidth: 1,
                minWidth: '90%',
                padding: 10,
                gap: 10,
                // backgroundColor: 'transparent',

                alignItems: 'center',


                // justifyContent: 'flex-start',
                // borderColor: red.red8,
                backgroundColor: grayDark.gray2,
                borderColor: grayDark.gray4, 
                // borderWidth: 1,
              }
            }
            textStyle={{
              fontFamily: fonts.inter.semi_bold,
              color: red.red6,

              fontSize: 20,
              alignSelf: 'center',
              textAlign: 'center',
            }}
            loadingStyle={{
                color: red.red8,
              }}

            loading={logoutLoading}
            title='Sign out'
            disabled={logoutLoading}
            onPress={onLogoutPress}
            size='lg'
            type='outline'
            iconPosition='right'
            // radius={10}
            // icon={<MaterialIcons name="logout" size={24} color={red.red8} />}
            iconContainerStyle={{ padding: 10,  justifyContent: 'center', alignItems: 'center',}}
          />
           
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const useSettingsScreenStyles = () => {
  const styles = StyleSheet.create({
    container: {

      paddingVertical: 24,
      paddingHorizontal: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },

    contentFooter: {
      marginTop: 24,
      fontSize: 13,
      fontWeight: '500',
      color: '#929292',
      textAlign: 'center',
    },
    /** Profile */
    profile: {
      padding: 16,
      flexDirection: 'column',
      alignItems: 'center',
      // backgroundColor: '#fff',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      // borderColor: '#e3e3e3',
      backgroundColor: grayDark.gray1
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 9999,
    },
    profileName: {
      fontFamily: fonts.inter.bold,
      color: grayDark.gray12,
      // marginTop: 12,
      fontSize: 20,
      // fontWeight: '600',
      // color: '#090909',
    },
    profileUsername: {
      fontFamily: fonts.inter.semi_bold,
      color: grayDark.gray11,
      marginTop: 6,
      fontSize: 16,

    },
    profileEmail: {
      fontFamily: fonts.inter.semi_bold,
      color: grayDark.gray11,
      // marginTop: 6,
      fontSize: 16,
    },
    profileAction: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#007bff',
      borderRadius: 12,
    },
    profileActionText: {
      marginRight: 8,
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
    },
    /** Section */
    section: {
      paddingTop: 12,
    },
    sectionTitleContainer: {
      marginHorizontal: 12,
      gap: 5,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      
    },
    sectionTitle: {
      marginVertical: 8,
      fontFamily: fonts.inter.semi_bold,
      fontSize: 14,
      fontWeight: '600',
      color: '#a7a7a7',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    sectionBody: {
      paddingLeft: 24,
      // backgroundColor: '#fff',
      borderTopWidth: 1,
      // backgroundColor: 'rgba(137, 133, 133, 0.3)',

      // borderBottomWidth: 1,
      borderColor:  'rgba(137, 133, 133, 0.3)',

    },
    /** Row */
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: 16,
      height: 50,
    },
    rowWrapper: {
      // borderTopWidth: 1,
      borderColor: '#e3e3e3',
    },
    rowFirst: {
      borderTopWidth: 0,
    },
    rowIcon: {
      width: 30,
      height: 30,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    rowLabel: {
      fontSize: 15,
      fontFamily: fonts.inter.black,
      // color: '#000',
      color: grayDark.gray12,
    },
    rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    rowValue: {
      fontSize: 17,
      fontWeight: '500',
      color: '#8B8B8B',
      marginRight: 4,
    },
    bioContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      flexBasis: 'auto',
      height: 'auto',
      minHeight: 20,
      width: '85%',
      padding: 5,
      marginBottom: 5,
      flexShrink: 1,
      alignSelf: 'center',
    },
    bioText: {
      fontFamily: fonts.inter.semi_bold,
      fontSize: 15,
      color: grayDark.gray11,
      textAlign: 'center',
      flexWrap: 'wrap',
    },
  });

  return styles;

}
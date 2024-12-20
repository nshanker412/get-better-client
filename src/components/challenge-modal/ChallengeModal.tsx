import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { ActionButton } from '../primitives/action-button/ActionButton';
import { Modal } from '../primitives/action-modal/ActionModal';


// iOS14 supports 256 characters
const CHALLENGE_BODY_CHAR_LIMIT = 100;

export const ChallengeModal: React.FC<{
  isVisible: boolean;
  challengee: string;
  onClosePress: () => void;
}> = ({ isVisible, challengee, onClosePress }) => {
  const { challengeUser } = useOtherUserInfo();
  const { theme } = useThemeContext();
  const [challengeText, setChallengeText] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const { username: myUsername } = useMyUserInfo();
  const charactersUsed = challengeText.length;


  const onSubmitChallengeCb = async () => {
    if (challengeText === '') {
      Toast.show({
        text1: 'You need to enter a challenge first!',
        type: 'error',
      });
      return Promise.reject('Please enter a challenge');
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLoading(true);
      await challengeUser(challengeText, myUsername!);
      Toast.show({
        text1: `Challenge sent to ${challengee}!`,
        type: 'success',
      });
      setLoading(false);
      onClosePress();
      setChallengeText('');
    } catch (err) {
      Toast.show({
        text1: `Hmm... that didn't go as planned.`,
        text2: `${err}`,
        type: 'error',
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onCloseModalPress = () => {
    Keyboard.dismiss();
    onClosePress();
    setChallengeText('');

  }

  return (
    <Modal isVisible={isVisible} style={{ width: '90%', height: '80%' }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View style={{ flex: 1, alignContent: "stretch", justifyContent: "space-around" }}>

          <Modal.Container

            containerStyle={{
              backgroundColor: theme.innerContainer.backgroundColor,
              gap: 20,
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity style={{ alignItems: "flex-start", justifyContent: "flex-start", width: 40, height: 40 }} onPress={onCloseModalPress}>
              <View style={{ padding: 10 }}>
                <AntDesign name='close' size={24} color={theme.textColorPrimary} />
              </View>
            </TouchableOpacity>
            <Modal.Header

              title={`Do you want to challenge ${challengee}?`}
              headerStyle={{
                container: {
                  alignSelf: 'center',
                  justifyContent: 'center',
                },
                text: { ...theme.text.header },
              }}
            />
            <Modal.Body bodyStyle={{ alignItems: 'center' }}>
              <View style={{ gap: 0, maxWidth: "90%", width: "90%" }}>
                <Text style={[charactersUsed >= CHALLENGE_BODY_CHAR_LIMIT ? styles.maxCharReached : styles.charCount, { color: charactersUsed >= CHALLENGE_BODY_CHAR_LIMIT ? theme.errorColor : theme.grayShades.gray500, alignSelf: "flex-end", }]}>
                  {charactersUsed}/{CHALLENGE_BODY_CHAR_LIMIT}
                </Text>
                <KeyboardAvoidingView behavior={"padding"}>
                  <TextInput
                    returnKeyType="done"

                    style={{
                      ...theme.innerContainer,
                      borderWidth: 1,
                      borderColor: theme.textColorSecondary,
                      borderRadius: 8,
                      backgroundColor: theme.grayShades.gray300,
                      width: '100%',
                      maxWidth: '100%',
                      height: 100,
                      // minWidth: '90%',
                      textAlignVertical: 'top',
                      padding: 10,
                      color: theme.textColorPrimary,
                      flexShrink: 0,
                    }}
                    placeholder='Enter instructions for your challenge'
                    placeholderTextColor={theme.grayShades.gray500}
                    multiline={true}
                    maxLength={CHALLENGE_BODY_CHAR_LIMIT}
                    keyboardType='twitter'
                    keyboardAppearance='dark'
                    value={challengeText}
                    onChangeText={setChallengeText}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </KeyboardAvoidingView>
              </View>
            </Modal.Body>
            <Modal.Footer>
              <ActionButton
                loading={loading}
                isPrimary={true}
                styles={{...theme.button.primary, container: { padding: 5, top: -14 }}}
                defaultPressed={false}
                title='Challenge'
                onPress={onSubmitChallengeCb}
              />

            </Modal.Footer>
          </Modal.Container>
        </View>

      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  charCount: {

    fontSize: 12, // Smaller font size
    fontWeight: 'normal', // Less emphasis than the main header
    marginBottom: 4, // Space above the text input
    color: '#C3FF45', // Slightly darker color, adjust based on your theme.grayShades.gray500
    //   minWidth: 58,
    // minWidth: 30,
    textAlign: "left",
  },
  charCountClose: {
    fontSize: 12, // Smaller font size
    fontWeight: 'normal', // Less emphasis than the main header
    marginBottom: 4, // Space above the text input
    color: '#C3FF45', // Slightly darker color, adjust based on your theme.grayShades.gray500
  },
  maxCharReached: {
    fontSize: 12, // Smaller font size
    fontWeight: 'bold', // Less emphasis than the main header
    marginBottom: 4, // Space above the text input
    color: '#ff0000', // Slightly darker color, adjust based on your theme.grayShades.gray500
  },

});
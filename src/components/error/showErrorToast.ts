import Toast from 'react-native-toast-message';

export const showErrorToast = (errorMsg: string) => {
    console.log('[INFO] showErrorToast(): ', errorMsg);
    Toast.show({
        text1: errorMsg,
        type: 'error',
        visibilityTime: 5000,
        topOffset: 100,
        autoHide: true,
    });
};
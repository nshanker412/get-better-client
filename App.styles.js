import { StyleSheet } from 'react-native';

export const useAppStyles = ({ backgroundColor = "#000000" }) => {

  const appStyles = StyleSheet.create({
    backgroundColor,
    appContainer: {
      backgroundColor,
      flex: 1
    },

    loadingContainer: {
      backgroundColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%'
    },

    loader: {
      backgroundColor,
      width: 75,
      height: 75
    }
  });

  return appStyles;
}
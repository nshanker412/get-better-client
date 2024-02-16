import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';


export const useActionmodalStyles = () =>  {
    const { theme } = useThemeContext();
    
    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.innerContainer.backgroundColor,
            borderRadius: 25,
            borderWidth: 1,
            // borderColor: "#000",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",

            maxWidth: "80%",
            height: "20%",
            maxHeight: "80%",
            // borderStyle: "solid",
          },
          header: {
            alignItems: "center",
            justifyContent: "center",
          },
          text: {
            paddingTop: 10,
            textAlign: "center",
            fontSize: 24,
          },
          body: {
            justifyContent: "center",
            paddingHorizontal: 15,
            minHeight: 100,
          },
          footer: {
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            flexDirection: "row",
          },

    })
    return styles

    }
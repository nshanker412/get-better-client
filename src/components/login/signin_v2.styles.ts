import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';
import { fonts } from '@context/theme/fonts';
import { color } from '@rneui/base';

export const useLoginStyles = () => {
	const { theme } = useThemeContext();

	const loginStyles = StyleSheet.create({
        backgroundImage:{
            resizeMode: "cover",
            width: "100%",
        },

		loginContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			gap: 25,
            backgroundColor:"rgba(17,18,20,0.2)",
            // opacity:0.2,
           
		},

        SignInText: {
            color: "#FFF",
            "textAlign": "center",
            "fontFamily": fonts.nord.black,
            "fontSize": 30,
            "fontWeight": "700",
            "lineHeight": 38,
            "letterSpacing": 2,
        },
        SignInSubtext:{
            textAlign:'center',
            fontFamily: fonts.work_sans.bold,
            color:'#D7D8D9',
            fontSize:18,
            fontWeight:'400',
            lineHeight:20,
            letterSpacing:-0.3,
        },
        lableText: {
            color: "#FFF",
            fontFamily: fonts.nord.black,
            textAlign:"left",
            "fontSize": 14,
            "fontStyle": "normal",
            "fontWeight": "700",
            "letterSpacing": -0.028,
        },
        inputContainer:{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            width:"100%"

        },
        
		inputSubContainer:{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width:"90%",
            
            gap: 8,
            fontFamily: fonts.work_sans.black,

        },
        iconContainer: {
            position: 'absolute',
            left: 10,
            top:"45%",
            zIndex:1,
            padding:15,
        },
        iconSignInContainer:{
            // position: 'absolute',
            // left: 15,
            top:"-5%",
            zIndex:1,
            // paddingLeft:50,
            alignSelf: 'flex-end',
            fontWeight:"500"
        },
        eyeButton: {
            position: 'absolute',
            right: 10,
            top:"33%",
            zIndex:1,
            padding:15,
          },
		input: {
			width: '100%',
            paddingLeft:45,
			fontSize: 22,
			borderWidth: 1,
			borderColor: theme.innerContainer.backgroundColor,
			backgroundColor: theme.innerContainer.backgroundColor,
			// shadowOpacity: 0.7,
			color: theme.textColorPrimary,
			padding: 16,
			// margin: 25,
			borderRadius: 20,
		},
       
		inputFocused: {
			width: '100%',
			paddingLeft:45,

			fontSize: 22,
			borderWidth: 1,
			borderColor: theme.innerBorderColor,
			backgroundColor: theme.innerContainer.backgroundColor,
			shadowOpacity: 0.7,
			color: theme.textColorPrimary,
			padding: 16,
			// margin: 25,
			borderRadius: 20,
		},

		loginButton: {
			...theme.button.primary.default,
			width: 300,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			// backgroundColor: theme.button.primary.default.backgroundColor,
			borderRadius: 19,
			margin: 25,
		},

		loginText: {
            ...theme.button.primary.default.buttonText,
            fontFamily: fonts.nord.black,
			fontSize: 22,
			textAlign: 'center',
			padding: 10,
            fontWeight:"700",
            letterSpacing:-0.048,

		},
        otherText: {
			...theme.text.body.large,
			...theme.text.subtext,

			fontSize: 16,
		},
		transferText: {
			...theme.text.body.large,
			...theme.text.subtext,
            color:"#C3FF45",

			fontSize: 18,
            fontWeight:"700",
			textDecorationLine: 'underline',
		},
		SignUp: {
			...theme.text.body.medium,
			...theme.text.subtext,

			fontSize: 20,
			fontWeight: "500",
			color: "#C3FF45",
			textDecorationLine: 'underline',
		},

		forgotPasswordContainer: {
			marginBottom: 15,
		},

		loadingContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			// marginTop: 100,
			backgroundColor: '#FFFFFF',
		},

		loader: {
			width: 75,
			height: 75,
		},
        // signup 
        CheckBox:{
            backgroundColor:"#24262B",
            // borderColor:"#24262B",
            top:10,
            left:-5
        },
        inputSignUpContainer:{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width:"100%",

        },
    })
    return loginStyles
}


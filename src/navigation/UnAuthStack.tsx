


import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import { ForgotPassword } from "../components/login/forgotPassword";
import { Register } from "../components/login/register_v2";
import { SignIn } from "../components/login/signIn_v2";

export const UnAuthStack = () => {
    const UnAuthStackNav = createStackNavigator();

    return (
        <UnAuthStackNav.Navigator screenOptions={{ headerShown: false,  cardStyle: { backgroundColor: 'black'}  }} >
            <UnAuthStackNav.Screen name="Register" component={Register} />
            <UnAuthStackNav.Screen name="SignIn" component={SignIn} />
            <UnAuthStackNav.Screen name="ForgotPassword" component={ForgotPassword} />
        </UnAuthStackNav.Navigator>
  );
}
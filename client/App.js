import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InitialPage from './components/InitialPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './components/Login';
import { UserProvider } from './context/UserContext';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import BottomBar from './components/BottomBar';
import MyProfile from "./components/MyProfile";


const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <UserProvider>
      <NavigationContainer>
        {/* initial, login, signup, home page */}
        <Stack.Navigator>
          <Stack.Screen 
            name="InitialPage"
            component={InitialPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="HomePage"
            component={HomePage}
            options = {{headerShown: false}}
          />
          <Stack.Screen
            name="BottomBar"
            component={BottomBar}
            options = {{headerShown: false}}
          />
          <Stack.Screen 
            name="MyProfile"
            component={MyProfile}
            options = {{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

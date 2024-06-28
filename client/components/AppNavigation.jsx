import React, { useEffect, useState, useContext } from 'react';
import InitialPage from './InitialPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import SignUp from './SignUp';
import HomePage from './HomePage';
import BottomBar from './BottomBar';
import MyProfile from "./MyProfile";
import EditProfile from './EditProfile';
import * as Storage from "./Storage";
import { UserContext } from '../context/UserContext';


const Stack = createNativeStackNavigator();

function AppNavigator() {

  const [initialRoute, setInitialRoute] = useState(null)
  const { setUser } = useContext(UserContext);

  useEffect(() => {

    const getUser = async () => {
      try {
        storedUser = await Storage.getItem("user")
        if (storedUser) {
          setUser({
            phoneNumber: storedUser.phoneNumber,
            name: storedUser.name,
            businessName: storedUser.businessName,
            category: storedUser.category,
            description: storedUser.description,
            location: storedUser.location,
            profilePicUri: storedUser.profilePicUri ? storedUser.profilePicUri : null,
          })
          setInitialRoute("HomePage")

        }
        else {
          setInitialRoute("InitialPage")

        }
      }
      catch (err) {
        setInitialRoute("InitialPage")
      }
    }

    getUser();

  }, [])

  if (initialRoute === null) {
    return null; 
  }

  return (
      <NavigationContainer>
        {/* initial, login, signup, home page */}
        <Stack.Navigator initialRouteName={initialRoute}>
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
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options = {{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default AppNavigator;
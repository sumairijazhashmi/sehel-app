import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import axios from "axios";
import { getprofilepicurl } from "../constant";
import { Buffer } from 'buffer';


function BottomBar( {navigation} ) {

    const { user, setUser } = useContext(UserContext);

    return (
        <View style={styles.container}>

          {/* activity page */}
          <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate("ViewActivity") }}>
            <Icon name="bell" size={30} color="#9b9bff" />
          </TouchableOpacity>

          {/* home page */}
          <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate('HomePage') }}>
            <Icon name="home" size={30} color="#9b9bff" />
          </TouchableOpacity>

          {/* my profile */}
           <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate("MyProfile") }} >
            {
              user.profilePicUri ? 
              <Image
                source={{ uri: user.profilePicUri }}
                style={styles.profileImage}
              />
              :
              <Image
                source={require('./assets/placeholder_profile_pic.png') }
                style={styles.profileImage}
              />
            }
          </TouchableOpacity> 

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 10,  // For Android shadow
        shadowColor: '#000',  // For iOS shadow
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    iconContainer: {
      flex: 1,
      alignItems: 'center',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  });
  

export default BottomBar;
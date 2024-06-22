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
    const [profilePic, setProfilePic] = useState(null)


    useEffect(() => {


      const getProfilePic = async () => {

        try {
          const response = await axios.get(getprofilepicurl, {
            params: { phoneNumber: user.phoneNumber },
            responseType: 'arraybuffer',
          });
  
          if (response.status == 200) {
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            const imageUri = `data:image/png;base64,${base64}`;
            setProfilePic(imageUri);
          }
          else {
            console.log(response.status, response.data);
          }

        } catch (err) {
            setProfilePic(null)
            if (err.response) {
              // Server responded with a status code outside of 2xx
              console.log(`${err.response.data}`);
          } else if (err.request) {
              // Request was made but no response received
              console.log('Network Error: No response received.');
          } else {
              // Something happened in setting up the request
              console.log(`Error: ${err.message}`);
          }
        }
        
      }

      getProfilePic();
    }, [])

    return (
        <View style={styles.container}>

          {/* activity page */}
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="bell" size={30} color="#9b9bff" />
          </TouchableOpacity>

          {/* home page */}
          <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate('HomePage') }}>
            <Icon name="home" size={30} color="#9b9bff" />
          </TouchableOpacity>

          {/* my profile */}
           <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate("MyProfile") }} >
            {
              profilePic ? 
              <Image
                source={{ uri: profilePic }}
                style={styles.profileImage}
                onLoad={() => URL.revokeObjectURL(profilePic)}
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
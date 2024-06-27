import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet , TouchableOpacity, Image} from "react-native"
import BottomBar from "./BottomBar";
import { UserContext } from "../context/UserContext";


function MyProfile({ navigation }) {

    const { user, setUser } = useContext(UserContext);

    return (
        <View style={styles.container}>
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
            <Text style={styles.userName}>{user.name ? user.name : "Fiza Khan"}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonP}>
                    <Text style={styles.buttonText}>See Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonP} onPress={() => navigation.navigate("EditProfile")}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.innerContainer}>  

                <View style={styles.infoContainer}>

                    <Text style={styles.infoLabel}>Phone Number</Text>
                    <Text style={styles.infoText}>{user.phoneNumber}</Text>

                    <Text style={styles.infoLabel}>Business Name</Text>
                    <Text style={styles.infoText}>{user.businessName ? user.businessName : "Fiza Catering"}</Text>

                    <Text style={styles.infoLabel}>Description</Text>
                    <Text style={styles.infoText}>{user.description ? user.description : "Home cooked meals"}</Text>

                    <Text style={styles.infoLabel}>Category</Text>
                    <Text style={styles.infoText}>{user.category ? user.category : "Home Kitchen"}</Text>

                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoText}>{user.location ? user.location : "Gulberg"}</Text>

                    <TouchableOpacity style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Log out</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <BottomBar navigation={navigation} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        //   flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4FF',
    },
    innerContainer: {
        width: '90%',
        paddingVertical: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginBottom: 10
      },
    userName: {
      fontSize: 20,
      fontWeight: 'medium',
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 20,
    },
    buttonP: {
      backgroundColor: '#5C68CE',
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 5,
      minWidth: '30%'
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    infoContainer: {
      width: '80%',
    },
    infoLabel: {
      fontSize: 14,
      color: '#888888',
    },
    infoText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    logoutButton: {
      padding: 10,
      borderRadius: 5,
      borderColor: 'red',
      borderWidth: 1,
      marginTop: 20,
      maxWidth: "30%",
      alignSelf: 'flex-end'
    },
    logoutButtonText: {
      color: 'red',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center'
    },
  });

export default MyProfile;
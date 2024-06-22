import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet , TouchableOpacity, Image} from "react-native"
import BottomBar from "./BottomBar";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { getuser, getprofilepicurl } from "../constant";
import { Buffer } from 'buffer';


function MyProfile({ navigation }) {

    const { user, setUser } = useContext(UserContext);
    const [profilePic, setProfilePic] = useState(null)
    const [name, setName] = useState(null)
    const [businessName, setBusinessName] = useState(null)
    const [category, setCategory] = useState(null);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState(null);


    useEffect(() => {

        const getUser = async () => {
            try {
                const response = await axios.get(getuser, {
                    params: { phoneNumber: user.phoneNumber }
                })

                if(response.status == 200) {
                    setName(response.data.name)
                    setBusinessName(response.data.businessname)
                    setCategory(response.data.category)
                    setDescription(response.data.description)
                    setLocation(response.data.location)

                    const response2 = await axios.get(getprofilepicurl, {
                        params: { phoneNumber: user.phoneNumber },
                        responseType: 'arraybuffer',
                      });
              
                      if (response2.status == 200) {
                        const base64 = Buffer.from(response2.data, 'binary').toString('base64');
                        const imageUri = `data:image/png;base64,${base64}`;
                        setProfilePic(imageUri);
                      }


                }
            }
            catch (err) {
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

        getUser();
    }, [])

    return (
        <View style={styles.container}>
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
            <Text style={styles.userName}>{name ? name : "Fiza Khan"}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonP}>
                    <Text style={styles.buttonText}>See Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonP}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.innerContainer}>  

                <View style={styles.infoContainer}>

                    <Text style={styles.infoLabel}>Phone Number</Text>
                    <Text style={styles.infoText}>{user.phoneNumber}</Text>

                    <Text style={styles.infoLabel}>Business Name</Text>
                    <Text style={styles.infoText}>{businessName ? businessName : "Fiza Catering"}</Text>

                    <Text style={styles.infoLabel}>Description</Text>
                    <Text style={styles.infoText}>{description ? description : "Home cooked meals"}</Text>

                    <Text style={styles.infoLabel}>Category</Text>
                    <Text style={styles.infoText}>{category ? category : "Home Kitchen"}</Text>

                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoText}>{location ? location : "Gulberg"}</Text>

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
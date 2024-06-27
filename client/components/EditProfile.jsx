import React, { useContext, useState, useEffect } from "react";
import {Text, View, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView} from "react-native"
import { UserContext } from "../context/UserContext";
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';
import LocationModal from './LocationModal';
import BottomBar from "./BottomBar";
import axios from "axios";
import { edituser, uploadprofilepicurl } from "../constant";

const businessCategories = ["Home Kitchen", "Clothing", "Handicrafts", "Jewellery"]



function EditProfile({navigation}) {

    const { user, setUser } = useContext(UserContext);

    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState(user.name ? user.name : null);
    const [businessName, setBusinessName] = useState(user.businessName ? user.businessName : null);
    const [category, setCategory] = useState(user.category ? user.category : "Select Category");
    const [location, setLocation] = useState({ area: '', city: '', country: '' });
    const [description, setDescription] = useState(user.description ? user.description : null);

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);


    const updateProfile = async () => {

        const data = {
            name: name ? name : (user.name ? user.name : ''),
            phonenumber: user.phoneNumber,
            businessname: businessName ? businessName : (user.businessName ? user.businessName : ''),
            category: category ? category : (user.category ? user.category : ''),
            location: `${location.area}, ${location.city}, ${location.country}`,
            description: description
        }

        try {

            const response = await axios.post(edituser, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status == 200) {
                if (response.data == "success") {

                    setUser((prevState) =>  ({
                        ...prevState, 
                        phoneNumber: user.phoneNumber,
                        name: name,
                        businessName: businessName,
                        category: category,
                        description: description,
                        location:  `${location.area}, ${location.city}, ${location.country}`,
                    }))

                    if(!photo) {
                        setSuccess("Profile Updated!")
                        navigation.navigate("MyProfile")
                        return;
                    }


                    const formData = new FormData();
                    const filename = photo.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : `image`;
                
                    const file = {
                        uri: photo,
                        name: filename,
                        type,
                    };
                
                    formData.append('photo', file);
                    formData.append('phonenumber', user.phoneNumber);

                    response2 = await axios.post(uploadprofilepicurl, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    if (response2.status == 200) {
                        if (response2.data == "success!") {
                            setUser((prevState) => ({
                                ...prevState,
                                profilePicUri: photo
                            }))
                            setSuccess("Picture Updated!")
                            navigation.navigate("MyProfile")
                        }
                        else {
                            setError("some error occurred")
                        }
                    }


                }
            }

        }
        catch (err) {
            if (err.response) {
                // Server responded with a status code outside of 2xx
                setError(`${err.response.data}`);
            } else if (err.request) {
                // Request was made but no response received
                setError('Network Error: No response received.');
            } else {
                // Something happened in setting up the request
                setError(`Error: ${err.message}`);
            }
        }
        
    }


    const selectPhoto = async () => {

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
            });

            if (!result.cancelled) {
                setPhoto(result.assets[0].uri);
            }


        } catch(err) {
            console.log(err)
        }
    };

    const handleSaveLocation = (locationData) => {
        setLocation(locationData);
    };
    
    const handleOpenModal = () => {
        setModalVisible(true);
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
    };



    return (
    <View style={styles.container}>
        <Text style={styles.userName}>Edit Profile</Text>
        <ScrollView>

        <TouchableOpacity onPress={selectPhoto} style={styles.profileCircle}>
            {
                photo ? 
                <Image
                source={{ uri: photo }}
                style={styles.profileImage}
                />
                :
                <Image
                source={require('./assets/placeholder_profile_pic.png') }
                style={styles.profileImage}
                />
            }
            <Text onPress={selectPhoto} style={styles.profilePicText}>Change Profile Picture</Text>
            </TouchableOpacity>

        
        <View style={styles.buttonContainer2}>
            <TouchableOpacity style={styles.buttonP}>
                <Text style={styles.buttonText}>Change Phone Number</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonP}>
                <Text style={styles.buttonText}>Change PIN</Text>
            </TouchableOpacity>
        </View>
        
        <ScrollView  contentContainerStyle={styles.innerContainer}>  

      

            <View style={styles.infoContainer}>

                <Text style={styles.infoLabel}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder={name}
                    keyboardType="name-phone-pad"
                    autoCapitalize="none"
                    value={name}
                    onChangeText={(t) => setName(t)}
                />

                <Text style={styles.infoLabel}>Business Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder={businessName}
                    keyboardType="name-phone-pad"
                    autoCapitalize="none"
                    value={businessName}
                    onChangeText={(t) => setBusinessName(t)}
                />
 
                <Text style={styles.infoLabel}>Business Category</Text>
                <Picker
                    selectedValue={category}
                    style={styles.input}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
                    <Picker.Item label="Select Category" value="" />
                    {businessCategories.map((cat, index) => (
                    <Picker.Item key={index} label={cat} value={cat} />
                    ))}
                </Picker>

                <Text style={styles.infoLabel}>Location</Text>
                <TextInput
                            style={styles.input}
                            placeholder="Location"
                            // editable={false}
                            value={`${location.area}, ${location.city}, ${location.country}`}
                            onTouchStart={handleOpenModal}
                        />


                <LocationModal
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    onSave={handleSaveLocation}
                />

                <Text style={styles.infoLabel}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder={description}
                    autoCapitalize="none"
                    value={description}
                    onChangeText={(t) => setDescription(t)}
                />


                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => updateProfile()} style={styles.buttonG}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => navigation.navigate("MyProfile")} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Cancel</Text>
                    </TouchableOpacity>

                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}
                {success && <Text style={styles.successText}>{success}</Text>}

            </View>

        </ScrollView>
        </ScrollView>
        <BottomBar navigation={navigation} />
    </View>
)
}


const styles = StyleSheet.create({
    profilePicText: {
        marginBottom: 10,
        textAlign: 'center',
    },
container: {
    //   flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4FF',
},
innerContainer: {
    // width: '90%',
    // marginTop: 50,
    paddingVertical: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 100
},
profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 10,
    alignSelf: 'center'
  },
userName: {
  fontSize: 20,
  fontWeight: 'medium',
  textAlign: 'center',
  marginBottom: 20,
  marginTop: 100,
},
buttonContainer2: {
  flexDirection: 'column',
  justifyContent: 'space-between',
    height: 100,
//   width: '80%',
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
buttonG: {
    backgroundColor: '#5C68CE',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: '30%',
    alignSelf: 'flex-end'
  },
buttonText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 'bold',
  textAlign: 'center'
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
input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 10,
    minWidth: '80%',
    backgroundColor: '#f9f9f9',
},   
errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center'
  },
  successText: {
    color: 'green',
    fontSize: 14,
    textAlign: 'center'
  },
});


export default EditProfile;
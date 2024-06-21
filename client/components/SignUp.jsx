import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import { UserContext } from '../context/UserContext';
import { uploadprofilepicurl, makeprofileurl, signupurl } from '../constant';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import LocationModal from './LocationModal';

const businessCategories = ["Home Kitchen", "Clothing", "Handicrafts", "Jewellery"]

function SignUp( { navigation } ) {

    const { user, setUser } = useContext(UserContext);

    const [scenario, setScenario] = useState(0);


    const [phoneNumber, setPhoneNumber] = useState(null);
    const [name, setName] = useState(null);
    const [pin, setPin] = useState(null);
    const [confirmpin, setConfirmPin] = useState(null);

    const [businessName, setBusinessName] = useState("");
    const [category, setCategory] = useState("Select Category");
    const [location, setLocation] = useState({ area: '', city: '', country: '' });
    const [description, setDescription] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);


    const handleSaveLocation = (locationData) => {
        setLocation(locationData);
    };
    
    const handleOpenModal = () => {
        setModalVisible(true);
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
    };

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


    const handleSignUp = async () => {
        if (name == null || phoneNumber == null || pin == null || confirmpin == null) {
            setError("Please enter all details.")
            return;
        }

        if (pin.length < 6) {
            setError("PIN must be atleast 6 digits long.")
            return;
        }

        if (pin != confirmpin) {
            setError("PINs don't match.")
            return;
        }


        try {
            const data = {
                Name: name,
                PhoneNumber: phoneNumber,
                PIN: pin
            }

            
            response = await axios.post(signupurl, data,  {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status == 200) {
                if (response.data == "success!") {
                    setUser({
                        phoneNumber: phoneNumber
                    });
                    setError(null);
                    setSuccess("Signed Up!");
                    setScenario(prevState => prevState + 1)
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


    const handleMakeProfile = async () => {


        try {
            const data = {
                PhoneNumber: phoneNumber,
                BusinessName: businessName,
                Category: category,
                Location: `${location.area}, ${location.city}, ${location.country}`,
                Description: description,
            }

            
            response = await axios.post(makeprofileurl, data,  {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            if (response.status == 200) {
                if (response.data == "success!") {
                    setUser({
                        phoneNumber: phoneNumber
                    });
                    setError(null);
                    setSuccess("Profile Made!");

                    try {
                        // upload photo
                        if(!photo) {
                            navigation.navigate("HomePage")
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
                        formData.append('phonenumber', phoneNumber);

                        response = await axios.post(uploadprofilepicurl, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })

                        if (response.status == 200) {
                            if (response.data == "success!") {
                                navigation.navigate("HomePage")
                            }
                            else {
                                setError("some error occurred")
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

    return (
        <View style={styles.container} >
            <View style={styles.innerContainer}>  
                <Text style={styles.signupText}>{scenario == 0 ? "Sign Up!" : "Make Your Profile"} </Text>
                <Text style={styles.personalDetails}>{scenario == 0 ? "Personal Details" : "Business Details"}</Text>
                <View style={styles.formContainer}>
                {scenario == 0 ? 
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            keyboardType="name-phone-pad"
                            autoCapitalize="none"
                            value={name}
                            onChangeText={(t) => setName(t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            value={phoneNumber}
                            onChangeText={(t) => setPhoneNumber(t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="PIN (atleast 6 digits)"
                            secureTextEntry
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            value={pin}
                            onChangeText={(t) => setPin(t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm PIN"
                            secureTextEntry
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            value={confirmpin}
                            onChangeText={(t) => setConfirmPin(t)}
                        />

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.nextButton} onPress={() => { handleSignUp() }}>
                                <Text style={styles.nextButtonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => { navigation.navigate("Login") }}>
                            <Text style={styles.signUpButtonText}>Already have an account? Log In.</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                         <TouchableOpacity onPress={selectPhoto} style={styles.profileCircle}>
                            {photo ? (
                            <Image source={{ uri: photo }} style={styles.profileImage} />
                            ) : (
                            <Image
                                source={require('./assets/placeholder_profile_pic.png')} // Placeholder image
                                style={styles.profileImage}
                            />
                            )}
                        </TouchableOpacity>
                        <Text onPress={selectPhoto} style={styles.profilePicText}>Upload Profile Picture</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Business Name"
                            keyboardType="name-phone-pad"
                            autoCapitalize="none"
                            value={businessName}
                            onChangeText={(t) => setBusinessName(t)}
                        />
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

                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            autoCapitalize="none"
                            // keyboardType="n"
                            value={description}
                            onChangeText={(t) => setDescription(t)}
                        />
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.nextButton} onPress={() => { handleMakeProfile() }}>
                                <Text style={styles.nextButtonText}>Make Profile</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => {  navigation.navigate("HomePage")  }}>
                            <Text style={styles.signUpButtonText}>Want to do this later? Click here.</Text>
                        </TouchableOpacity>
                    </>
                }
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {success && <Text style={styles.successText}>{success}</Text>}
                </View>       
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    signupText: {
        // marginTop: 50,
        marginBottom: 25,
        fontSize: 24,
        fontWeight: 'semibold'
    },
    personalDetails: {
        // marginTop: 50,
        marginBottom: 25,
        fontSize: 20,
        fontWeight: 'regular'
    },
    container: {
    //   flex: 1,
      width: "100%",
      height: "100%",
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#959FFF',
    },
    innerContainer: {
        width: '90%',
        paddingVertical: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
    },
    profilePicText: {
        marginBottom: 10,
        textAlign: 'center',
    },
      profileImage: {
        width: '100%',
        height: '100%',
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
    buttonsContainer: {
        maxWidth: '80%',

    },  
    nextButton: {
        backgroundColor: '#6161E5', // Purple color
        paddingVertical: 10,
        // paddingHorizontal: 100,
        marginTop: 10,
        minWidth: '100%',
        borderRadius: 5,
        marginBottom: 10,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
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
      signUpButtonText: {
        color: 'black', // Purple color
        fontSize: 13,
        textAlign: 'center',
      },
  });
  

export default SignUp;
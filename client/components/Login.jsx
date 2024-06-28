import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View , TextInput, TouchableOpacity} from 'react-native';
import { UserContext } from '../context/UserContext';
import { loginurl, getuser, getprofilepicurl } from '../constant';
import axios from 'axios';
import { Buffer } from 'buffer';
import * as Storage from './Storage'

function Login( { navigation } ) {

    const { user, setUser } = useContext(UserContext);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [pin, setPin] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleLogin = async () => {
        if (phoneNumber == null || pin == null) {
            setError("Please enter Phone Number and PIN.")
            return;
        }

        try {
            const data = {
                PhoneNumber: phoneNumber,
                PIN: pin
            }

            
            response = await axios.post(loginurl, data,  {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            if (response.status == 200) {
                if (response.data == "success!") {

                    setSuccess("Logging In!")
                   

                    const response2 = await axios.get(getuser, {
                        params: { phoneNumber: phoneNumber }
                    })

                    if(response2.status == 200) {

                        setUser(prevState => (
                            {
                                ...prevState,
                                phoneNumber: phoneNumber,
                                name: response2.data.name,
                                category: response2.data.category,
                                businessName: response2.data.business_name,
                                description: response2.data.description,
                                location: response2.data.location,
                            }
                        ))

                        await Storage.setItem("user", {
                                "phoneNumber": phoneNumber,
                                "name": response2.data.name,
                                "category": response2.data.category,
                               "businessName": response2.data.business_name,
                                "description": response2.data.description,
                                "location": response2.data.location,
                            })

                        
                        const response3 = await axios.get(getprofilepicurl, {
                            params: { phoneNumber: phoneNumber },
                            responseType: 'arraybuffer',
                        });
                        
                        
                        if (response3.status == 200 && response3.data.byteLength > 0) {
                            const base64 = Buffer.from(response3.data, 'binary').toString('base64');
                            const imageUri = `data:image/png;base64,${base64}`;
                            
                            setUser(prevState => ({
                                ...prevState,
                                profilePicUri: imageUri
                            }))
                            await Storage.setItem("user", {
                                "phoneNumber": phoneNumber,
                                "name": response2.data.name,
                                "category": response2.data.category,
                               "businessName": response2.data.business_name,
                                "description": response2.data.description,
                                "location": response2.data.location,
                                "profilePicUri": imageUri
                            })
                        }
    
                    }

                    setError(null);
                    setSuccess("Logged In!");
                    navigation.navigate("HomePage")
                }
            }
            
        }
        catch (err) {
           if (err.response) {
                // Server responded with a status code outside of 2xx
                if(err.response.status == 404) {

                    setSuccess("Logged In!");
                     // cookie was alr set after response 2
                    navigation.navigate("HomePage")
                }
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
                <Text style={styles.loginText}>Log In</Text>
                <View style={styles.formContainer}>
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
                        placeholder="PIN"
                        secureTextEntry
                        autoCapitalize="none"
                        keyboardType="number-pad"
                        value={pin}
                        onChangeText={(t) => setPin(t)}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.loginButton} onPress={() => { handleLogin() }}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => { navigation.navigate('SignUp') }}>
                        <Text style={styles.signUpButtonText}>Don't have an account? Sign Up.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => { /* Handle forgot password */ }}>
                        <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {success && <Text style={styles.successText}>{success}</Text>}
                </View>       
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    loginText: {
        marginTop: 50,
        marginBottom: 30,
        fontSize: 24,
        fontWeight: 'semibold'
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
    loginButton: {
        backgroundColor: '#6161E5', // Purple color
        paddingVertical: 10,
        // paddingHorizontal: 100,
        marginTop: 10,
        minWidth: '100%',
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonText: {
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
      forgotPasswordButton: {
        marginTop: 10,
        minWidth: '100%',
      },
      forgotPasswordButtonText: {
        color: 'gray', // Purple color
        fontSize: 13,
        textAlign: 'center',
      },
      signUpButtonText: {
        color: 'black', // Purple color
        fontSize: 13,
        textAlign: 'center',
      },
  });
  

export default Login;

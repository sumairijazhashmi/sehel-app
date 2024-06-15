import React from 'react';
import { StyleSheet, Text, View , Image, TouchableOpacity} from 'react-native';
import logo from "./assets/logo.png"

function InitialPage( { navigation } ) {

    

    return (
        <View style={styles.container} >
            <View style={styles.innerContainer}>
                <View  style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                </View>    
                <View style={styles.formContainer}>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.loginButton} onPress={() => { navigation.navigate('Login') }}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.signUpButton} onPress={() => { /* Handle sign up */ }}>
                            <Text style={styles.signUpButtonText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => { /* Handle forgot password */ }}>
                        <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>       
            </View>
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
    buttonsContainer: {
        maxWidth: '80%',

    },  
    loginButton: {
        backgroundColor: '#6161E5', // Purple color
        paddingVertical: 10,
        // paddingHorizontal: 100,
        minWidth: '100%',
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
      },
      signUpButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        minWidth: '100%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#6161E5', // Purple border color
        marginBottom: 10,
    },
    signUpButtonText: {
        color: '#6161E5',
        textAlign: 'center',
        fontSize: 14,
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
  });
  

export default InitialPage;
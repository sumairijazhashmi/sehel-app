import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { UserContext } from "../context/UserContext";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from "./BottomBar";
import { getname } from "../constant";
import axios from "axios";


function HomePage( {navigation} ) {

    const { user, setUser } = useContext(UserContext)



    return (
        <View style={styles.container} >
            <View style={styles.innerContainer}>  
                <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
            
                <View style={styles.cardContainer}>

                    <TouchableOpacity style={styles.card} onPress={() => { navigation.navigate("BudgetHome") }}>
                        <Icon name="wallet-outline" size={40} color="#4CAF50" />
                        <Text style={styles.cardText}>Budgeting Manager</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <Icon2 name="handshake-outline" size={40} color="#F79390" />
                        <Text style={styles.cardText}>Community Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <Icon name="chatbubbles-outline" size={40} color="#673AB7" />
                        <Text style={styles.cardText}>Financial Advice</Text>
                    </TouchableOpacity>
                    
                </View> 
            </View>
            <BottomBar navigation={navigation} />
        </View>
);

}

const styles = StyleSheet.create({
    welcomeText: {
        marginTop: 30,
        marginBottom: 30,
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
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
        width: '90%',
        paddingVertical: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
        // maxWidth: "80%"
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    width: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
    textAlign: 'center'
  },
});

export default HomePage;
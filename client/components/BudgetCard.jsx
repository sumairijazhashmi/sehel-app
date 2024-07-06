import React from "react";
import {View, Text, StyleSheet} from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function BudgetCard({iconName, title, reason, inOrOut, amount, date }) {

    return (
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={iconName} size={30} color={"#5C68CE"}/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{reason}</Text>
          </View>
          <View style={styles.textContainer2}>
            {inOrOut == "+" ?  <Text style={styles.amountIn}>{inOrOut} {amount}</Text> : <Text style={styles.amountOut}>{inOrOut} {amount}</Text>}
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      height: 75,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      marginVertical: 10,
    },
    iconContainer: {
      backgroundColor: '#e0e7ff',
      borderRadius: 20,
      padding: 10,
      marginRight: 10,
    },
    icon: {
      width: 20,
      height: 20,
    },
    textContainer: {
      flex: 1,
    },
    textContainer2: {
        // flex: 1,
        alignSelf: 'flex-end'
    },
    title: {
      fontSize: 14,
      fontWeight: 'medium',
    },
    subtitle: {
      fontSize: 12,
      color: '#666',
    },
    amountOut: {
      fontSize: 16,
      color: 'red',
      fontWeight: 'bold',
      marginRight: 10,
    },
    amountIn: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
        marginRight: 10,
      },
    date: {
      fontSize: 14,
      color: '#666',
    },
  });

export default BudgetCard;
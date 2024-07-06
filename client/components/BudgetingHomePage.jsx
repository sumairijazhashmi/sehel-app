import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomBar from "./BottomBar";
import BudgetCard from "./BudgetCard";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


function BudgetHome({navigation}) {

    const [currentBalance, setCurrentBalance] = useState(0);
    const [txns, setTxns] = useState([
        { iconName: "credit-card", title: "Gas Bill", reason: "Bill", inOrOut: "-", amount: 800, date: "3 April" },
        { iconName: "shopping-cart", title: "Grocery Shopping", reason: "Sehri Food Items", inOrOut: "-", amount: 1520, date: "1 April" },
        { iconName: "shopping-bag", title: "Milaad Order", reason: "Dinner Party", inOrOut: "+", amount: 2500, date: "29 March" },

    ]);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.pageHeading}>Budgeting Manager</Text>
            </View>
            <View style={styles.currentBalanceContainer}>
                <Text style={styles.constTextBalance}>My Balance</Text>
                <Text style={styles.balanceText}>{currentBalance}</Text>
            </View>
            <View style={styles.recentTxnsContainer}>
                <View style={styles.reportsHeader}>
                    <Text style={styles.recentTxnsTitle}>Recent Transactions</Text>
                    <TouchableOpacity style={styles.viewReportsButton}>
                        <Text style={styles.viewReportsButtonText}>View Reports</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.recentTxns}>
                    {
                        txns.map((txn, index) => (
                            <BudgetCard
                                key={index} 
                                iconName={txn.iconName} 
                                title={txn.title} 
                                reason={txn.reason}
                                inOrOut={txn.inOrOut}
                                amount={txn.amount}
                                date={txn.date}
                            />
                        ))
                    }
                    <TouchableOpacity style={styles.seeMoreButton}>
                        <Text style={styles.seeMoreText}>See More</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.addButton}>
                <MaterialIcons name="add" size={50} color="white" />
            </TouchableOpacity>

            <BottomBar navigation={navigation} />
        </View>
    )
};

export default BudgetHome;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        backgroundColor: '#F3F4FF',
    },
    topBar: {
        backgroundColor: "#959FFF",
        height: "20%",
        alignSelf: 'flex-start',
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    pageHeading: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'semibold',
        alignSelf: 'center',
        marginLeft: 50,
        marginTop: 50
    },
    currentBalanceContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 50
    },
    constTextBalance: {
        fontSize: 14,
        color: '#91919F',
        textAlign: 'center'
    },
    balanceText: {
        fontSize: 28,
        fontWeight: 'semibold',
        textAlign: 'center'
    },
    recentTxnsContainer: {
        width: '90%',
        marginTop: 50,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 25,
        height: '50%'
    },
    reportsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    recentTxnsTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    viewReportsButton: {
        backgroundColor: '#EDEFFF',
        borderRadius: 8,
        padding: 8,
    },
    viewReportsButtonText: {
        color: '#7F83FF',
        fontWeight: '600',
    },
    recentTxns: {
        marginBottom: 100,
    },
    seeMoreButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    seeMoreText: {
        color: '#7F83FF',
        fontWeight: '600',
    },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 30,
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: '#7F83FF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5,
        elevation: 3,
    },
});
import React, { useEffect, useState, useContext } from "react";
import {Text, View, TouchableOpacity, StyleSheet, Button} from 'react-native';
import BottomBar from "./BottomBar";
import Notification from "./Notification";
import axios from "axios";
import { getnotifs } from "../constant";
import { UserContext } from "../context/UserContext";


function ViewActivity( {navigation} ) {

    const [notifications, setNotifications] = useState([])

    const { user } = useContext(UserContext);

    useEffect(() => {

        const getNotifications = async () => {

            try {

                const response = await axios.get(getnotifs, {
                    params: { phoneNumber: user.phoneNumber }
                })

                if (response.status == 200) {
                    const sortedNotifications = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setNotifications(sortedNotifications);
                }

            } catch (err) {
                console.log(err)
            }
        }

        getNotifications()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.pageHeading}>Activity</Text>
            </View>
            <View style={styles.activities}>
                {
                      notifications.map((notif, index) => (
                        <Notification
                            key={index} 
                            message={notif.body}
                            timestamp={notif.created_at}
                            params={notif.params}
                        />
                    ))
                }
                {/* dummy code to send notification */}
                {/* <Button
                    title="Press to schedule a notification"
                    onPress={async () => {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                        title: "You've got mail! 📬",
                        body: 'Here is the notification body',
                        },
                        trigger: { seconds: 2 },
                    });
                    }}
                /> */}
            </View>
            <BottomBar navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        backgroundColor: 'white',
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
        fontWeight: 'regular',
        alignSelf: 'center',
        marginLeft: 50,
        marginTop: 50
    },
    activities: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    }
})

export default ViewActivity
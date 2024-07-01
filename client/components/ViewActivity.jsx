import react from "react";
import {Text, View, TouchableOpacity, StyleSheet, Button} from 'react-native';
import BottomBar from "./BottomBar";
import * as Notifications from 'expo-notifications'


function ViewActivity( {navigation} ) {
    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.pageHeading}>Activity</Text>
            </View>
            <View style={styles.activities}>
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
        width: '100%'
    }
})

export default ViewActivity
import React, { useContext, useState, useEffect } from "react";
import {Text, View, TextInput, TouchableOpacity} from "react-native"
import { UserContext } from "../context/UserContext";

function EditProfile({navigation}) {

    const { user, setUser } = useContext(UserContext);

    return (
        <View>
            <Text>hi</Text>
        </View>
    )
}

export default EditProfile;
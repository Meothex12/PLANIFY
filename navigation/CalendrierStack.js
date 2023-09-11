import React from "react";
import { View, StyleSheet } from 'react-native';

import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import calendrier from "../tabs/Calendrier";
const Calendrier = createStackNavigator();

const AppStack = () => {
    return (
        <Calendrier.Navigator styles={styles.container}>
            <Calendrier.Screen
                name="Carte"
                component={calendrier}
                options={{ headerShown: false }}
            />
            <Calendrier.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
        </Calendrier.Navigator>
    )
}

export default AppStack;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
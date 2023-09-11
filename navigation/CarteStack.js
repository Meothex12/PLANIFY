import React from "react";
import { View, StyleSheet } from 'react-native';

import { createStackNavigator } from "@react-navigation/stack";
import sportsScreen from '../screens/sportsScreen';
import AttractionScreen from "../screens/AttractionScreen";
import FestivalsScreen from "../screens/FestivalsScreen";
import RestaurantScreen from "../screens/RestaurantScreen";
import carte from "../tabs/Carte";
import HomeScreen from "../screens/HomeScreen";

const Carte = createStackNavigator();

const AppStack = () => {
    return (
        <Carte.Navigator styles={styles.container}>
            <Carte.Screen
                name="Carte"
                component={carte}
                options={{ headerShown: false }}
            />
            <Carte.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Carte.Screen
                name="sportsScreen"
                component={sportsScreen}
                options={{ headerShown: false }}
            />
            <Carte.Screen
                name="AttractionScreen"
                component={AttractionScreen}
                options={{ headerShown: false }}
            />
            <Carte.Screen
                name="FestivalsScreen"
                component={FestivalsScreen}
                options={{ headerShown: false }}
            />
            <Carte.Screen
                name="RestaurantScreen"
                component={RestaurantScreen}
                options={{ headerShown: false }}
            />
        </Carte.Navigator>
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
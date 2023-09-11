import React from "react";
import { View, StyleSheet } from 'react-native';

import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from '../screens/HomeScreen'
import AttractionScreen from "../screens/AttractionScreen";
import FestivalsScreen from "../screens/FestivalsScreen";
import RestaurantScreen from "../screens/RestaurantScreen";

function headerManager(title){
    return(
        {
            headerStyle: {
                backgroundColor: "black"
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                textTransform: "uppercase",
                color: "white"
            },
            title:title
        }
    )
}

const App = createStackNavigator();

const AppStack = () => {
    return (
        <App.Navigator styles={styles.container}>
            <App.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <App.Screen
                name="AttractionScreen"
                component={AttractionScreen}
                options={headerManager("Attractions")}
            />
            <App.Screen
                name="FestivalsScreen"
                component={FestivalsScreen}
                options={headerManager("Festivals")}
            />

            <App.Screen
                name="RestaurantScreen"
                component={RestaurantScreen}
                options={headerManager("Restaurants")}
            />
        </App.Navigator>
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
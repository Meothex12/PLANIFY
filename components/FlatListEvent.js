import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import EventButton from './EventButton';

const deleteEventById = async (id) => {
    await firebase.firestore().collection("Ajouts").doc(id).delete();
    return id;
}

const Event = ({ item, navigation, nomPage, id, userInfo }) => {
    /*--variables--*/
    let description = ""

    if (item.Description != null || item.Description != undefined)
        description = item.Description
    else
        description = ""
    return (
        <View style={styles.item}>
            <View style={{ flexDirection: 'column' }}>

            {/* titre */}
            <Text style={styles.titre}>{item.nom}</Text>
            <View style={{ flexDirection: 'row' }}>
                {/* Bouton pour lenlever' */}
                <TouchableOpacity style={styles.boutonDelete} onPress={() => deleteEventById(id)}>
                    <Text>🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boutonEdit} onPress={() => navigation.navigate("EditEventScreen", { id: item.nom })}>
                    <Text>✎</Text>
                </TouchableOpacity>
            </View>

            {/* description */}
            <View style={{ flexDirection: 'row' }}>
                <Text>
                    {description}
                </Text>
            </View>
            <EventButton navigation={navigation} item={item} nomPage={nomPage} />
            </View>
        </View>
    )
}

const FlatListEvent = ({ data, navigation,userInfo, nomPage }) => {
    const D = data
    console.log("DAns la flatlist:",userInfo)
    id = 1

    if (D != null || D != undefined) {
        return (
            <View style={styles.container}>
                <View style={styles.liste}>
                    <FlatList
                        data={D}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <Event item={item} navigation={navigation} nomPage={nomPage} id={id++} userInfo={userInfo} />
                            )
                        }
                        }
                    />
                </View>
            </View>
        )
    }
    else if ((D == null || D == undefined) && (userInfo == null || userInfo == undefined)) {
        return (<ActivityIndicator animating={true} color="black" size="large" />)
    }
}

export default FlatListEvent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    liste: {
        flexDirection: "column",
        backgroundColor: '#dcdcdc'
    },
    titre: {
        fontSize: 35
    },
    item: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 5,
        margin: '5%',
        flexDirection: 'column'
    },
    boutonDelete: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 45,
        alignItems: 'center'
    }
})
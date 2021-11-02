import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import EventButton from './EventButton';

const deleteEventById = async (id) => {
    await firebase.firestore().collection("Ajouts").doc(id).delete();

    console.log(id)

    return id;
}

const Event = ({ item, navigation, nomPage,id }) => {
    /*--variables--*/
    let localisation = ""
    let description = ""
    if (item.localisation != null || item.localisation != undefined)
        localisation = item.localisation
    else
        localisation = {longitude:43,latitude:73}//null
    if (item.Description != null || item.Description != undefined)
        description = item.Description
    else
        description = ""

    return (
        <View style={styles.item}>
            {/* titre */}
            <Text style={styles.titre}>{item.nom}</Text>
            <View style={{ flexDirection: 'row' }}>
                {/* Bouton pour lenlever' */}
                <TouchableOpacity style={styles.boutonDelete} onPress={() => deleteEventById(id)}>
                    <Text>🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boutonEdit}  onPress={() => navigation.navigate("EditEventScreen", {id: item.nom})}>
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
    )
}

const FlatListEvent = ({ data, navigation, nomPage }) => {
    const D = data
    id = 1
    if (D != null || D != undefined) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.liste}>
                    <FlatList
                        data={D}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <Event item={item} navigation={navigation} nomPage={nomPage} id={id++} />
                            )
                        }
                        }
                    />
                </ScrollView>
            </View>
        )
    }
    else if (data == null || data == undefined) {
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
        backgroundColor:'beige'
    },
    titre: {
        fontSize: 35
    },
    item: {
        backgroundColor:'#edf5e1',
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
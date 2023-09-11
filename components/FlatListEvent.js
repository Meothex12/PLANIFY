import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import Event from '../components/Event';
import { AuthContext } from '../navigation/AuthProvider';

const db = firebase.firestore();

const FlatListEvent = ({ data, navigation, nomPage }) => {
    // console.log('dans flatlistevent')
    const D = data
    const { user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null)

    //TODO: Bon  ?
    useEffect(() => {
        const ref = db.collection("users").doc(user.uid);
        ref.get().then((doc) => {
            setUserInfo(doc.data())
        })
    }, []);

    if (D != null || D != undefined) {
        return (
            <View style={styles.container}>
                <View style={styles.liste}>
                    <FlatList
                        data={D}
                        refreshing={true}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <Event item={item} navigation={navigation} nomPage={nomPage} userInfo={userInfo} uid={item.User} />
                            )
                        }
                        }
                    />
                </View>
            </View>
        )
    }
    return (<ActivityIndicator animating={true} color="black" size="large" />)
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
        backgroundColor: '#dcdcdc',
        borderColor:'2px solid red'
    }
})
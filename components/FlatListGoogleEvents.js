import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import Event from '../components/Event';
import EventGoogle from '../components/EventGoogle';
import { AuthContext } from '../navigation/AuthProvider';
import { Rating, AirbnbRating } from 'react-native-ratings';

const FlatListGoogleEvents = ({ eventClique, details, data, navigation }) => {
    const D = data
    let description = "vous"
    let image = ""
    if (eventClique != undefined) {
        description = eventClique.description
    }
    if (details != undefined) {
        console.log(details.photos)
        /*
        https://maps.googleapis.com/maps/api/place/photo
  ?maxwidth=400
  &photo_reference=Aap_uEA7vb0DDYVJWEaX3O-AtYp77AaswQKSGtDaimt3gt7QCNpdjp1BkdM6acJ96xTec3tsV_ZJNL_JP-lqsVxydG3nh739RE_hepOOL05tfJh2_ranjMadb3VoBYFvF0ma6S24qZ6QJUuV6sSRrhCskSBP5C1myCzsebztMfGvm7ij3gZT
  &key=YOUR_API_KEY
        */
    }
    if (D != null || D != undefined) {
        return (
            <ScrollView>
                {/* event cliqué */}
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 20, paddingLeft: 5, fontWeight: 'bold' }}>Évènement cliqué: {details.name}</Text>
                    <View>
                        <EventGoogle item={details} navigation={navigation} nomPage={"FlatListGoogle"} />
                    </View>
                    <Text>Adresse : {details.formatted_address}</Text>
                    <Text>Numéro de téléphone : {details.formatted_phone_number}</Text>
                    {/* <Image source={{uri:}/> */}
                    {/* Review */}
                    <Text style={{ fontSize: 15, paddingLeft: 5, fontWeight: 'bold' }}>Commentaires</Text>
                    <FlatList
                        data={details.review}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            source={{ uri: item.profile_photo_url }}
                                        />
                                        <Text>
                                            Auteur:{item.author_name}
                                        </Text>
                                    </View>
                                    <Text>
                                        {item.text}
                                    </Text>
                                    <Rating
                                        type='star'
                                        ratingCount={item.rating}
                                        imageSize={20}
                                        showRating
                                        readonly
                                    />
                                </View>
                            )
                        }}
                    />
                </View>
                {/*  Autres évènements proches*/}
                <View style={styles.liste}>
                    <Text style={{ fontSize: 20, paddingLeft: 5, fontWeight: 'bold', marginTop: 10 }}>Autres évènement proche de {details.name}</Text>
                    <FlatList
                        data={D}
                        refreshing={true}
                        keyExtractor={item => item.place_id}
                        renderItem={({ item }) => {
                            return (
                                <EventGoogle item={item} navigation={navigation} nomPage={"FlatListGoogle"} />
                            )
                        }
                        }
                    />
                </View>
            </ScrollView>
        )
    }
    return (<ActivityIndicator animating={true} color="black" size="large" />)

}


export default FlatListGoogleEvents;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    liste: {
        flexDirection: "column",
        backgroundColor: '#dcdcdc'
    }
})
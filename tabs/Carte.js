import React from 'react';
import { View, Text, StyleSheet, Dimensions,Button } from 'react-native';
import MapView, { Polygon, Polyline, Marker } from 'react-native-maps';
import Header from '../components/Header';

let initialRegion = {
    longitude: -73.8446587,
    latitude: 45.6422237,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
}
const carte = ({ route, navigation }) => {

    let évènement = route.params

    if (évènement != undefined || évènement != null) {
        let latitudeEvent = évènement.latitude
        let longitudeEvent = évènement.longitude
        let nom = évènement.nom
        let page = évènement.page

        initialRegion.latitude = latitudeEvent
        initialRegion.longitude = longitudeEvent
        const erase = () => 
            évènement = null
            latitudeEvent = null
            longitudeEvent = null
            nom = null
            page = null
        return (
            <View>
                <Header title="carte" />
                <Button title={'⬅️ Retour à '+ nom} à onPress={()=> {navigation.navigate(page);erase()}}/>
                <MapView
                    style={styles.mapStyle}
                    initialRegion={initialRegion}>
                    <MapView.Marker coordinate={{ latitude: latitudeEvent, longitude: longitudeEvent }} />
                </MapView>

            </View>
        )
    }
    else if(évènement == undefined || évènement == null){
        return (
            <View>
                <Header title="carte" />
                <MapView
                    style={styles.mapStyle}
                    initialRegion={initialRegion}>
                </MapView>
            </View>
        )

    }


}

export default carte;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});
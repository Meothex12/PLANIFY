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

    const évènement = route.params

    if (évènement != undefined || évènement != null) {
        let latitudeEvent = évènement.latitude
        let longitudeEvent = évènement.longitude
        const nom = évènement.nom
        const page = évènement.page

        initialRegion.latitude = latitudeEvent
        initialRegion.longitude = longitudeEvent
        return (
            <View>
                <Header title="carte" />
                <Button title={'⬅️ Retour à '+ nom} à onPress={()=>navigation.navigate(page)}/>
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
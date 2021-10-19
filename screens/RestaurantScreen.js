import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView,Button } from 'react-native';
import * as firebase from 'firebase';

const RestaurantScreen = ({navigation}) => {
  const db = firebase.firestore();
  const [restaurants, setRestaurants] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  /*--aller chercher tout les festivals--*/
  const getRestaurants = async () => {
    const db = firebase.firestore();
    const response = db.collection('Restaurants');
    const data = await response.get();
    setIsFetching(true)
    let R = []
    data.docs.forEach(item => {
      R.push(item.data())
      setIsFetching(true)
    })
    setRestaurants(R)
    setIsFetching(false)
  }

  useEffect(() => {
    setRestaurants(null)
    getRestaurants()
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        RESTAURANTS
      </Text>
      <FlatList>

      </FlatList>

      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item.id.toString()}. {item.nom}</Text>

              <ScrollView style={{ backgroundColor: "black" }}>
                <View>
                  <Text style={{ color: "white" }}>MENU</Text>
                  <Text style={{ color: "white" }}>
                    {item.menu.Plats.nom}, {item.menu.Plats.prix.toString()} $
                  </Text>
                </View>
              </ScrollView>
              <Button title="Trouver sur la carte" onPress={() => navigation.navigate("Carte", {
                nom:item.nom,
                page:"RestaurantScreen",
                longitude: item.localisation.longitude,
                latitude: item.localisation.latitude
              })} />
            </View>
          )
        }}>
      </FlatList>
    </View>
  )
}

export default RestaurantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
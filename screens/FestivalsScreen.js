import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

import GetData from '../utils/GetData';
import * as firebase from 'firebase';

import EventButton from '../components/EventButton';

const FestivalsScreen = ({ navigation }) => {
  //Création de la base de données
  const [festivals, setFestivals] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  const getFestivals = async () => {
    const db = firebase.firestore();
    const response = db.collection('Festivals');
    const data = await response.get();
    setIsFetching(true)
    let R = []
    data.docs.forEach(item => {
      R.push(item.data())
      setIsFetching(true)
    })
    setFestivals(R)
    setIsFetching(false)
  }


  /*--aller chercher tout les festivals--*/
  useEffect(() => {
    setFestivals(null)
    //setIsFetching(true)
    //setFestivals(GetData('Festivals'))
    getFestivals()
    //setIsFetching(false)
  }, []);

  if (festivals != undefined || festivals != null) {
    let id = 1;
    return (
      <View style={styles.container}>
        <View style={styles.listeFestivals}>
          <ActivityIndicator animating={isFetching} color="black" size="large"/>
          <FlatList
            data={festivals}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: 'column' }}>

                  <View style={{ flexDirection: 'column' }}>
                    <Text>{id++}. {item.nom} en {item.ville}</Text>
                  </View>

                  <EventButton navigation={navigation} item={item} nomPage={"FestivalsScreen"} />

                </View>
              )
            }
            }
          >
          </FlatList>
        </View>
      </View>
    )
  }
  else if (festivals == undefined || festivals == null) {
    return (
      <View style={styles.container}>
        <Text>
          {/* AUCUN FESTIVALS TROUVÉS */}
        </Text>
        <ActivityIndicator animating={true} color="black" size="large"/>
      </View>
    )
  }
}


export default FestivalsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listeFestivals: {
    flexDirection: "column"
  },
  bouton: {
    backgroundColor: "#00a46c",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    color: 'white'
  }
});
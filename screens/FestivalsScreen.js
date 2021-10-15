import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

import * as firebase from 'firebase';

const FestivalsScreen = ({ navigation }) => {
  //Création de la base de données
  const db = firebase.firestore();
  const [festivals, setFestivals] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  /*--aller chercher tout les festivals--*/
  const getFestivals = async () => {
    const response = db.collection('Festivals');
    const data = await response.get();

    setIsFetching(true)
    let f = []
    data.docs.forEach(item => {
      f.push(item.data())
      setIsFetching(true)
    })
    setFestivals(f)
    setIsFetching(false)
  }

  useEffect(() => {
    setFestivals(null)
    getFestivals()
  }, []);

  if (!isFetching) {
    console.log(festivals)
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={isFetching} />
        <View style={styles.listeFestivals}>

          <FlatList
            data={festivals}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: 'column' }}>

                  <View style={{ flexDirection: 'column' }}>
                    <Text>{item.id.toString()}. {item.nom} en {item.ville}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    {/* mettre le bouton comme component */}
                    <View style={styles.bouton}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Carte", {
                          nom: item.nom,
                          page: "FestivalsScreen",
                          longitude: item.localisation.longitude,
                          latitude: item.localisation.latitude
                        })}>
                        <Text>Trouver sur la carte</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.bouton}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Calendrier", {
                          nom: item.nom,
                          page: "FestivalsScreen",
                          longitude: item.localisation.longitude,
                          latitude: item.localisation.latitude,
                          event: item
                        })} >
                        <Text>Ajouter sur le calendrier</Text>
                      </TouchableOpacity>
                    </View>

                  </View>

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
  else if (isFetching || (festivals == undefined || festivals == null)) {
    return (
      <View style={styles.container}>
        <Text>
          AUCUN FESTIVALS TROUVÉS
        </Text>
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
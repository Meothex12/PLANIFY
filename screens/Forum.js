import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView, Image, TouchableOpacity, Button } from 'react-native';
import FlastListEvent from "../components/FlatListEvent";
import * as firebase from 'firebase';

const forum = ({ navigation }) => {
  const [ajouts, setAjouts] = useState([])
  let length = 1

  const getAjouts = async () => {
    setAjouts(null)
    const db = firebase.firestore();
    const response = db.collection('Ajouts');
    const data = await response.get();
    let R = []
    data.docs.forEach(item => {
      R.push(item.data())
      length++
    })
    setAjouts(R)
  }

  useEffect(() => {
    setAjouts(null)
    //setFestivals(GetData('Festivals'))
    getAjouts()
  }, []);

  return (
    <View style={{ backgroundColor: "#5cdb95" }}>
      <Image
        source={require('../assets/1.png')}
        style={{
          height: 10,
          width: 20,
          marginTop: 50
        }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, width: "100%" }}>
        {/* Texte d'accueil du forum */}
        <View style={{ width: "50%", backgroundColor: "#5cdb95" }}>
          <Text style={{
            fontSize: 28,
            color: "#edf5e1",
            fontWeight: "bold"
          }}>
            Bienvenue sur le forum de Planify
          </Text>
        </View>
        {/* Image */}
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <Image
            source={require('../assets/CalendarV3.png')}
            style={{ height: 60, width: 60 }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'column', alignItems: 'center' }}>

        <View style={{flexDirection:'row'}}>
          {/* bouton pour ajouter un event */}
          <TouchableOpacity style={styles.boutonAdd} onPress={() => navigation.navigate("AddEventScreen")}>
            <Text>Ajouter un event</Text>
          </TouchableOpacity>
          {/* bouton qui va rafraichir */}
          <TouchableOpacity style={styles.boutonAdd} onPress={() => getAjouts()}>
            <Text>Rafraichir</Text>
          </TouchableOpacity>
        </View>

        {/* Liste de tout les ajouts */}
        <View>
          <FlastListEvent data={ajouts} navigation={navigation} nomPage="Forum" />
        </View>

      </View>
    </View>
  )
}

export default forum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  boutonAdd: {
    color: 'black',
    backgroundColor: "#00a46c",        // backgroundColor: 'rgba(52, 52, 52, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15
  }
});
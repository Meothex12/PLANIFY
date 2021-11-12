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
    <ScrollView style={{ backgroundColor: "#dcdcdc" }}>
      <View style={{
        backgroundColor: "dcdcdc", height: "10%", borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20, width: '100%', marginTop: 20
      }}>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 50, width: "100%", paddingHorizontal: 20,paddingBottom:100 }}>
          {/* Texte d'accueil du forum */}
          <View style={{ width: "50%", backgroundColor: "#dcdcdc" }}>
            <Text style={{
              fontSize: 28,
              color: "#141823",
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


      </View>
      <View style={{paddingTop:20}}>
        <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate("AddEventScreen")}>
          <Text>Ajouter un event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton} onPress={() => getAjouts()}>
          <Text>Rafraichir</Text>
        </TouchableOpacity>
      </View>
      {/* Liste de tout les ajouts */}
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <FlastListEvent data={ajouts} navigation={navigation} nomPage="Forum" />
      </View>



    </ScrollView>
  )
}

export default forum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bouton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    color: 'white'
  },
  boutonAdd: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 5,
    color: 'white',
  }
});
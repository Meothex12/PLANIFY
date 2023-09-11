import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView, Image, TouchableOpacity, Button } from 'react-native';
import * as firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import FlastListEvent from "../components/FlatListEvent";

const db = firebase.firestore();

////////////////////////////////////////////////////////////
const getAjouts = async () => {

  const response = db.collection('Ajouts');
  const data = await response.get();

  let R = []

  data.docs.forEach(item => {
    R.push(item.data())
  })

  return R;
}
////////////////////////////////////////////////////////////
const forum = ({ navigation }) => {

  const [ajouts, setAjouts] = useState([])

  useEffect(() => {
    setAjouts(getAjouts())
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#5cdb95" }}>
      {/* Message de bienvenue */}
      <View style={{
        backgroundColor: "#5cdb95", height: "10%", borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20, width: '100%', marginTop: 20
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 50, width: "100%", paddingHorizontal: 20, paddingBottom: 100 }}>
          {/* Texte d'accueil du forum */}
          <View style={{ width: "50%", backgroundColor: "#5cdb95" }}>
            <Text style={{
              fontSize: 28,
              color: "white",
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

      {/* Boutons d'ajouts et de refresh */}
      <View style={{ paddingTop: 30, backgroundColor: '#5cdb95' }}>
        {/* Add */}
        <TouchableOpacity style={styles.refreshBouton} onPress={() => navigation.navigate("AddEventScreen")}>
          <FontAwesome name="retweet" color='#0099ff' size={20} style={{ marginBottom: 5 }} />
        </TouchableOpacity>
        {/* Refresh */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => getAjouts()}>
          <FontAwesome name="plus" color='green' size={20} />
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
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import PlanifyIndicator from '../components/PlanifyIndicator';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

const calendrier = ({ route, navigation }) => {

  /*-------------------constantes et variables-----------------*/
  const today = new Date().toISOString().split('T')[0]

  const _format = 'YYYY-MM-DD'

  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre",
    "Octobre", "Novembre", "Décembre"];

  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const db = firebase.firestore();

  const [calendrier, setCalendrier] = useState([])
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null)
  const [items, setItems] = useState({})

  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState()
  /*-------------------FONCTIONS-------------------*/


  const getUserInfo = async () => {
    const db = firebase.firestore();
    const ref = db.collection("users").doc(user.uid);

    ref.get().then((doc) => {
      setUserInfo(doc.data())
    })
  }

  function addEventInCalendar(event, date) {
    date = date.toISOString().split('T')[0]
    try {
      db.collection('Calendrier').doc(event.nom).set({
        event: event,
        date: date,
        user: userInfo
      })
      console.log(event.nom, " ajouté dans le calendrier")
      return
    } catch (e) {
      console.log("ERREUR DANS L'AJOUT D'UN EVENT DANS LE CALENDRIER:", e)
    }

  }

  const deleteFromCalendar = async (event) => {
    try {
      await db.collection("Calendrier").doc(event.nom).delete();
      alert(`${event.nom} supprimé`)
    } catch (e) {
      console.log("Erreur dans la suppresion de ", event.nom, ":", e)
    }
  }

  /*--POUR ALLÉ CHERCHER LES ÉVÈNEMENTS DÉJÀ AJOUTÉ AU CALENDRIER */
  const getEventsFromCalendar = async () => {
    setCalendrier(null)
    const response = db.collection('Calendrier');
    const data = await response.get();

    let Calendrier = []

    data.docs.forEach(item => {
      // à faire avec le id wesh
      if (item.data().user != undefined) {
        if (item.data().user.id == user.uid) {
          Calendrier.push(item.data())
        }
      }
    })

    setCalendrier(Calendrier)
  }

  const AddToAgenda = ({ item }) => {
    let nom = "évènement"
    if (edit != null && route.params == null) {
      item = edit.event
      nom = item.nom
    }
    nom = item.nom
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.item}>
          <Text style={styles.titre}>Ajout de {nom} au calendrier</Text>
          <Text>Choisissez le moment de l'évènement</Text>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <TouchableOpacity onPress={showDatepicker} style={styles.bouton}>
              <Text>Date : {days[date.getDay()]} {date.getDate()} {months[date.getUTCMonth()]} {date.getFullYear()}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={showTimepicker} style={styles.bouton}>
              <Text>Heure : {date.getHours()}:{date.getMinutes()}</Text>
            </TouchableOpacity>
            <View>
              {show && (
                <DateTimePicker
                  minimumDate={new Date()}
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.bouton}
                onPress={() => { addEventInCalendar(item, date); setEdit(null); navigation.navigate("Calendrier"); getEventsFromCalendar() }}>
                <Text>
                  Ajouter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bouton} onPress={() => setEdit(null)}>
                <Text>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  const renderItem = (i) => {
    let compteur = 1
    let item = i.item
    return (
      <ScrollView style={styles.item}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.titre}>
              {compteur++}.{item.event.nom}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>
              {item.event.Description}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>
              Planifié le {item.date}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.bouton} onPress={() => deleteFromCalendar(item.event)}>
              <Text>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bouton} onPress={() => { setEdit(item) }}>
              <Text>Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
  const AgendaPlanify = () => {
    return (
        <Agenda
          selected={new Date()}
          minDate={new Date()}
          //showClosingKnob={false}
          onRefresh={() => console.log('refreshing...')}
          // Set this true while waiting for new data from a refresh
          //refreshing={false} rajouter un bouton pour refresh l'agenda

          items={items}
          loadItemsForMonth={()=>loadItems}
          renderItem={renderItem}

          style={{
            // backgroundColor:'green'
          }}
        />
    )
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  function timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const loadItems = () => {
    calendrier.forEach(item => {
      const t = timeToString(item.date)
      if (!items[t]) {
        items[t] = [];
        items[t].push(
          {
            item: item,
            height: Math.max(50, Math.floor(Math.random() * 150))
          }
        )
      }
    })
    const newItems = {}
    Object.keys(items).forEach(key => {
      newItems[key] = items[key]
    });
    setItems(newItems)
  }

  useEffect(() => {
    getUserInfo()
    getEventsFromCalendar()
  }, []);

  /*----------------AFFICHAGE------------------*/
  /* AJOUT D'UN EVENT DANS LE CALENDRIER */
  if (route.params != undefined) {
    let item = route.params.event
    return (<AddToAgenda item={item} />)
  }
  if (edit != null) {
    return (<AddToAgenda item={edit} />)
  }
  if (calendrier != undefined || calendrier != null)
    /* AFFICHAGE DE TOUT LES ÉVÈNEMENTS */
    return (<AgendaPlanify />)
  else
    return (<PlanifyIndicator />)
}

export default calendrier;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  liste: {
    flexDirection: "column",
    backgroundColor: '#dcdcdc'
  },
  titre: {
    fontSize: 20
  },
  item: {
    backgroundColor: 'white',
    margin: '5%',
    flexDirection: 'column',
    borderRadius: 5
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  bouton: {
    backgroundColor: "#00a46c",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    color: 'white',
    alignContent: 'center',
    textAlign: 'center',
    margin: 30
  }
});

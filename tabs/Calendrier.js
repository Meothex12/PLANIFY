import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import Header from '../components/Header';
import Event from '../components/Event';
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

  const [ajout, setAjout] = useState(null)
  //const [events, setEvents] = useState({})
  const [markedDates, setMarkedDate] = useState({ [today]: { marked: true, selectedColor: 'blue' } })
  const [calendrier, setCalendrier] = useState([{}])
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

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

  const editEventFromCalendar = async (event) => {
    //   db.collection('Calendrier').doc(ancienTitre).set({
    //     event: event,
    //     date: today,
    //     user: userInfo
    // })
    console.log(event.nom, "modifié avec succés")
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

    let tabDates = []
    let tabEvents = []
    let Calendrier = ([{}])
    let timeStamp = null

    data.docs.forEach(item => {
      // à faire avec le id wesh
      if (item.data().user != undefined) {
        if ((item.data().user.Email).toLowerCase() == user.email.toLowerCase()) {
          tabDates.push(item.data().date.toDate())
          tabEvents.push(item.data().event)
          Calendrier.push({ [item.data().date.toDate()]: item.data().event })
        }
        // else {
        //   setEvents("Aucun évènement")
        // }
      }

    })

    setMarkedDate(tabDates)
    // setEvents(tabEvents)
    setCalendrier(Calendrier)
  }

  const AgendaPlanify = () => {
    if (calendrier != null) {
      console.log(calendrier)
      let events = []

      calendrier.forEach((e) => {
        console.log("element", e)

      })

      console.log("event:", events)
      return (
        <ScrollView style={{ backgroundColor: "#dcdcdc" }}>
          <Calendar
            selected={today}
            minDate={new Date()}
            markedDates={markedDates}
            data={calendrier}
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.titre}>DANS LE CALENDRIER</Text>
              <TouchableOpacity onPress={() => getEventsFromCalendar()} style={styles.bouton}>
                <Text>Rafraichir</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={calendrier}
              refreshing={true}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  <View>
                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text>
                          {item.toString()}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.bouton} onPress={() => deleteFromCalendar(item)}>
                          <Text>Supprimé</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bouton} onPress={() => editEventFromCalendar(item)}>
                          <Text>Modifié</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              }}
            />
          </View>
        </ScrollView>
      )

    }
    else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Calendar />
          <Text>Aucuns évènements dans le calendrier</Text>
          <PlanifyIndicator />
        </SafeAreaView>
      )
    }
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };


  useEffect(() => {
    getUserInfo()
    getEventsFromCalendar()
  }, []);

  /*----------------AFFICHAGE------------------*/
  if (calendrier == undefined || calendrier == null)
    return (<PlanifyIndicator />)
  /* AJOUT D'UN EVENT DANS LE CALENDRIER */
  if (route.params != undefined) {
    let item = route.params.event
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.item}>
          <Text style={styles.titre}>Ajout de {item.nom} au calendrier</Text>
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
                onPress={() => { addEventInCalendar(item, date); item = null; navigation.navigate("Calendrier") }}>
                <Text>
                  Ajouter
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bouton} onPress={() => { item = null; navigation.navigate("Calendrier") }}>
                <Text>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
  /* AFFICHAGE DE TOUT LES ÉVÈNEMENTS */
  return (<AgendaPlanify />)
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
    borderColor: 'black',
    borderWidth: 5,
    margin: '5%',
    flexDirection: 'column'
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

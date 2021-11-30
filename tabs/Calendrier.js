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

  const [markedDates, setMarkedDate] = useState({ [today]: { marked: true, selectedColor: 'blue' } })
  const [calendrier, setCalendrier] = useState([])
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [edit,setEdit] = useState(null)

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

    let tabDates = []
    let Calendrier = []

    data.docs.forEach(item => {
      // à faire avec le id wesh
      if (item.data().user != undefined) {
        if ((item.data().user.Email).toLowerCase() == user.email.toLowerCase()) {
          tabDates.push(item.data().date)
          Calendrier.push(item.data())
        }
      }
    })

    setMarkedDate(tabDates)
    setCalendrier(Calendrier)
  }

  const AddToAgenda = (item) => {
    let date = new Date()
    let day = days[date.getDay()]
    let num = date.getDate()
    let month = months[date.getUTCMonth()]
    let year = date.getFullYear()
    let hour = date.getHours()
    let minutes = date.getMinutes()
    let nom = item.nom
    
    if(edit != null){
      item = edit
      nom = item.event.nom
      console.log(item)
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.item}>
          <Text style={styles.titre}>Ajout de {nom} au calendrier</Text>
          <Text>Choisissez le moment de l'évènement</Text>

          <View style={{ flexDirection: 'column', alignItems: 'center' }}>

            <TouchableOpacity onPress={showDatepicker} style={styles.bouton}>
              <Text>Date : {day} {num} {month} {year}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={showTimepicker} style={styles.bouton}>
              <Text>Heure : {hour}:{minutes}</Text>
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

  const AgendaPlanify = () => {
    if (calendrier != null) {
      let compteur = 1
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
              renderItem={({ item }) => {
                  return (
                    <View style={styles.item}>
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
                          <TouchableOpacity style={styles.bouton} onPress={() => deleteFromCalendar(item)}>
                            <Text>Supprimé</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.bouton} onPress={() => {setEdit(item)}}>
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
  /* AJOUT D'UN EVENT DANS LE CALENDRIER */
  if (route.params != undefined) {
    let item = route.params.event
    return (<AddToAgenda item={item} />)
  }
  if(edit != null){
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
    backgroundColor: '#dcdcdc',
    borderColor: 'grey',
    borderWidth: 2,
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

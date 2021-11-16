import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import Header from '../components/Header';
import Event from '../components/Event';
import PlanifyIndicator from '../components/PlanifyIndicator';
import moment from 'moment';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import * as firebase from 'firebase';
import { event } from 'react-native-reanimated';
import { style } from 'styled-system';

const calendrier = ({ route, navigation }) => {

  /*-------------------constantes et variables-----------------*/
  const [ajout, setAjout] = useState(null)
  const [events, setEvents] = useState({})
  const [markedDates, setMarkedDate] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [calendrier, setCalendrier] = useState([{}])

  const today = new Date().toISOString().split('T')[0]

  const db = firebase.firestore();

  /*-------------------FONCTIONS-------------------*/
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState()

  const getUserInfo = async () => {
    const db = firebase.firestore();
    const ref = db.collection("users").doc(user.uid);

    ref.get().then((doc) => {
      setUserInfo(doc.data())
    })
  }

  function addEventInCalendar(event, date) {
    try {
      return db.collection('Calendrier').add({
        event: event,
        date: date.dateString,
        user: userInfo
      })
    } catch (e) {
      console.log("ERREUR DANS L'AJOUT D'UN EVENT DANS LE CALENDRIER:", e)
    }
    finally {
      console.log(event.nom, " ajouté dans le calendrier")

    }
  }

  function editEventFromCalendar(eventId) {
    console.log("Edit event from calendar:", eventId)
  }

  function deleteFromCalendar(eventId) {
    console.log("Delete evetn from calendar", eventId)
  }

  /*--POUR ALLÉ CHERCHER LES ÉVÈNEMENTS DÉJÀ AJOUTÉ AU CALENDRIER */
  const getEventsFromCalendar = async () => {
    const response = db.collection('Calendrier');
    const data = await response.get();
    let tabDates = []
    let tabEvents = []
    let Calendrier = ([{}])

    data.docs.forEach(item => {
      // à faire avec le id wesh
      if(item.data().user != undefined){
        if (item.data().user.Email == user.email) {
          tabDates.push((item.data().year + '-' + item.data().month + '-' + item.data().day).toString())
          tabEvents.push(item.data().event)
          Calendrier.push({ "date": ((item.data().year + '-' + item.data().month + '-' + item.data().day).toString()), "event": item.data().event })
        }
        else{
          setEvents("Aucun évènement")
        }
      }
      
    })

    setMarkedDate(tabDates)
    setEvents(tabEvents)
    setCalendrier(Calendrier)
  }

  const AgendaPlanify = () => {
    if (calendrier != null) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Calendar
            selected={today}
            minDate={new Date()}
            markedDates={markedDates}
          />
          <View style={styles.itemContainer}>
            <Text style={styles.titre}>ÉVÈNEMENTS DANS LE CALENDRIER</Text>
            <FlatList
              data={events}
              refreshing={true}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Event item={item} navigation={navigation} nomPage={"Calendrier"} userInfo={userInfo} uid={item.User} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text>Planifié le </Text>
                      {/* {
                        item.map(function(key,value){
                          return(
                            <View>
                              <Text>{value}</Text>
                            </View>
                          )
                        })
                      } */}
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
                )
              }}
            />
          </View>
        </SafeAreaView>
      )

    }
    else if (calendrier.size == 0) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Calendar />
          <Text>Aucuns évènements dans le calendrier</Text>
        </SafeAreaView>

      )
    }
  }
  useEffect(() => {
    setUserInfo(null)
    getUserInfo()
    setEvents(null)
    getEventsFromCalendar()
  }, []);

  /*----------------AFFICHAGE------------------*/
  if (events == undefined || events == null)
    return (<PlanifyIndicator />)
  /* AJOUT D'UN EVENT DANS LE CALENDRIER */
  if (route.params != undefined) {
    let item = route.params.event
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.item}>
          <Text style={styles.titre}>Ajout de {item.nom} au calendrier</Text>
          <Text>Choisissez la date</Text>
          <Calendar
            onDayPress={(day) => { console.log(day); setCurrentDate(day) }}
            minDate={new Date()}
            markedDates={currentDate.dateString}
          />
          <TouchableOpacity
            style={styles.bouton}
            onPress={() => addEventInCalendar(item, currentDate)}>
            <Text>
              Ajouter
            </Text>
          </TouchableOpacity>
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
    fontSize: 30
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
    textAlign:'center'
  }
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

import Header from '../components/Header';
import EventButton from '../components/EventButton';
import PlanifyIndicator from '../components/PlanifyIndicator';

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import * as firebase from 'firebase';
import { event } from 'react-native-reanimated';

const calendrier = ({ route, navigation }) => {

  /*-------------------constantes et variables-----------------*/

  const [events, setEvents] = useState({})
  const db = firebase.firestore();

  /*-------------------FONCTIONS-------------------*/
  const timeToString = (time) => {
    const d = new Date(time);
    return d.toISOString().split('T')[0];
  };

  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!events[strTime]) {
          events[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            events[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }
      const newItems = {};
      Object.keys(events).forEach((key) => {
        newItems[key] = events[key];
      });
      setEvents(newItems);
    }, 1000);
  };

  function addEventInCalendar(event) {
    console.log("Ajouté dans le calendrier")

    try {
      return db.collection('Calendrier').add({
        event: event,
        day: (event.Date.toDate().getDay()),
        year: (event.Date.toDate().getFullYear()),
        month: (event.Date.toDate().getMonth())
      })
    } catch (e) {
      console.log("ERREUR DANS L'AJOUT D'UN EVENT DANS LE CALENDRIER:", e)
    }
  }

  /*--POUR ALLÉ CHERCHER LES ÉVÈNEMENTS DÉJÀ AJOUTÉ AU CALENDRIER */
  const getEventsFromCalendar = async () => {
    const response = db.collection('Calendrier');
    const data = await response.get();
    let tab = []

    data.docs.forEach(item => {
      tab.push((item.data().year + '-' + item.data().month + '-' + item.data().day).toString())
    })
    setEvents(tab)
  }


  const renderItem = (event) => {
    return (
      <View style={styles.itemContainer}>
        <View style={{ flexDirection: 'column' }}>

          {/* titre */}
          <Text style={styles.titre}>{event.nom}</Text>

          {/* description */}
          <View style={{ flexDirection: 'row' }}>
            <Text>
              {event.description}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {/* <EventButton navigation={navigation} item={event} nomPage={page} /> */}
            <TouchableOpacity onPress={() => addEventInCalendar(event)}>
              <Text>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

    )
  }
  useEffect(() => {
    setEvents(null)
    getEventsFromCalendar()
    loadItems
  }, []);

  /*----------------AFFICHAGE------------------*/
  /*si un event est voulue ajouté au calendrier */
  if (route.params != undefined) {
    const event = route.params.event
    const page = route.params.page
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Agenda
          items={event}
          selected={`${new Date().toLocaleDateString()}`}
          renderItem={() => renderItem(event)}
        />
      </SafeAreaView>
    )
  }

  // avec tout les évènements déjà ajouté auparavant
  else if (route.params == undefined) {

    if (events != undefined) {
      console.log(events[0])
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Agenda
            items={
              events
            }
            //loadItemsForMonth={loadItems}
            selected={`${new Date().toLocaleDateString()}`}
            // markedDates={{`${events[0]}`:{selected: true, marked: true}}}
            renderItem={()=> {
              return(
                <View>
                  <Text>{events}</Text>
                </View>
              )
            }}
          />
        </SafeAreaView>
      )
    }
    else if (events == undefined || events == null)
      return (<PlanifyIndicator />)

  }

}

export default calendrier;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
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
    fontSize: 35
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
  }
});

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import PlanifyIndicator from '../components/PlanifyIndicator';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const db = firebase.firestore();

const calendrier = ({ route, navigation }) => {

  /*-------------------constantes et variables-----------------*/
  const _today = new Date().toISOString().split('T')[0]

  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre",
    "Octobre", "Novembre", "Décembre"];

  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const markedTemplate =
  {
    marked: {
      [_today]: { disabled: false, selected: true, marked: true, selectedColor: 'orange' }
    }
  }

  const [markedDates, setMarkedDates] = useState(markedTemplate)

  const [items, setItems] = useState({})

  const [calendrier, setCalendrier] = useState([])
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null)

  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState()
  
  /*-------------------FONCTIONS-------------------*/
  //#####################################################
  const getUserInfo = async () => {
    const db = firebase.firestore();
    const ref = db.collection("users").doc(user.uid);

    ref.get().then((doc) => {
      setUserInfo(doc.data())
    })
  }
  //#####################################################

  function addEventInCalendar(event, date) {
    date = date.toISOString().split('T')[0]

    try {
      db.collection('Calendrier').doc(event.nom).set({
        event: event,
        date: date,
        user: userInfo
      })      
    } catch (e) {
      console.log("ERREUR DANS L'AJOUT D'UN EVENT DANS LE CALENDRIER:", e)
    }
    finally{
      console.log(event.nom, " ajouté dans le calendrier")
    }
  }
  //#####################################################

  const deleteFromCalendar = async (event) => {
    try {
      await db.collection("Calendrier").doc(event.nom).delete();
      alert(`${event.nom} supprimé`)
    } catch (e) {
      console.log("Erreur dans la suppresion de ", event.nom, ":", e)
    }
    finally{
      console.log("event deleted")
    }
  }

  //#####################################################
  /*--POUR ALLÉ CHERCHER LES ÉVÈNEMENTS DÉJÀ AJOUTÉ AU CALENDRIER */
  const getEventsFromCalendar = async () => {
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
  //#####################################################
  function timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  //#####################################################

  const loadItems = () => {
    let dates = []

    calendrier.forEach(item => {
      dates.push(item.date)
    })

    var obj = dates.reduce((c, v) => Object.assign(c, { [v]: { selected: true, marked: true, selectedColor: 'blue' } }), {});
    setMarkedDates({ ...markedDates, marked: obj })

    calendrier.forEach(item => {
      const t = timeToString(item.date)

      if (!items[t]) {
        items[t] = [];
        items[t].push(
          {
            nom: item.event.nom,
            Description: item.event.Description,
            localisation: item.event.localisation,
            User: item.event.User,
            Catégorie: item.event.Catégorie,
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

  //#####################################################
  ///
  ///Page pour ajouter quelque chose dans l'agenda
  ///
  const AddToAgenda = ({ item }) => {
    let nom = "évènement"
    if (edit != null && route.params == null) {
      item = edit.event
      nom = edit.event.nom
    }
    nom = item.nom

    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: '80%', backgroundColor: 'white', height: '40%', shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.29, shadowRadius: 14.65, elevation: 22 }}>
          <View style={{ alignItems: 'flex-start', borderBottomColor: '#dcdcdc', borderBottomWidth: 1, paddingLeft: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Ajouter un évènement</Text>
            <Text>{nom}</Text>
          </View>
          <View style={{ marginTop: 10, marginLeft: 10 }}>
            <Text style={{ color: 'gray' }}>Date & temps</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 5 }}>
            <View style={{ width: '95%', backgroundColor: '#dcdcdc', height: 35, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={showDatepicker}>
                <Text style={{ fontWeight: '550' }}>{days[date.getDay()]}, {date.getDate()} {months[date.getUTCMonth()]} {date.getFullYear()}</Text>
              </TouchableOpacity>
              <Icon name="calendar-blank-outline" size={20} style={{}} />
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 5 }}>
            <View style={{ width: '95%', backgroundColor: '#dcdcdc', height: 35, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={showTimepicker}>
                <Text style={{ fontWeight: '500' }}>{date.getHours()}:{date.getMinutes()}</Text>
              </TouchableOpacity>
              <Icon name="clock-time-eight-outline" size={20} style={{}} />
            </View>
          </View>
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
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', margin: 10 }}>
            <TouchableOpacity
              style={{ height: 50, backgroundColor: '#05386b', width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}
              onPress={() => { addEventInCalendar(item, date); setEdit(null); navigation.navigate("Calendrier"), getEventsFromCalendar() }}>
              <Text style={{ color: '#fff' }}>
                Ajouter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ height: 50, backgroundColor: '#dcdcdc', width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginLeft: 5 }}
              onPress={() => { setEdit(null); navigation.navigate("Calendrier") }}>
              <Text>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  ///
  ///Pour chaque item dans le calendrier
  ///

  const renderItem = (item) => {
    console.log('renderITem:', item)
    return (
      <ScrollView style={styles.item}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.titre}>
              {item.nom}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>
              {item.Description}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>
              Planifié le {item.date}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.bouton} onPress={() => { deleteFromCalendar(item); getEventsFromCalendar }}>
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
      <View>
          <Agenda
            selected={new Date()}
            markedDates={markedDates.marked}
            items={items}
            renderItem={(item) => renderItem(item)}
            hideKnob={false}
            showClosingKnob={true}
          />
      </View>

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

  useEffect(() => {
    getUserInfo()
    getEventsFromCalendar()
    loadItems()
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
  if ((calendrier != undefined || calendrier != null) && items != null)
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
    alignItems: 'center'
  },
  bouton: {
    backgroundColor: "#00a46c",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    color: 'white',
    alignContent: 'center',
    textAlign: 'center',
    margin: 30,
    alignItems: 'center'
  }
});

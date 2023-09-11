import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

///
///Page pour ajouter quelque chose dans l'agenda
///
const AddToAgenda = ({ item }) => {
    let nom = "évènement"
    if (edit != null && route.params == null) {
        item = edit.event
        nom = item.nom
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


export default AddToAgenda;
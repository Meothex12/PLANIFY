///
///Pour chaque item dans le calendrier
///
import React from "react";
import { View, Text,ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';

const renderItem = (item) => {
    console.log('renderITem:', item)
    return (
        <ScrollView style={styles.item}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titre}>
                        {compteur++}.{item.nom}
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

export default renderItem;
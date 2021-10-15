import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import * as firebase from 'firebase';

const sportsScreen = () => {
  const db = firebase.firestore();
  const [sports, setSports] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  /*--aller chercher tout les festivals--*/
  const getSports = async () => {
    const response = db.collection('Sports');
    const data = await response.get();
    let S = []

    setIsFetching(true)

    data.docs.forEach(item => {
      S.push(item.data())
      setIsFetching(true)
    })

    setSports(S)
    setIsFetching(false)
  }

  useEffect(() => {
    setSports(null)
    getSports()
  }, []);

  return (
    <View style={styles.container}>
      <FlatList 
        data={sports} 
        keyExtractor={item => item.id} 
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item.id}. {item.type} à l'{item.ExtérieurOuIntérieur}</Text>
            </View>
          )
        }}>
      </FlatList>
    </View>
  )
}

export default sportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
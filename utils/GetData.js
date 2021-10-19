import * as firebase from 'firebase';

const getEvent = async (tableName) => {
    const db = firebase.firestore();
    const response = db.collection(tableName);
    const data = await response.get();

    let tab = []
    data.docs.forEach(item => {
        tab.push(item.data())
    })
    console.log(tab)
    return tab
}

export default getEvent;
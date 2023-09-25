import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { doc, getDoc, setDoc, addDoc, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"; 


// Importing the Firestore instance
import { db } from './config.jsx';

export default function DrinkTimer() {
  const [currentInput, setCurrentInput] = useState('');
  const [dailyIntakeGoal, setDailyIntakeGoal] = useState('');
  const [dailyIntake, setDailyIntake] = useState([]);

  // Load dailyGoal from Firestore when component mounts
  useEffect(() => {
    const fetchDailyGoal = async () => {
      const docRef = doc(db, "meta", "dailyGoal");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDailyIntakeGoal(docSnap.data().goal);
      }
    };

    fetchDailyGoal();
  }, []);

  // Load recent drinks from Firestore when component mounts
  useEffect(() => {
    const drinksQuery = query(collection(db, "drinks"), orderBy('timestamp', 'desc'), limit(5));
const unsubscribe = onSnapshot(drinksQuery, (querySnapshot) => {
  const drinksData = querySnapshot.docs.map(doc => doc.data());
  setDailyIntake(drinksData);
});


    return () => unsubscribe();
  }, []);

  const saveDailyGoal = async () => {
    const docRef = doc(db, "meta", "dailyGoal");
    await setDoc(docRef, { goal: dailyIntakeGoal });
  };

  const handleSubmit = async () => {
    if (currentInput) {
        const now = new Date();
        const formattedTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        const intakeEntry = {
            amount: parseFloat(currentInput),
            timestamp: formattedTime,
            id: new Date().getTime().toString(),
        };

        try {
            await addDoc(collection(db, 'drinks'), intakeEntry);
            setDailyIntake([intakeEntry, ...dailyIntake]);
            setCurrentInput('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
  };

  const totalIntake = dailyIntake.reduce((total, intake) => total + intake.amount, 0);
  const percentageOfGoal = (totalIntake / parseFloat(dailyIntakeGoal || 1)) * 100;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter amount in ml"
        keyboardType="numeric"
        value={currentInput}
        onChangeText={text => setCurrentInput(text)}
      />
      <Button title="Submit" onPress={handleSubmit} />

      <TextInput
        style={styles.input}
        placeholder="Enter daily goal in ml"
        keyboardType="numeric"
        value={dailyIntakeGoal}
        onChangeText={text => setDailyIntakeGoal(text)}
        onBlur={saveDailyGoal} // Save to Firestore when user leaves the input
      />


      <Text style={styles.summary}>
        Daily Intake: {totalIntake} ml which is {percentageOfGoal.toFixed(2)}% of your daily intake goal of {dailyIntakeGoal} ml
      </Text>

      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Last 5 drinks</Text>
        <View style={styles.underline} />
      </View>

      <FlatList
        data={dailyIntake.slice(0, 5)}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.amount} ml at {item.timestamp}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  summary: {
    marginTop: 20,
    fontSize: 18,
  },
  titleBar: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  underline: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginTop: 5,
  },
  listItem: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
  },
});

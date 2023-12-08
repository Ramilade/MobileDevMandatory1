import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, ImageBackground, TextInput, Button, FlatList, View, Text, StyleSheet } from 'react-native';
import { doc, getDoc, setDoc, addDoc, collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { db } from './config.jsx';

export default function DrinkTimer() {
  const [currentInput, setCurrentInput] = useState('');
  const [dailyIntakeGoal, setDailyIntakeGoal] = useState('');
  const [dailyIntake, setDailyIntake] = useState([]);
  const [archivedIntakes, setArchivedIntakes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(new Date());

  const archiveDailyIntake = async () => {
    const yesterday = lastSubmitTime.toISOString().split('T')[0];
    const docRef = doc(db, "dailyArchive", yesterday);
    await setDoc(docRef, { intake: dailyIntake });

    const querySnapshot = await getDocs(collection(db, "dailyArchive"));
    setArchivedIntakes(querySnapshot.docs.map(doc => ({ date: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    const fetchArchivedData = async () => {
      const querySnapshot = await getDocs(collection(db, "dailyArchive"));
      setArchivedIntakes(querySnapshot.docs.map(doc => ({ date: doc.id, ...doc.data() })));
    };

    fetchArchivedData();
  }, []);

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
      const intakeEntry = { amount: parseFloat(currentInput), timestamp: formattedTime, id: new Date().getTime().toString() };

      if (now.getDate() !== lastSubmitTime.getDate() || now.getMonth() !== lastSubmitTime.getMonth() || now.getFullYear() !== lastSubmitTime.getFullYear()) {
        await archiveDailyIntake();
        setDailyIntake([]);
      }

      try {
        await addDoc(collection(db, 'drinks'), intakeEntry);
        setDailyIntake([intakeEntry, ...dailyIntake]);
        setCurrentInput('');
        setLastSubmitTime(now);

        const newTotalIntake = dailyIntake.reduce((total, intake) => total + intake.amount, 0) + parseFloat(currentInput);
        if (newTotalIntake >= parseFloat(dailyIntakeGoal)) {
          setHasReachedGoal(true);
        }
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const totalIntake = dailyIntake.reduce((total, intake) => total + intake.amount, 0);
  const percentageOfGoal = (totalIntake / parseFloat(dailyIntakeGoal || 1)) * 100;

  return (
    <ImageBackground 
      source={require('./waterdrop.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount in ml"
          keyboardType="numeric"
          value={currentInput}
          onChangeText={text => setCurrentInput(text)}
        />
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Set Daily Goal" onPress={() => setIsModalVisible(true)} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Enter daily goal in ml"
                keyboardType="numeric"
                value={dailyIntakeGoal}
                onChangeText={text => setDailyIntakeGoal(text)}
              />
              <Button title="Save" onPress={async () => {
                await saveDailyGoal();
                setIsModalVisible(false);
              }} />
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ marginTop: 10 }}>
                <Text style={{ color: 'blue' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={hasReachedGoal}
          onRequestClose={() => setHasReachedGoal(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Congratulations! You've reached your daily goal of {dailyIntakeGoal} ml!</Text>
              <Button title="Great!" onPress={() => setHasReachedGoal(false)} />
            </View>
          </View>
        </Modal>

        <Text style={styles.summary}>
          Daily Intake: {totalIntake} ml which is {percentageOfGoal.toFixed(2)}% of your daily intake goal of {dailyIntakeGoal} ml
        </Text>

        <FlatList
          data={dailyIntake.slice(0, 5)}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.amount} ml at {item.timestamp}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />

        <Text style={styles.archiveTitle}>Archived Intakes:</Text>
        <FlatList
          data={archivedIntakes}
          renderItem={({ item }) => (
            <View style={styles.archiveItem}>
              <Text>Date: {item.date}</Text>
              <Text>Total Intake: {item.intake.reduce((total, { amount }) => total + amount, 0)} ml</Text>
            </View>
          )}
          keyExtractor={item => item.date}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  listItem: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  archiveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  archiveItem: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
  },
});

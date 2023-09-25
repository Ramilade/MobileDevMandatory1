import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/app';
import 'firebase/firestore';

import WaterIntakeInformation from './waterIntakeInformation';
import DrinkTimer from './drinkTimer';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
           name="Home" 
           component={HomeScreen} 
           options={{
               title: 'Homescreen',
               headerTitleAlign: 'center'
           }}
       />
        <Stack.Screen 
          name="WaterIntakeInformation" 
          component={WaterIntakeInformation} 
          options={{ title: 'Water Intake Recommendations' }}
        />
        <Stack.Screen
          name="DrinkTimer"
          component={DrinkTimer}
          options={{ title: 'Daily Overview' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.welcomeMessage}>
          ...to this simple Drink Timer app. Use it to keep track of your daily liquid intake.
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Daily Intake Overview"
          onPress={() => navigation.navigate('DrinkTimer')}
        />
        <Button
          title="Water Intake Recommendations"
          onPress={() => navigation.navigate('WaterIntakeInformation')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  welcomeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

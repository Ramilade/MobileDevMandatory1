import React, {useRef} from 'react';
import { StyleSheet, View, Button, Text, Animated,Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';

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
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('./waterdrop.jpg')} 
        style={styles.backgroundImage}
      />
  
      <View style={styles.overlay}>
        <View style={styles.welcomeContainer}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}>
            <Animated.View
              style={{
                transform: [
                  { translateX: translateX },
                  { translateY: translateY },
                ],
              }}>
              <Text style={styles.title}>Welcome</Text>
            </Animated.View>
          </PanGestureHandler>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5 // Adjust opacity for watermark effect
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent', // Ensure background is transparent
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

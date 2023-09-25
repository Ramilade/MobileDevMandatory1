// waterIntakeInformation.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WaterIntakeInformation() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Water Intake Recommendations</Text>
      <Text style={styles.text}>
        The recommended amount of water a person should consume daily can vary based on different factors, 
        including age, gender, level of physical activity, health status, and the climate in which the person resides.
      </Text>

      <Text style={styles.text}>
        The World Health Organization (WHO) and many national health authorities have guidelines on water intake. 
        However, it's important to note that many of these recommendations account for all fluid intake – not just water. 
        This includes fluids from food and other beverages.
      </Text>

      <Text style={styles.text}>
        Generally, it is often said that adults should aim to drink about 2-2.5 liters of water per day. 
        However, this can vary. For instance, athletes or individuals living in very hot climates might require more.
      </Text>

      <Text style={styles.text}>
        To get the most accurate and updated guidelines specific to your region, you could check with your country's 
        health department or consult with a nutritionist.
      </Text>

      <Text style={styles.text}>
        If you specifically want to know how much to drink per hour, it depends on your activity and surroundings. 
        During intense physical activity or in hot climates, you might need to drink more regularly.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'justify',
  },
});

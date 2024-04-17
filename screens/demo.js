import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <ScrollView>
      <Text style={styles.title}>Welcome to GroceryGo</Text>
      {/* Sliding photo viewer */}
      <ScrollView horizontal={true}>
        <Image
          style={styles.sliderImage}
          source={require('../assets/BANNER-1-2.png')}
        />
        <Image
          style={styles.sliderImage}
          source={require('../assets/BANNER-1-2.png')}
        />
        <Image
          style={styles.sliderImage}
          source={require('../assets/BANNER-1-2.png')}
        />
        {/* Add more images as needed */}
      </ScrollView>
      {/* Categories */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryCard}>
          <Image
            style={styles.categoryImage}
            source={require('../assets/BANNER-1-2.png')}
          />
          <Text style={styles.categoryTitle}>Category 1</Text>
        </View>
        <View style={styles.categoryCard}>
          <Image
            style={styles.categoryImage}
            source={require('../assets/BANNER-1-2.png')}
          />
          <Text style={styles.categoryTitle}>Category 2</Text>
        </View>
        {/* Add more category cards as needed */}
      </View>
    </ScrollView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
        {/* Add more tabs as needed */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  sliderImage: {
    width: 300,
    height: 200,
    marginRight: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  categoryCard: {
    width: 150,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
});

export default App;

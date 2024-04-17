import React from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://play-lh.googleusercontent.com/65ZtK0ArYYUDEEnI7M-TPJHFix1MxOwb5fpC--k9eQPT56pz-0ghEJV4NbfNnIa0keBS' }}
          style={styles.logo}
        />
        <Text style={styles.title}>GroceryGO</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={styles.button}
          underlayColor="#DDDDDD"
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          underlayColor="#DDDDDD"
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; // Import FontAwesome5 and MaterialIcons from Expo vector icons

export default function ForgotPass() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // State variable to track loading state
  const { ipAddress } = useContext(UserContext);
  const navigation = useNavigation();

  const validateForm = () => {
    let errors = {};
    if (!email) errors.email = 'Email Id is required';
    // if (!phone) errors.phone = 'Phone number is required';

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true); // Set loading to true when the form is being submitted
      try {
        const response = await fetch(`${ipAddress}/api/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, phone }),
        });
        const data = await response.json();
        setLoading(false); // Set loading to false after the response is received
        console.log('Server response:', data);
        if (data.error) {
          Alert.alert('Error', data.error);
        } else {
          navigation.navigate('OTP Verification', { email, phone });
        }
      } catch (error) {
        setLoading(false); // Set loading to false if there's an error
        console.error('API call error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}><FontAwesome5 name="envelope" size={20} color="#333" /> Email Id:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered Email id"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        {/* <Text style={styles.label}><MaterialIcons name="phone" size={20} color="#333" /> Phone No:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered Mobile No"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        /> */}
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 7,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

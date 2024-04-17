import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';  

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const { userEmail, ipAddress } = useContext(UserContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleSendOtp = async () => {
    // Validation
    if (!email || !firstName || !lastName || !phoneNumber || !password || !confirmPassword ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true); // Set loading to true when initiating the request

    try {
      const response = await axios.post(`${ipAddress}/api/register`, {
        email,
        firstName,
        lastName,
        phoneNumber,
        password
      });
  
      
      if (response.data.message) {
        
        Alert.alert("Info", response.data.message);
      }
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error during registration:', error.message);
      if (error.response && error.response.status === 400 && error.response.data.error) {
        // Show alert if email is already registered
        alert(error.response.data.error);
      } else {
        alert('An error occurred during registration');
      }
    } finally {
      setLoading(false); 
    }
  };
  
  const handleVerifyOtp = async () => {
    setLoading(true); 

    try {
      const response = await axios.post(`${ipAddress}/api/verify`, {
        email,
        otp
      });
  
      
      console.log(response.data);
      if (response.status === 200) {
        // Show success message
        alert("OTP verification successful. You can now proceed to Login.");
        // navigation.navigate('Login');
      } else {
        // Show error message if verification failed
        alert("OTP verification failed. Please try again.");
      }
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      if (error.response && error.response.status === 400 && error.response.data.error) {
        // Show alert if OTP fails
        alert(error.response.data.error);
      } else {
        alert('An error occurred while verifying OTP');
      }
    } finally {
      setLoading(false); // Set loading to false after request completes (success or error)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {!isOtpSent ? (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSendOtp}
          disabled={loading} 
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" /> 
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={loading} 
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" /> 
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFA500',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

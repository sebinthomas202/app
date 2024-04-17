import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { UserContext } from './UserContext';

export default function ForgotPassVerify({ navigation }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { userEmail, ipAddress } = useContext(UserContext);
  const [animation] = useState(new Animated.Value(0));

  const handleSubmit = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 character long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    setPasswordsMatch(true);
    console.log('OTP:', otp);
    console.log('New Password:', newPassword);
  
    try {
      const response = await fetch(`${ipAddress}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,
          newPassword: newPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
        Alert.alert('Success', data.message);
        navigation.navigate("Login");
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again later.');
    }
  };

  const handleButtonPress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    handleSubmit();
  };

  const animatedButtonStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.9],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Enter OTP sent to your Email Id:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP you received"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />
        <Text style={styles.label}>New Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
        />
        <Text style={styles.label}>Confirm New Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />
        {!passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
        <TouchableOpacity
          onPress={handleButtonPress}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.button, animatedButtonStyle]}>
            <Text style={styles.buttonText}>Submit</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    width: '90%',
    borderRadius: 15,
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
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 7,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

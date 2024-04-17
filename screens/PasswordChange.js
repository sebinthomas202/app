import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';

export default function ForgotPass({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);
    console.log('Passwords match. Password:', password);

  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>New Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your new password"
          value={password}
          onChangeText={setPassword}
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
        <TouchableHighlight style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
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
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

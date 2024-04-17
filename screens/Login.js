import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from './UserContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { setUserEmail, ipAddress } = useContext(UserContext);

  const handleSubmit = async () => {

    if (!email.trim() || !password.trim()) {
      setModalMessage("Please fill in all fields.");
      setShowModal(true);
      return;
    }
    try {
      const response = await axios.post(`${ipAddress}/api/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        console.log('Login successful');
        setUserEmail(email);
        navigation.navigate('HomePage');
      } else {
        console.error('Login failed:', response.data.error);
        setModalMessage(response.data.error);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      if (error.response && error.response.status === 401) {
        setModalMessage("Email not verified");
        setShowModal(true);
      } else {
        setModalMessage("Invalid Email-Id or Password.");
        setShowModal(true);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setEmail("");
      setPassword("");
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome back!</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Forgot Password')}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.signupButton}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signupButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#007bff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#ff6347',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

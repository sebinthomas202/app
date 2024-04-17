import React from 'react';
import { View, Text, Button, Linking, StyleSheet, TouchableOpacity } from 'react-native';

const CustomerSupportScreen = ({ navigation }) => {
  
  const goBack = () => {
    navigation.goBack();
  };

  
  const openWhatsAppChat = () => {
    const phoneNumber = '+919207733797';
    const message = 'Hello, I need assistance.';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    Linking.openURL(whatsappUrl).catch(() => {
      alert('WhatsApp is not installed on your device.');
    });
  };

  
  const contactByPhone = () => {
    const phoneNumber = '+919207733797'; 
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Support</Text>
      {/* Add company details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Company Name: Grocery GO</Text>
        <Text style={styles.detailText}>Address: Poonjar, Kottayam, Kerala</Text>
        <Text style={styles.detailText}>Phone: 234567890</Text>
        <Text style={styles.detailText}>Email: grocerygo@gmail.com</Text>
      </View>

      {/* Button to contact via WhatsApp */}
      <TouchableOpacity style={styles.button} onPress={openWhatsAppChat}>
        <Text style={styles.buttonText}>Contact via WhatsApp</Text>
      </TouchableOpacity>

      {/* Button to contact by phone */}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={contactByPhone}>
        <Text style={[styles.buttonText, { color: '#FFF' }]}>Contact by Phone</Text>
      </TouchableOpacity>

      {/* Button to navigate back */}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#FF5722' }]} onPress={goBack}>
        <Text style={[styles.buttonText, { color: '#FFF' }]}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  button: {
    width: '100%',
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomerSupportScreen;

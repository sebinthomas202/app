import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo for vector icons

const AddAddressScreen = ({ navigation }) => {
  const { userEmail, ipAddress } = useContext(UserContext);
  const [houseNo, setHouseNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const response = await axios.get(`${ipAddress}/api/users/${userEmail}/addresses`);
        setUserAddresses(response.data);
      } catch (error) {
        console.error('Error fetching user addresses:', error);
      }
    };

    fetchUserAddresses();
  }, []);

  const handleSaveAddress = async () => {
    try {
      if (
        houseNo.trim() === '' ||
        streetName.trim() === '' ||
        city.trim() === '' ||
        district.trim() === '' ||
        pincode.trim() === '' ||
        mobileNumber.trim() === ''
      ) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      const addressData = {
        userEmail,
        houseNo,
        streetName,
        city,
        district,
        landmark,
        pincode,
        mobileNumber,
      };

      const response = await axios.post(`${ipAddress}/api/addresses`, addressData);

      if (response.status === 201) {
        setUserAddresses(prevAddresses => [...prevAddresses, addressData]);
        navigation.goBack();
      } else {
        throw new Error('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again later.');
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Address</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="home" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="House Number"
            value={houseNo}
            onChangeText={setHouseNo}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="location-city" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Street Name"
            value={streetName}
            onChangeText={setStreetName}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="location-city" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="location-city" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="District"
            value={district}
            onChangeText={setDistrict}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="location-on" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Landmark"
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="location-pin" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
        </View>
        <Button
          title="Save Address"
          onPress={handleSaveAddress}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
        />

        {/* Display user addresses if available */}
        {userAddresses.length > 0 && (
          <View style={styles.addressList}>
            <Text style={styles.addressListTitle}>Your Addresses:</Text>
            {userAddresses.map((address, index) => (
              <TouchableOpacity key={index} onPress={() => handleSelectAddress(address)} style={[styles.addressItem, selectedAddress === address && styles.selectedAddress]}>
                <MaterialIcons name="location-on" size={24} color="black" />
                <Text style={styles.addressText}>{`${address.houseNo}, ${address.streetName}, ${address.city}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addressList: {
    marginTop: 20,
  },
  addressListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 10,
  },
  selectedAddress: {
    backgroundColor: 'lightblue',
  },
  saveButton: {
    backgroundColor: '#007bff', // Example color
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

export default AddAddressScreen;

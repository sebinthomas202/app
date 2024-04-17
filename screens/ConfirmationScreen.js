import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Linking } from 'react-native';
import axios from 'axios';
import CustomButton from '../components/CustomButton';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from './UserContext';
import { MaterialIcons } from '@expo/vector-icons';

const ConfirmationScreen = ({ route, navigation }) => {
  const { cart, email, total } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const { userEmail, ipAddress } = useContext(UserContext);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start();

    fetchUserAddresses();
    calculateExpectedDeliveryDate();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      fetchUserAddresses();
    }, [])
  );


  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(`${ipAddress}/api/users/${email}/addresses`);
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      // Handle error
    }
  };

  const handleSearchButtonPress = () => {
    navigation.navigate('Search');
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.searchIconContainer} onPress={handleSearchButtonPress}>
          <MaterialIcons name="search" size={25} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod || !selectedOrderType) {
      return;
    }

    if (selectedOrderType === 'Home Delivery' && !selectedAddress) {
      alert('Please select an address for home delivery.');
      return;
    }

    try {
      const requestData = {
        userEmail: email,
        products: cart,
        totalAmount: total,
        paymentMethod: selectedPaymentMethod,
        orderType: selectedOrderType,
        address:selectedAddress
      };

      // Include address only if the order type is "Home Delivery" and an address is selected
      if (selectedOrderType === 'Home Delivery' && selectedAddress) {
        requestData.address = selectedAddress;
      }

      if (selectedPaymentMethod === 'UPI') {
        // Prepare UPI deep link
        const upiDeepLink = `upi://pay?pn=upigenerator&pa=silvy12silvy-1@oksbi&cu=INR&am=2`;
  
        // Open the UPI app using deep linking
        Linking.openURL(upiDeepLink);
      } else {
        // Handle other payment methods here
      }

      const response = await axios.post(`${ipAddress}/checkout`, requestData);

      if (response.data.success) {
        alert("Your order has been placed! You will receive a confirmation email shortly.");
        navigation.navigate('Home');
      } else {
        
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      
    }
  };

  const calculateExpectedDeliveryDate = () => {
    const orderTime = new Date();
    const deliveryDate = new Date();
    if (orderTime.getHours() < 17) {
      deliveryDate.setDate(deliveryDate.getDate());
    } else {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }
    const formattedDeliveryDate = deliveryDate.toDateString();
    setExpectedDeliveryDate(formattedDeliveryDate);
  };

  const handleSelectOrderType = (orderType) => {
    setSelectedOrderType(orderType);
    if (orderType === 'Takeaway') {
      setSelectedAddress(null); // reset selectedAddress whe order is takeaway
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.orderDetailsContainer}>
        <Text style={styles.orderDetailsTitle}>Order Details</Text>
        <Text style={styles.orderDetailsText}>Total Quantities: {cart.length}</Text>
        {selectedOrderType === 'Home Delivery' && <Text style={styles.orderDetailsText}>Expected Delivery Date: {expectedDeliveryDate}</Text>}
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>Select Payment Method</Text>
        <TouchableOpacity
          style={[styles.paymentOption, selectedPaymentMethod === 'UPI' && styles.selectedPaymentOption]}
          onPress={() => setSelectedPaymentMethod('UPI')}>
          <Text style={styles.paymentOptionText}>UPI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentOption, selectedPaymentMethod === 'Cash' && styles.selectedPaymentOption]}
          onPress={() => setSelectedPaymentMethod('Cash')}>
          <Text style={styles.paymentOptionText}>Cash on Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* Order type selection */}
      <View style={styles.orderTypeContainer}>
        <Text style={styles.orderTypeTitle}>Select Order Type</Text>
        <TouchableOpacity
          style={[styles.orderTypeOption, selectedOrderType === 'Takeaway' && styles.selectedOrderTypeOption]}
          onPress={() => handleSelectOrderType('Takeaway')}>
          <Text style={styles.orderTypeOptionText}>Takeaway</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orderTypeOption, selectedOrderType === 'Home Delivery' && styles.selectedOrderTypeOption]}
          onPress={() => {
            setSelectedOrderType('Home Delivery');
            calculateExpectedDeliveryDate();
          }}>
          <Text style={styles.orderTypeOptionText}>Home Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* Saved addresses */}
      <ScrollView style={styles.addressScrollView}>
        {selectedOrderType === 'Home Delivery' && (
          <View style={styles.addressContainer}>
            <Text style={styles.addressTitle}>Saved Addresses</Text>
            {addresses.map((address, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.addressOption, selectedAddress === address && styles.selectedAddressOption]}
                onPress={() => handleSelectAddress(address)}>
                <Text style={styles.addressOptionText}>{`${address.houseNo}, ${address.streetName}, ${address.city}, ${address.district}, ${address.landmark}, ${address.pincode}, ${address.mobileNumber}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Price:        {total.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {selectedOrderType === 'Home Delivery' && <CustomButton title="Add Address" onPress={() => navigation.navigate('AddAddress')} />}
        <CustomButton title="Confirm Order" onPress={handleConfirmOrder} disabled={!selectedPaymentMethod || !selectedOrderType} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  orderDetailsContainer: {
    marginBottom: 20,
  },
  orderDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderDetailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  paymentContainer: {
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentOption: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  selectedPaymentOption: {
    backgroundColor: 'lightblue',
  },
  orderTypeContainer: {
    marginBottom: 20,
  },
  orderTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderTypeOption: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderTypeOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  selectedOrderTypeOption: {
    backgroundColor: 'lightblue',
  },
  addressScrollView: {
    maxHeight: 150, // Set a max height to enable scrolling
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressOption: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  selectedAddressOption: {
    backgroundColor: 'lightblue',
  },
  totalContainer: {
    marginTop: 'auto', // Pushes the total section to the bottom
    alignItems: 'center',
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ConfirmationScreen;
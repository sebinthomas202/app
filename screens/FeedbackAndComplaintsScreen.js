import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Text, ScrollView ,Image} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserContext } from './UserContext';

const FeedbackAndComplaintsScreen = () => {
  const [message, setMessage] = useState('');
  const { userEmail, ipAddress } = useContext(UserContext);
  const [isFeedback, setIsFeedback] = useState(null);
  const [isOrderRelated, setIsOrderRelated] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (isOrderRelated && isFeedback === false) {
      fetchOrders();
    }
  }, [isOrderRelated]);

  const fetchOrders = async () => {
    try {
      const apiUrl = `${ipAddress}/orders/${userEmail}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch orders');
    }
  };

  const handleSubmit = async () => {
    if (isFeedback !== null) {
      try {
        const apiUrl = `${ipAddress}${isFeedback ? '/feedback' : '/complaint'}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            message,
            orderNumber: isOrderRelated ? orderNumber : null,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          Alert.alert(
            isFeedback ? 'Feedback Submitted' : 'Complaint Submitted',
            isFeedback ? 'Thank you for your feedback!' : 'Your complaint has been registered.'
          );
          setMessage('');
          setIsOrderRelated(false);
        } else {
          Alert.alert('Error', data.error || 'Something went wrong');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Server error');
      }
    } else {
      Alert.alert('Choose an Option', 'Please select either Feedback or Complaints');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Image
        source={{
          uri: 'https://media.istockphoto.com/id/1312447731/photo/business-woman-at-office-stock-photo.jpg?s=612x612&w=0&k=20&c=wMTxmlwnehNF6NwhHBBfOahPqhE2zSWVkA-VD4yhDxY=',
        }}
        style={styles.headerImage}
      />
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.optionButton, isFeedback === true && styles.selectedOptionButton]} onPress={() => setIsFeedback(true)}>
            <Text style={styles.optionButtonText}>Provide Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, isFeedback === false && styles.selectedOptionButton]} onPress={() => setIsFeedback(false)}>
            <Text style={styles.optionButtonText}>File a Complaint</Text>
          </TouchableOpacity>
        </View>

        {isFeedback !== null && (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={isFeedback ? "Enter your Feedback" : "Enter your complaint"}
              value={message}
              onChangeText={setMessage}
              multiline
              style={styles.textInput}
            />
            <View style={styles.radioContainer}>
              <TouchableOpacity style={styles.radioButton} onPress={() => setIsOrderRelated(true)}>
                <MaterialIcons
                  name={isOrderRelated ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={24}
                  color="black"
                />
                <Text>Order Related</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioButton} onPress={() => setIsOrderRelated(false)}>
                <MaterialIcons
                  name={isOrderRelated ? 'radio-button-unchecked' : 'radio-button-checked'}
                  size={24}
                  color="black"
                />
                <Text>Other Related</Text>
              </TouchableOpacity>
            </View>
            {isOrderRelated && (
              <ScrollView style={styles.orderListContainer}>
                {orders.map((order) => (
                  <TouchableOpacity
                    key={order._id}
                    onPress={() => {
                      setOrderNumber(order.orderId);
                      setSelectedOrder(order.orderId);
                    }}
                  >
                    <View
                      style={[
                        styles.orderItem,
                        selectedOrder === order.orderId && styles.selectedOrderItem,
                      ]}
                    >
                      <Text>Order Date: {order.orderDate}</Text>
                      <Text>Total Amount: {order.totalAmount}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity
  style={styles.submitButton}
  onPress={handleSubmit}
>
  <Text style={styles.buttonText}>
    {isFeedback === true ? 'Submit Feedback' : 'Submit Complaint'}
  </Text>
</TouchableOpacity>

          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  selectedOptionButton: {
    backgroundColor: '#007bff',
  },
  optionButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  orderListContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 200,
    marginBottom: 10,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedOrderItem: {
    backgroundColor: 'lightblue',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerImage: {
    width: 400,
    height: 300,
  },
  
});

export default FeedbackAndComplaintsScreen;

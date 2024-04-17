import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button ,Image} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'; 
import { UserContext } from './UserContext';
import { FontAwesome5 } from '@expo/vector-icons'; 

const OrderDetailsPage = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { userEmail, ipAddress } = useContext(UserContext);
  const isLoggedIn = userEmail !== null; 

  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${ipAddress}/orders/${userEmail}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  // Fetch orders on
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        fetchOrders();
      } else {
        navigation.navigate('Login');
      }
    }, [isLoggedIn, navigation])
  );

  //  individual order item
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => setSelectedOrder(selectedOrder === item ? null : item)}
    >
      <View style={styles.orderHeader}>
        <FontAwesome5 name="receipt" size={20} color="#333" style={styles.icon} />
        <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
      </View>
      <View style={styles.infoRow}>
        <FontAwesome5 name="calendar-alt" size={16} color="#555" style={styles.icon} />
        <Text style={styles.infoText}>Order Date: {new Date(item.orderDate).toLocaleString()}</Text>
      </View>
      <View style={styles.infoRow}>
        <FontAwesome5 name="money-bill-wave" size={16} color="#555" style={styles.icon} />
        <Text style={styles.infoText}>Total Amount: RS.{item.totalAmount}</Text>
      </View>
      <View style={styles.infoRow}>
        <FontAwesome5 name="credit-card" size={16} color="#555" style={styles.icon} />
        <Text style={styles.infoText}>Payment Method: {item.paymentMethod}</Text>
      </View>
      <View style={styles.infoRow}>
        <FontAwesome5 name="clock" size={16} color="#555" style={styles.icon} />
        <Text style={styles.infoText}>Status: {item.status}</Text>
      </View>
      {item.deliveryPerson && (
        <View style={styles.infoRow}>
          <FontAwesome5 name="user" size={16} color="#555" style={styles.icon} />
          <Text style={styles.infoText}>Delivery Person: {item.deliveryPerson}</Text>
        </View>
      )}
      {selectedOrder === item && (
        <View style={styles.productsContainer}>
          <Text style={styles.productsHeader}>
            <FontAwesome5 name="shopping-basket" size={16} color="#333" style={styles.icon} /> Products:
          </Text>
          <FlatList
            data={item.products}
            keyExtractor={(product) => product._id}
            renderItem={({ item: product }) => (
              <View style={styles.productItem}>
                
                <Text style={styles.productName}>{product.product.companyName} {product.product.name}</Text>
                <Text style={styles.productQuantity}>
                  Quantity: {product.quantity}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginMessage}>Please login to view your orders.</Text>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        <FontAwesome5 name="receipt" size={24} color="#333" style={styles.icon} /> Order Details
      </Text>
      {/* Render list of orders */}
      <FlatList
        data={orders}
        keyExtractor={(order) => order._id}
        renderItem={renderOrderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  orderItem: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  },
  productsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  productsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  productItem: {
    marginBottom: 10,
    marginLeft: 20,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productQuantity: {
    fontSize: 14,
    color: '#555',
  },
  loginMessage: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
});

export default OrderDetailsPage;

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Buffer } from 'buffer';
import { UserContext } from './UserContext';
import CustomButton from '../components/CustomButton';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const { userEmail, ipAddress } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const isLoggedIn = userEmail !== null;

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
    }
  }, [isLoggedIn, navigation]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${ipAddress}/cart/${userEmail}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isLoggedIn) {
        fetchCart();
      }
    });

    return unsubscribe;
  }, [navigation, isLoggedIn]);

  useEffect(() => {
    let total = 0;
    cart.forEach(item => {
      total += item.quantity * item.product.price;
    });
    setTotalPrice(total);
  }, [cart]);

  const updateCart = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        // Remove the item from the cart
        await axios.delete(`${ipAddress}/cart/${userEmail}/${productId}`);
      } else {
        // Update the quantity of the item in the cart
        await axios.put(`${ipAddress}/cart/${userEmail}`, {
          productId,
          quantity: newQuantity
        });
      }

      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (totalPrice <= 499) {
      Alert.alert('Minimum Order Quantity', 'To proceed to checkout, the minimum order amount should be ₹500.');
    } else {
      navigation.navigate('ConfirmationScreen', { cart: cart, email: userEmail, total: totalPrice });
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCart();
    setRefreshing(false);
  }, []);

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text>Please login to view your cart.</Text>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.shopNowButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Cart</Text>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.scrollView}
      >
        {cart.map(item => (
          <View key={item.product._id} style={styles.itemContainer}>
            <Image
              source={{ uri: `data:${item.product.image.contentType};base64,${Buffer.from(item.product.image.data.data).toString('base64')}` }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.detailsContainer}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text style={styles.price}>Price: ₹{item.product.price.toFixed(2)}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => updateCart(item.product._id, item.quantity - 1)}>
                  <FontAwesome name="minus-circle" size={24} color="#FF6347" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateCart(item.product._id, item.quantity + 1)}>
                  <FontAwesome name="plus-circle" size={24} color="#32CD32" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {cart.length > 0 && (
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Total Price:</Text>
          <Text style={styles.totalPrice}>₹{totalPrice.toFixed(2)}</Text>
        </View>
      )}
      {cart.length > 0 && (
        <CustomButton title="Checkout " onPress={handleCheckout} itemCount={cart.length} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
  },
});

export default CartScreen;

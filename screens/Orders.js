import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Buffer } from 'buffer';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductPage = ({ route }) => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userEmail, ipAddress, setIsLoggedIn } = useContext(UserContext);
  const navigation = useNavigation();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantityOptions, setQuantityOptions] = useState([1]);

  const fetchProductDetails = useCallback(async (productId) => {
    try {
      setLoading(true);
      const productResponse = await axios.get(`${ipAddress}/view-prod/${productId}`);
      const productData = productResponse.data;
  
      if (productResponse.status === 200) {
        setProduct(productData);
        setQuantityOptions(Array.from({ length: productData.stock }, (_, i) => i + 1));
  
       
        const similarProductsResponse = await axios.get(`${ipAddress}/products-fetch/${productData.category}`);
        const similarProductsData = similarProductsResponse.data;
  
        if (similarProductsResponse.status === 200) {
          setSimilarProducts(similarProductsData);
        } else {
          console.error('Error fetching similar category products:', similarProductsData.error);
        }
      } else {
        console.error('Error fetching product details:', productData.error);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    const { productId } = route.params;

    if (productId) {
      fetchProductDetails(productId);
    }

    return () => {
      setProduct(null);
    };
  }, [route.params.productId, fetchProductDetails]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    try {
      if (!userEmail) {
        navigation.navigate('Login', { redirectTo: 'Product' });
        return;
      }
      if (quantity > product.stock) {
        Alert.alert('Error', 'Required quantity not available in stock');
        return;
      }

      const response = await axios.post(`${ipAddress}/cart/add`, {
        productId: product._id,
        email: userEmail,
        quantity: quantity
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Product added to cart successfully');
        navigation.navigate("Cart")
      } else {
        Alert.alert('Error', 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleSearchButtonPress = () => {
    navigation.navigate('Search');
  };

  const handleSimilarProductPress = (productId) => {
    console.log(productId)
    navigation.navigate('Product', { productId });
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.searchIconContainer} onPress={handleSearchButtonPress}>
          <MaterialIcons name="search" size={25} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);
  // console.log(product)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : product ? (
        <>
          <Image
            source={{ uri: `data:${product.image.contentType};base64,${Buffer.from(product.image.data.data).toString('base64')}` }}
            style={styles.image}
            resizeMode="cover"
          />
          
          <Text style={styles.price}>Rs {product.price}</Text>
          <Text style={styles.description}>{product.companyName}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Quantity:</Text>
            {product.stock > 0 ? (
              <Picker
                selectedValue={quantity}
                style={styles.quantityPicker}
                onValueChange={(itemValue) => handleQuantityChange(itemValue)}
              >
                {quantityOptions.map((value) => (
                  <Picker.Item key={value} label={value.toString()} value={value} />
                ))}
              </Picker>
            ) : (
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={[styles.button, styles.buyNowButton]} onPress={() => console.log('Buy Now clicked')}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={[styles.button, styles.addToCartButton]} onPress={handleAddToCart}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.similarProductsContainer}>
            <Text style={styles.similarProductsTitle}>Similar Products</Text>
            {similarProducts.map((similarProduct) => (
              <TouchableOpacity 
                key={similarProduct._id} 
                onPress={() => handleSimilarProductPress(similarProduct.pid)}
                style={styles.similarProductItem}
              >
                <Image
                  source={{ uri: `data:${similarProduct.image.contentType};base64,${Buffer.from(similarProduct.image.data.data).toString('base64')}` }}
                  style={styles.similarProductImage}
                  resizeMode="cover"
                />
                <View style={styles.similarProductInfo}>
                  <Text style={styles.similarProductName}>{similarProduct.name}</Text>
                  <Text style={styles.similarProductPrice}>Rs {similarProduct.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 350,
    marginBottom: 20,
    borderRadius: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  quantityText: {
    marginRight: 10,
    fontSize: 18,
    color: '#555',
  },
  quantityPicker: {
    width: 100,
    height: 40,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 5,
  },
  buyNowButton: {
    backgroundColor: '#2ecc71',
    marginRight: 10,
  },
  addToCartButton: {
    backgroundColor: '#3498db',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchIconContainer: {
    marginRight: 15,
  },
  similarProductsContainer: {
    marginTop: 20,
  },
  similarProductsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  similarProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  similarProductImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  similarProductInfo: {
    flex: 1,
  },
  similarProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  similarProductPrice: {
    fontSize: 14,
    color: '#555',
  },
});

export default ProductPage;

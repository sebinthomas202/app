import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, TextInput, StyleSheet, RefreshControl } from 'react-native';
import { Buffer } from 'buffer';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { UserContext } from './UserContext';

const { width } = Dimensions.get('window');
const itemWidth = (width - 50) / 2;

const CategoryItem = ({ category, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.categoryItemContainer, isSelected ? styles.selectedCategoryItem : null]}
    onPress={() => onPress(category)}
  >
    <Text style={[styles.categoryItemText, isSelected ? styles.selectedCategoryText : null]}>{category}</Text>
  </TouchableOpacity>
);

const ProductItem = ({ item, onPress }) => {
  const isImageValid = item.image && item.image.data && item.image.data.type === 'Buffer';

  const getBase64Image = () => {
    const bufferData = Buffer.from(item.image.data.data);
    return `data:${item.image.contentType};base64,${bufferData.toString('base64')}`;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.productItemContainer}>
      {isImageValid ? (
        <Image source={{ uri: getBase64Image() }} style={styles.productItemImage} />
      ) : (
        <View style={styles.productItemPlaceholder}>
          <Text style={styles.productItemPlaceholderText}>Image not available</Text>
        </View>
      )}
      <Text style={styles.productItemName}>{item.companyName} {item.name}</Text>
      {item.stock === 0 ? (
        <Text style={[styles.productItemPrice, { color: 'red' }]}>Out of quantity</Text>
      ) : (
        <Text style={styles.productItemPrice}>₹{item.price}</Text>
      )}
    </TouchableOpacity>
  );
};


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { userEmail, ipAddress } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // console.log(ipAddress)
      const productResponse = await fetch(`${ipAddress}/view-pro`);
      const productData = await productResponse.json();
      setProducts(productData);

      const categoryResponse = await fetch(`${ipAddress}/categories-fetch`);
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);
      // console.log(categoryData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const handleProductPress = (item) => {
    navigation.navigate('Product', { productId: item.pid });
  };

  const handleCategoryPress = async (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      fetchData();
    } else {
      try {
        const response = await fetch(`${ipAddress}/products-fetch/${category}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setSelectedCategory(category);
    }
  };

  const renderHeader = () => (
    <View>
      <Image
        source={{
          uri: 'https://www.cubeoneapp.com/blog/wp-content/uploads/2022/06/oneapp_Blog-online-grocery-store-1024x576.png',
        }}
        style={styles.headerImage}
      />
      <Text style={styles.headerTitle}>Categories</Text>
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onPress={handleCategoryPress}
            isSelected={selectedCategory === item}
          />
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryListContainer}
      />
      <Text style={styles.productsTitle}>Products</Text>
    </View>
  );

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for items"
        placeholderTextColor="#888"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        onFocus={handleSearchPress}
      />
      <FlatList
        data={products}
        removeClippedSubviews={true}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        renderItem={({ item }) => <ProductItem item={item} onPress={() => handleProductPress(item)} />}
        keyExtractor={(item) => (item._id ? item._id.toString() : Math.random().toString())}
        contentContainerStyle={styles.flatListContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 18,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
    marginBottom: 10,
  },
  headerImage: {
    width: width,
    height: 200,
  },
  headerTitle: {
    textAlign:'center',
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  categoryListContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 25
  },
  categoryItemContainer: {
    marginRight: 10,
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  categoryItemText: {
    fontSize: 16,
  },
  selectedCategoryItem: {
    backgroundColor: 'blue',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  productsTitle :{
    textAlign:'center',
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,

  },
  productItemContainer: {
    margin: 10,
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productItemImage: {
    width: '100%',
    height: itemWidth - 50,
    borderRadius: 5,
    marginBottom: 10,
  },
  productItemPlaceholder: {
    width: '100%',
    height: itemWidth - 50,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productItemPlaceholderText: {
    fontSize: 16,
    color: '#555',
  },
  productItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productItemPrice: {
    fontSize: 18,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold'
  },
});

export default HomePage;

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from './UserContext';

const SearchPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { userEmail, ipAddress} = useContext(UserContext);

  const fetchSuggestions = useCallback(async (query) => {
    try {
      const response = await fetch(`${ipAddress}/search?query=${query}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, fetchSuggestions]);

  const handleSearchItemPress = (item) => {
    navigation.navigate('Product', { productId: item.pid }); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for items"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSearchItemPress(item)} style={styles.suggestionItem}>
            <Text style={styles.productName}>{item.companyName} {item.name}</Text>
            {/* <Text style={styles.companyName}>Company: {item.companyName}</Text> */}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  suggestionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#888',
  },
});

export default SearchPage;

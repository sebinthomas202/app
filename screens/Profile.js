// ProfileScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from './UserContext';
import { AntDesign } from '@expo/vector-icons'; 

const ProfileScreen = ({ navigation }) => {
  const { userEmail, setUserEmail } = useContext(UserContext); 

  const handleSignOut = () => {
    setUserEmail('');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hello, {userEmail ? userEmail : 'Guest'}!</Text>

      <View style={styles.menu}>
        {userEmail ? (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AddAddress')}>
              <AntDesign name="profile" size={24} color="#555" />
              <Text style={styles.menuText}>Manage Addresses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AccountSettings')}>
              <AntDesign name="setting" size={24} color="#555" />
              <Text style={styles.menuText}>Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CustomerSupport')}>
              <AntDesign name="customerservice" size={24} color="#555" />
              <Text style={styles.menuText}>Customer Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Feedback & Complaints')}>
              <AntDesign name="message1" size={24} color="#555" />
              <Text style={styles.menuText}>Feedback & Complaints</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
  },
  signOutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 5,
  },
  signOutText: {
    fontSize: 18,
    color: '#fff',
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 5,
  },
  signInText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ProfileScreen;

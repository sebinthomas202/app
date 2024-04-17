import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const AccountSettingsScreen = ({ navigation }) => {
  const handleForgotPassword = () => {
    navigation.navigate('Forgot Password');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Account Settings</Text>
      
      
      <TouchableOpacity onPress={handleForgotPassword} style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, color: 'blue' }}>Forgot Password?</Text>
      </TouchableOpacity>
      
      
    </View>
  );
};

export default AccountSettingsScreen;

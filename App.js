import React, { useEffect, useState,useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { useIsFocused } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePageScreen from './screens/HomePage';
import CartScreen from './screens/Cart';
import OrderScreen from './screens/Orders';
import AccountScreen from './screens/Profile';
import ForgotPass from './screens/ForgotPass';
import HomeScreen from './screens/Home';
import Search from './screens/Search';
import ForgotPassVerify from './screens/ForgotPassVerify';
import PasswordChange from './screens/PasswordChange';
import ConfirmationScreen from './screens/ConfirmationScreen';
import LoginScreen from './screens/Login';
import AddAddressScreen from './screens/AddAddressScreen';
import RegisterScreen from './screens/Register';
import OrderDetailsPage from './screens/Orderdetails';
import AccountSettingsScreen from './screens/AccountSettingsScreen'
import CustomerSupportScreen from './screens/CustomerSupportScreen';
import FeedbackAndComplaintsScreen from './screens/FeedbackAndComplaintsScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserProvider } from './screens/UserContext';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const isFocused = useIsFocused();
  const [refreshCount, setRefreshCount] = useState(0);

  // Increment refreshCount each time the screen comes into focus
  useEffect(() => {
    if (isFocused) {
      setRefreshCount(prevCount => prevCount + 1);
    }
  }, [isFocused]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#3c8dbc"
      }}>
      <Tab.Screen name="Home" component={HomePageScreen} options={{
        tabBarIcon: () => <Ionicons name="home-outline" size={24} />,
      }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{
        tabBarIcon: () => <Ionicons name="cart-outline" size={24} />
      }} />
      <Tab.Screen name="Orders" component={OrderDetailsPage} options={{
        tabBarIcon: () => <Ionicons name="cube-outline" size={24} />
      }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{
        tabBarIcon: () => <Ionicons name="person-outline" size={24} />
      }} />
    </Tab.Navigator>);
};

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='HomePage'>
        <Stack.Screen name="Signup" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="HomePage" component={TabNavigator} options={{ headerShown: false }}  />
          <Stack.Screen name="Forgot Password" component={ForgotPass} />
          <Stack.Screen name="OTP Verification" component={ForgotPassVerify} />
          <Stack.Screen name="AddAddress" component={AddAddressScreen} />
          <Stack.Screen name="Password Change" component={PasswordChange} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
          <Stack.Screen name="Product" component={OrderScreen} />
          <Stack.Screen name="HomeTitle" component={HomeScreen} />
          <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="Feedback & Complaints" component={FeedbackAndComplaintsScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}


import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <Image ssource={{ uri: 'https://play-lh.googleusercontent.com/65ZtK0ArYYUDEEnI7M-TPJHFix1MxOwb5fpC--k9eQPT56pz-0ghEJV4NbfNnIa0keBS' }}
 style={styles.logo} />
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    
    paddingHorizontal: 25,
  },
  logo: {
    width: 100,
    height: 50,
  },
});

export default CustomHeader;

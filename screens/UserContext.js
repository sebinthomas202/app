// UserContext.js
import React, { createContext, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import ipAddress from './config';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null); 

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail, ipAddress }}>
      {children}
    </UserContext.Provider>
  );
};


// export default UserContext;

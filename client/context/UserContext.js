import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ 
    phoneNumber: null,
    name: null,
    businessName: null,
    category: null,
    description: null,
    location: null,
    profilePicUri: null
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

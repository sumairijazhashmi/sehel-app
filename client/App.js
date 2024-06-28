import React from 'react';
import AppNavigator from './components/AppNavigation';
import { UserProvider } from './context/UserContext';


export default function App() {

  return (
    <UserProvider>
      <AppNavigator/>
    </UserProvider>
  );
}

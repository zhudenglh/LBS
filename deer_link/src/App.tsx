// Root App Component with Error Boundary

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './contexts/UserContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import MainNavigator from './navigation/MainNavigator';
import './i18n';
// NativeWind CSS is imported in index.js

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

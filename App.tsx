import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Game2048 } from './components/Game2048';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Game2048: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Главная' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ title: 'Профиль' }}
          />
          <Stack.Screen 
            name="Game2048" 
            component={Game2048}
            options={{
              title: '2048',
              headerStyle: {
                backgroundColor: '#faf8ef',
              },
              headerTintColor: '#776e65',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, SafeAreaView } from 'react-native';
import { Link, Stack } from 'expo-router';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function GameMenu() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Игры',
          headerShown: true,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Игры</Text>
        
        <View style={styles.buttonContainer}>
          <Link href="/games/2048" asChild>
            <TouchableOpacity style={styles.button}>
              <View style={styles.iconContainer}>
                <FontAwesome name="th-large" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>2048</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/games/snake" asChild>
            <TouchableOpacity style={styles.button}>
              <View style={styles.iconContainer}>
                <Ionicons name="game-controller" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>Змейка</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/games/guess-number" asChild>
            <TouchableOpacity style={styles.button}>
              <View style={styles.iconContainer}>
                <FontAwesome name="question-circle" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>Угадай число</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/games/memory" asChild>
            <TouchableOpacity style={styles.button}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="cards" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>Карточки памяти</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/games/tictactoe" asChild>
            <TouchableOpacity style={styles.button}>
              <View style={styles.iconContainer}>
                <FontAwesome name="times" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>Крестики-нолики</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 
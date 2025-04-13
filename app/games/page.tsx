import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/context/theme';

const GamesPage = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Игры</ThemedText>
      
      <ThemedText style={styles.welcomeText}>Удачной игры!</ThemedText>

      <Link href="/games/tictactoe" asChild>
        <TouchableOpacity style={[styles.gameButton, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.buttonText}>Крестики-нолики</ThemedText>
        </TouchableOpacity>
      </Link>

      <Link href="/games/snake" asChild>
        <TouchableOpacity style={[styles.gameButton, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.buttonText}>Змейка</ThemedText>
        </TouchableOpacity>
      </Link>

      <Link href="/games/2048" asChild>
        <TouchableOpacity style={[styles.gameButton, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.buttonText}>2048</ThemedText>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  gameButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GamesPage; 
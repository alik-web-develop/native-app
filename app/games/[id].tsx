import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TicTacToe } from '@/components/TicTacToe';
import { Snake } from '@/components/Snake';
import { Game2048 } from '@/components/Game2048';
import { useTheme } from '@/context/theme';
import { ThemedText } from '@/components/ThemedText';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const renderGame = () => {
    switch (id) {
      case 'tictactoe':
        return <TicTacToe />;
      case 'snake':
        return <Snake />;
      case '2048':
        return <Game2048 />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText style={styles.welcomeText}>Приятной игры!</ThemedText>
      {renderGame()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginVertical: 20,
    textAlign: 'center',
  },
}); 
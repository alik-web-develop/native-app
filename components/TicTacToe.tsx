import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/theme';

export const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const { colors } = useTheme();

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтальные
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикальные
      [0, 4, 8], [2, 4, 6] // диагональные
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handlePress = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  const status = winner 
    ? `Победитель: ${winner}` 
    : board.every(square => square) 
    ? 'Ничья!' 
    : `Следующий ход: ${xIsNext ? 'X' : 'O'}`;

  return (
    <View style={styles.container}>
      <Text style={[styles.status, { color: colors.text }]}>{status}</Text>
      <View style={styles.board}>
        {board.map((square, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.square, { borderColor: colors.border }]}
            onPress={() => handlePress(index)}
          >
            <Text style={[styles.squareText, { color: colors.text }]}>
              {square}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.primary }]}
        onPress={resetGame}
      >
        <Text style={styles.resetButtonText}>Начать заново</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  status: {
    fontSize: 24,
    marginBottom: 20,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 300,
  },
  square: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    fontSize: 40,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
  },
}); 
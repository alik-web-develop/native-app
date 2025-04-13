import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export function GuessNumber() {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setMessage('Угадайте число от 1 до 100');
    setGameOver(false);
  };

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      Alert.alert('Ошибка', 'Пожалуйста, введите число от 1 до 100');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum === targetNumber) {
      setMessage(`Поздравляем! Вы угадали число за ${newAttempts} попыток!`);
      setGameOver(true);
    } else if (guessNum < targetNumber) {
      setMessage('Больше ⬆️');
    } else {
      setMessage('Меньше ⬇️');
    }
    setGuess('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Угадай число</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.attempts}>Попыток: {attempts}</Text>
      
      {!gameOver && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={guess}
            onChangeText={setGuess}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="Введите число"
          />
          <TouchableOpacity style={styles.button} onPress={handleGuess}>
            <Text style={styles.buttonText}>Проверить</Text>
          </TouchableOpacity>
        </View>
      )}

      {gameOver && (
        <TouchableOpacity style={styles.button} onPress={startNewGame}>
          <Text style={styles.buttonText}>Играть снова</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 20,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  attempts: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 
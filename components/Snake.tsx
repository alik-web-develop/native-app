import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/context/theme';

const GRID_SIZE = 15;
const CELL_SIZE = Math.floor(Dimensions.get('window').width * 0.8 / GRID_SIZE);

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function Snake() {
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const { colors } = useTheme();

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    generateFood();
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(currentSnake => {
      const head = currentSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP':
          newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          newHead.y = (newHead.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          newHead.x = (newHead.x + 1) % GRID_SIZE;
          break;
      }

      // Check if snake hits itself
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check if snake eats food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 200);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const getSnakeColor = () => {
    // Если тема темная
    if (colors.background === '#000000' || colors.background === '#121212') {
      return {
        head: '#00ff00', // Ярко-зеленая голова
        body: '#008000', // Темно-зеленое тело
      };
    }
    // Для светлой темы оставляем стандартные цвета
    return {
      head: colors.primary,
      body: colors.secondary || colors.primary,
    };
  };

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0].x === x && snake[0].y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    const snakeColors = getSnakeColor();

    const getHeadRotation = () => {
      switch (direction) {
        case 'UP': return '0deg';
        case 'RIGHT': return '90deg';
        case 'DOWN': return '180deg';
        case 'LEFT': return '270deg';
        default: return '0deg';
      }
    };

    if (isSnakeHead) {
      return (
        <View
          key={`${x}-${y}`}
          style={[
            styles.cell,
            styles.snakeHeadCell,
            {
              backgroundColor: colors.border,
              borderColor: colors.border,
            }
          ]}
        >
          <View style={[
            styles.snakeHead,
            {
              backgroundColor: 'transparent',
              borderBottomColor: colors.secondary || '#4CAF50',
              transform: [{ rotate: getHeadRotation() }],
            }
          ]} />
        </View>
      );
    }

    return (
      <View
        key={`${x}-${y}`}
        style={[
          styles.cell,
          {
            backgroundColor: isSnakeHead
              ? snakeColors.head
              : isSnakeBody
              ? snakeColors.body
              : isFood
              ? colors.error
              : colors.border,
            borderRadius: isSnakeHead ? CELL_SIZE / 2 : 0,
            transform: isSnakeHead ? [{ scale: 0.9 }] : [],
          },
        ]}
      />
    );
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const row = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push(renderCell(x, y));
      }
      grid.push(
        <View key={y} style={styles.row}>
          {row}
        </View>
      );
    }
    return grid;
  };

  const renderControls = () => (
    <View style={styles.controls}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => setDirection('UP')}
      >
        <ThemedText style={styles.buttonText}>↑</ThemedText>
      </TouchableOpacity>
      <View style={styles.horizontalControls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setDirection('LEFT')}
        >
          <ThemedText style={styles.buttonText}>←</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setDirection('RIGHT')}
        >
          <ThemedText style={styles.buttonText}>→</ThemedText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => setDirection('DOWN')}
      >
        <ThemedText style={styles.buttonText}>↓</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.score}>Счёт: {score}</ThemedText>
        <TouchableOpacity
          style={[styles.pauseButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsPaused(!isPaused)}
        >
          <ThemedText style={styles.buttonText}>
            {isPaused ? '▶️' : '⏸️'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={[styles.grid, { borderColor: colors.border }]}>
        {renderGrid()}
      </View>

      {renderControls()}

      {isGameOver && (
        <View style={styles.gameOver}>
          <ThemedText style={styles.gameOverText}>Игра окончена!</ThemedText>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: colors.primary }]}
            onPress={resetGame}
          >
            <ThemedText style={styles.buttonText}>Начать заново</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
  },
  grid: {
    borderWidth: 1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  controls: {
    alignItems: 'center',
    marginTop: 20,
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  pauseButton: {
    padding: 10,
    borderRadius: 8,
  },
  gameOver: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  gameOverText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
  },
  resetButton: {
    padding: 15,
    borderRadius: 8,
  },
  snakeHeadCell: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  snakeHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: CELL_SIZE * 0.5,
    borderRightWidth: CELL_SIZE * 0.5,
    borderBottomWidth: CELL_SIZE * 0.8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'inherit',
  },
}); 
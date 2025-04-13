import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { 
  PanGestureHandler, 
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const GRID_SIZE = 4;
const CELL_SIZE = Math.floor(Dimensions.get('window').width * 0.8 / GRID_SIZE);
const CELL_MARGIN = 5;
const SWIPE_THRESHOLD = 50;

interface Tile {
  value: number;
  id: string;
  merged?: boolean;
}

type Grid = (Tile | null)[][];

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const onGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (gameOver) return;

    const { translationX, translationY } = event.nativeEvent;
    const absX = Math.abs(translationX);
    const absY = Math.abs(translationY);

    if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;

    let direction: 'up' | 'down' | 'left' | 'right';
    if (absX > absY) {
      direction = translationX > 0 ? 'right' : 'left';
    } else {
      direction = translationY > 0 ? 'down' : 'up';
    }

    const newGrid = moveTiles(direction);
    if (newGrid) {
      addRandomTile(newGrid);
      setGrid([...newGrid]);

      if (!canMove(newGrid)) {
        setGameOver(true);
        if (score > bestScore) {
          setBestScore(score);
        }
        Alert.alert(
          'Игра окончена!',
          `Ваш счет: ${score}\nЛучший счет: ${bestScore}`,
          [{ text: 'Играть снова', onPress: startNewGame }]
        );
      }
    }
  }, [gameOver, grid, score, bestScore]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newGrid = createEmptyGrid();
    addRandomTile(addRandomTile(newGrid));
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  function createEmptyGrid(): Grid {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  }

  function addRandomTile(grid: Grid): Grid {
    const availableCells: [number, number][] = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell) {
          availableCells.push([i, j]);
        }
      });
    });

    if (availableCells.length > 0) {
      const [i, j] = availableCells[Math.floor(Math.random() * availableCells.length)];
      grid[i][j] = {
        value: Math.random() < 0.9 ? 2 : 4,
        id: `${i}-${j}-${Date.now()}`,
      };
    }
    return grid;
  }

  function moveTiles(direction: 'up' | 'down' | 'left' | 'right'): Grid | null {
    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const moveCell = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
      if (!newGrid[fromRow][fromCol]) return false;
      
      if (!newGrid[toRow][toCol]) {
        newGrid[toRow][toCol] = newGrid[fromRow][fromCol];
        newGrid[fromRow][fromCol] = null;
        return true;
      }
      
      if (newGrid[toRow][toCol]?.value === newGrid[fromRow][fromCol]?.value && !newGrid[toRow][toCol]?.merged) {
        const newValue = newGrid[fromRow][fromCol]!.value * 2;
        newGrid[toRow][toCol] = {
          value: newValue,
          id: `${toRow}-${toCol}-${Date.now()}`,
          merged: true,
        };
        newGrid[fromRow][fromCol] = null;
        newScore += newValue;
        return true;
      }
      
      return false;
    };

    // Очищаем флаги merged
    newGrid.forEach(row => {
      row.forEach(cell => {
        if (cell) cell.merged = false;
      });
    });

    switch (direction) {
      case 'left':
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 1; col < GRID_SIZE; col++) {
            if (newGrid[row][col]) {
              let newCol = col;
              while (newCol > 0 && moveCell(row, newCol, row, newCol - 1)) {
                newCol--;
                moved = true;
              }
            }
          }
        }
        break;

      case 'right':
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = GRID_SIZE - 2; col >= 0; col--) {
            if (newGrid[row][col]) {
              let newCol = col;
              while (newCol < GRID_SIZE - 1 && moveCell(row, newCol, row, newCol + 1)) {
                newCol++;
                moved = true;
              }
            }
          }
        }
        break;

      case 'up':
        for (let col = 0; col < GRID_SIZE; col++) {
          for (let row = 1; row < GRID_SIZE; row++) {
            if (newGrid[row][col]) {
              let newRow = row;
              while (newRow > 0 && moveCell(newRow, col, newRow - 1, col)) {
                newRow--;
                moved = true;
              }
            }
          }
        }
        break;

      case 'down':
        for (let col = 0; col < GRID_SIZE; col++) {
          for (let row = GRID_SIZE - 2; row >= 0; row--) {
            if (newGrid[row][col]) {
              let newRow = row;
              while (newRow < GRID_SIZE - 1 && moveCell(newRow, col, newRow + 1, col)) {
                newRow++;
                moved = true;
              }
            }
          }
        }
        break;
    }

    if (moved) {
      setScore(newScore);
      return newGrid;
    }
    return null;
  }

  function canMove(grid: Grid): boolean {
    // Проверяем наличие пустых ячеек
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!grid[i][j]) return true;
      }
    }

    // Проверяем возможность объединения
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = grid[i][j]?.value;
        if (
          (i < GRID_SIZE - 1 && grid[i + 1][j]?.value === current) ||
          (j < GRID_SIZE - 1 && grid[i][j + 1]?.value === current)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  const getCellColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value] || '#cdc1b4';
  };

  const getCellTextColor = (value: number): string => {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>2048</Text>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>СЧЕТ</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>РЕКОРД</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        </View>
      </View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        minDist={10}
      >
        <View style={styles.grid}>
          {grid.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((tile, j) => (
                <View
                  key={`${i}-${j}`}
                  style={[
                    styles.cell,
                    tile && {
                      backgroundColor: getCellColor(tile.value),
                    },
                  ]}
                >
                  {tile && (
                    <Text
                      style={[
                        styles.cellText,
                        {
                          color: getCellTextColor(tile.value),
                          fontSize: tile.value > 100 ? 24 : 32,
                        },
                      ]}
                    >
                      {tile.value}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </PanGestureHandler>

      <TouchableOpacity style={styles.button} onPress={startNewGame}>
        <Text style={styles.buttonText}>Новая игра</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#776e65',
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  scoreBox: {
    backgroundColor: '#bbada0',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#eee4da',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  grid: {
    backgroundColor: '#bbada0',
    padding: CELL_MARGIN,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#cdc1b4',
    margin: CELL_MARGIN,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#f9f6f2',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
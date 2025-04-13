import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = Math.floor(Dimensions.get('window').width * 0.9 / BOARD_WIDTH);

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
};

type Position = {
  x: number;
  y: number;
};

export function Tetris() {
  const [board, setBoard] = useState<number[][]>(
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<number[][]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    spawnNewPiece();
  };

  const gesture = Gesture.Pan()
    .minDistance(5)
    .onUpdate((event) => {
      if (!gameStarted || gameOver) return;
      
      if (event.translationX > CELL_SIZE) {
        moveRight();
      } else if (event.translationX < -CELL_SIZE) {
        moveLeft();
      } else if (event.translationY > CELL_SIZE) {
        moveDown();
      }
    });

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(moveDown, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, currentPiece]);

  const spawnNewPiece = () => {
    const shapes = Object.values(SHAPES);
    const newPiece = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentPiece(newPiece);
    const newX = Math.floor((BOARD_WIDTH - newPiece[0].length) / 2);
    setCurrentPosition({ x: newX, y: 0 });

    // Проверяем, можно ли поставить новую фигуру
    if (!canMove(newX, 0, newPiece)) {
      setGameOver(true);
    }
  };

  const moveLeft = () => {
    if (canMove(currentPosition.x - 1, currentPosition.y, currentPiece)) {
      setCurrentPosition({ ...currentPosition, x: currentPosition.x - 1 });
    }
  };

  const moveRight = () => {
    if (canMove(currentPosition.x + 1, currentPosition.y, currentPiece)) {
      setCurrentPosition({ ...currentPosition, x: currentPosition.x + 1 });
    }
  };

  const moveDown = () => {
    if (canMove(currentPosition.x, currentPosition.y + 1, currentPiece)) {
      setCurrentPosition({ ...currentPosition, y: currentPosition.y + 1 });
    } else {
      placePiece();
    }
  };

  const canMove = (newX: number, newY: number, piece: number[][]): boolean => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && board[boardY][boardX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = () => {
    const newBoard = [...board];
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          const boardY = currentPosition.y + y;
          if (boardY < 0) {
            setGameOver(true);
            return;
          }
          newBoard[boardY][currentPosition.x + x] = 1;
        }
      }
    }
    setBoard(newBoard);
    checkLines();
    spawnNewPiece();
  };

  const checkLines = () => {
    let newBoard = [...board];
    let linesCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell === 1)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
      }
    }

    if (linesCleared > 0) {
      setScore(score + linesCleared * 100);
      setBoard(newBoard);
    }
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Добавляем текущую фигуру на доску для отображения
    if (currentPiece) {
      for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
          if (currentPiece[y][x]) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 2; // 2 означает активную фигуру
            }
          }
        }
      }
    }

    return displayBoard.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, cellIndex) => (
          <View
            key={`${rowIndex}-${cellIndex}`}
            style={[
              styles.cell,
              cell === 1 && styles.filledCell,
              cell === 2 && styles.currentPiece,
            ]}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <GestureDetector gesture={gesture}>
        <View style={styles.board}>
          {renderBoard()}
        </View>
      </GestureDetector>
      {(!gameStarted || gameOver) && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>
            {gameOver ? 'Game Over!' : 'Tetris'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#fff',
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
  filledCell: {
    backgroundColor: '#333',
  },
  currentPiece: {
    backgroundColor: '#007AFF',
  },
  gameOver: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 
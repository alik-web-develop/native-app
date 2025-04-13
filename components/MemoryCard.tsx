import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const GRID_SIZE = 4;
const CARD_MARGIN = 5;
const WINDOW_WIDTH = Dimensions.get('window').width;
const CARD_SIZE = (WINDOW_WIDTH - 40) / GRID_SIZE - CARD_MARGIN * 2;

const CARD_SYMBOLS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯'];

type Card = {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export function MemoryCard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledSymbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledSymbols);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardPress = (cardId: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      cards[cardId].isMatched
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      
      if (cards[firstCardId].symbol === cards[secondCardId].symbol) {
        setCards(cards.map(card =>
          card.id === firstCardId || card.id === secondCardId
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
        
        // Check if game is complete
        const allMatched = cards.every(card => 
          card.isMatched || card.id === firstCardId || card.id === secondCardId
        );
        if (allMatched) {
          setGameComplete(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const AnimatedCard = ({ card }: { card: Card }) => {
    const rotation = useSharedValue(0);

    const frontStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotateY: `${rotation.value}deg` }],
        backfaceVisibility: 'hidden',
      };
    });

    const backStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotateY: `${rotation.value + 180}deg` }],
        backfaceVisibility: 'hidden',
        position: 'absolute',
      };
    });

    useEffect(() => {
      rotation.value = withTiming(
        card.isMatched || flippedCards.includes(card.id) ? 180 : 0,
        { duration: 300 }
      );
    }, [card.isMatched, flippedCards]);

    return (
      <TouchableOpacity
        onPress={() => handleCardPress(card.id)}
        style={styles.cardContainer}
      >
        <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
          <Text style={styles.cardText}>?</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
          <Text style={styles.symbolText}>{card.symbol}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moves}>Moves: {moves}</Text>
      <View style={styles.grid}>
        {cards.map(card => (
          <AnimatedCard key={card.id} card={card} />
        ))}
      </View>
      {gameComplete && (
        <View style={styles.gameComplete}>
          <Text style={styles.gameCompleteText}>
            Поздравляем! Вы выиграли за {moves} ходов!
          </Text>
          <TouchableOpacity style={styles.button} onPress={initializeGame}>
            <Text style={styles.buttonText}>Играть снова</Text>
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
    padding: 10,
  },
  moves: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: WINDOW_WIDTH - 20,
  },
  cardContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: CARD_MARGIN,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFront: {
    backgroundColor: '#007AFF',
  },
  cardBack: {
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  symbolText: {
    fontSize: 32,
  },
  gameComplete: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gameCompleteText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
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
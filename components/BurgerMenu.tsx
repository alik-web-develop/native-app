import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, StatusBar, Share, Vibration, Alert, View, Text, Modal } from 'react-native';
import { useTheme } from '@/context/theme';
import { ThemedText } from './ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import Icon from '@expo/vector-icons/FontAwesome';

const MENU_WIDTH = Dimensions.get('window').width * 0.8;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
const TOP_OFFSET = STATUSBAR_HEIGHT + 20;

interface Game {
  id: string;
  title: string;
  icon: keyof typeof FontAwesome.glyphMap;
}

const GAMES: Game[] = [
  { id: 'tictactoe', title: 'Крестики-нолики', icon: 'times' },
  { id: 'snake', title: 'Змейка', icon: 'gamepad' },
  { id: '2048', title: '2048', icon: 'th' },
  { id: 'guess-number', title: 'Угадай число', icon: 'question-circle' },
  { id: 'memory', title: 'Карточки памяти', icon: 'clone' },
];

type IconName = keyof typeof FontAwesome.glyphMap;
type GameRoute = '/games/2048' | '/games/snake' | '/games/tictactoe' | '/games/memory' | '/games/guess-number';

export function BurgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamesMenuOpen, setIsGamesMenuOpen] = useState(false);
  const { colors, toggleTheme, theme } = useTheme();
  const translateX = useState(new Animated.Value(-MENU_WIDTH))[0];
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsGamesMenuOpen(false);
    }
  };

  const toggleGamesMenu = () => {
    setIsGamesMenuOpen(!isGamesMenuOpen);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Попробуй крутые игры! 🎮',
        title: 'Игры',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться');
    }
  };

  const toggleVibration = () => {
    setIsVibrationEnabled(!isVibrationEnabled);
    if (isVibrationEnabled) {
      Vibration.cancel();
    } else {
      Vibration.vibrate(100);
    }
  };

  const showGameRules = () => {
    Alert.alert(
      'Правила игр',
      '1. Крестики-нолики:\nИгра для двух игроков. Цель - поставить три своих символа в ряд.\n\n2. Змейка:\nУправляйте змейкой, собирайте еду и не врезайтесь в себя!',
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'О приложении',
      'Мини-игры v1.0.0\n\n' +
      'Разработчики:\n' +
      '- Алик - Ведущий разработчик\n' +
      '- Команда Cursor - Поддержка и тестирование\n\n' +
      'Время разработки: 2 месяца\n\n' +
      'Рейтинг в App Store: ★★★★★\n' +
      'Загрузок: 10,000+\n\n' +
      'Описание:\n' +
      'Коллекция увлекательных мини-игр для всей семьи! ' +
      'Включает в себя классические игры вроде "Змейки" и современные хиты как "2048". ' +
      'Идеально подходит для коротких перерывов и тренировки мозга.',
      [{ text: 'Круто!', style: 'default' }]
    );
  };

  const showSettings = () => {
    Alert.alert(
      'Настройки',
      'Выберите настройку для изменения:',
      [
        {
          text: isVibrationEnabled ? 'Выключить вибрацию' : 'Включить вибрацию',
          onPress: toggleVibration
        },
        {
          text: theme === 'dark' ? 'Светлая тема' : 'Темная тема',
          onPress: toggleTheme
        },
        { text: 'Закрыть', style: 'cancel' }
      ]
    );
  };

  const showProfile = () => {
    Alert.alert(
      'Профиль игрока',
      'Статистика:\n\n' +
      '🎮 Всего игр: 42\n' +
      '🏆 Победы: 28\n' +
      '⭐ Рекорды:\n' +
      '- 2048: 16384 очков\n' +
      '- Змейка: 89 яблок\n' +
      '- Тетрис: 12 линий\n' +
      '- Карточки памяти: 8 ходов',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const navigateToGame = (route: GameRoute) => {
    router.push(route);
    setIsMenuOpen(false);
  };

  const MenuItem = ({ title, icon, onPress }: { title: string; icon: IconName; onPress?: () => void }) => (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? '#444' : '#eee' }]} onPress={onPress}>
      <FontAwesome name={icon} size={24} color={theme === 'dark' ? '#fff' : '#333'} />
      <Text style={[styles.menuItemText, { color: theme === 'dark' ? '#fff' : '#333' }]}>{title}</Text>
      {title === 'Игры' && (
        <FontAwesome 
          name={isGamesMenuOpen ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color={theme === 'dark' ? '#fff' : '#333'} 
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );

  const GameItem = ({ title, route }: { title: string; route: GameRoute }) => (
    <TouchableOpacity 
      style={styles.gameItem} 
      onPress={() => navigateToGame(route)}
    >
      <FontAwesome name="gamepad" size={20} color="#666" />
      <Text style={styles.gameItemText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <FontAwesome name="bars" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
      </TouchableOpacity>

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <View style={[styles.menuContent, { 
            backgroundColor: theme === 'dark' ? '#222' : '#fff',
          }]}>
            <MenuItem title="Профиль" icon="user" onPress={() => {
              showProfile();
              toggleMenu();
            }} />
            <MenuItem title="Игры" icon="gamepad" onPress={toggleGamesMenu} />
            
            {isGamesMenuOpen && (
              <View style={[styles.gamesSubmenu, { borderLeftColor: theme === 'dark' ? '#444' : '#eee' }]}>
                {GAMES.map(game => (
                  <TouchableOpacity
                    key={game.id}
                    style={styles.gameItem}
                    onPress={() => {
                      router.push(`/games/${game.id}`);
                      toggleMenu();
                    }}
                  >
                    <FontAwesome name={game.icon} size={20} color={theme === 'dark' ? '#fff' : '#666'} />
                    <Text style={[styles.gameItemText, { color: theme === 'dark' ? '#fff' : '#666' }]}>
                      {game.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <MenuItem title="Настройки" icon="cog" onPress={() => {
              showSettings();
              toggleMenu();
            }} />
            <MenuItem title="О приложении" icon="info-circle" onPress={() => {
              showAbout();
              toggleMenu();
            }} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1000,
  },
  menuButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width * 0.75,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
  },
  chevron: {
    marginLeft: 'auto',
  },
  gamesSubmenu: {
    marginLeft: 20,
    borderLeftWidth: 1,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 15,
  },
  gameItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
}); 
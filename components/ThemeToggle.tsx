import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '@/context/theme';
import { FontAwesome } from '@expo/vector-icons';

export function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        padding: 8,
      })}>
      <FontAwesome
        name={theme === 'dark' ? 'sun-o' : 'moon-o'}
        size={24}
        color={colors.text}
      />
    </Pressable>
  );
} 
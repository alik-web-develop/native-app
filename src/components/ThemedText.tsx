import React from 'react';
import { Text, TextStyle } from 'react-native';

type ThemedTextProps = {
  children: React.ReactNode;
  type?: 'title' | 'link';
  style?: TextStyle;
};

export const ThemedText: React.FC<ThemedTextProps> = ({ children, type, style }) => {
  const textStyle: TextStyle = {
    ...(type === 'title' && { fontSize: 20, fontWeight: 'bold' }),
    ...(type === 'link' && { color: '#007AFF' }),
    ...style,
  };

 
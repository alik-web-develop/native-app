import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BurgerMenu } from '@/components/BurgerMenu';
import { useTheme } from '@/context/theme';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <BurgerMenu />
      
      <ThemedView style={[styles.content, { backgroundColor: colors.background }]}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
          Приятной игры!
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
  },
});

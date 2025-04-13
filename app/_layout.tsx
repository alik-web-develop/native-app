import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/context/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { theme, colors } = useTheme();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#333',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerTintColor: colors.text,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }} 
        />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

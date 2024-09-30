import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        {/* Stack Navigator para manejar el enrutamiento */}
        {/* <Stack initialRouteName='mainTab'> */}
        <Stack>
          {/* La pantalla de login es la primera pantalla */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="mainTab" options={{ headerShown: false }} />
          <Stack.Screen name="tournament/index" options={{ headerShown: false }} />
          <Stack.Screen name="competitor/index" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </PaperProvider>
    </ThemeProvider>
  );
}

import React from 'react';

import 'react-native-gesture-handler';

import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import AppLoading from 'expo-app-loading'
import { ThemeProvider} from 'styled-components/native'
import theme from './src/theme';
import { SignIn } from '@screens/SignIn';
import { StatusBar } from 'react-native';
import { AuthProvider } from '@hooks/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Product } from '@screens/Product';

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular
  })

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <AuthProvider>
          <Product />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}



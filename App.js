// Ponto de entrada do aplicativo
// Aqui configuramos o React Navigation com a stack de telas
// e definimos o estilo global do header

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import FormScreen from "./src/screens/FormScreen";
import { colors, typography } from "./src/theme";

const Stack = createNativeStackNavigator();

// Estilos padrão compartilhados pelo header de todas as telas
const screenOptions = {
  headerStyle: {
    backgroundColor: colors.bg,
  },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: {
    fontWeight: typography.bold,
    fontSize: typography.md,
  },
  // Remove a sombra do header pra ficar mais clean no dark theme
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.bg,
  },
  // Animação padrão do iOS — fica bem em ambas as plataformas
  animation: "slide_from_right",
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            // Título em duas linhas com o emoji pra dar personalidade
            title: "🎬 MovieVault",
            headerLargeTitle: true, // iOS 11+ large title
          }}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={({ route }) => ({
            // Título muda dinamicamente dependendo do modo
            title: route.params?.movie ? "Editar Filme" : "Novo Filme",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

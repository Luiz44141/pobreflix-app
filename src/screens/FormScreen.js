// Esta tela é responsável tanto pelo cadastro quanto pela edição
// Ela recebe "movie" via route.params quando está no modo edição
// Quando não recebe nada, o formulário começa em branco (modo criação)

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { createMovie, updateMovie } from "../services/api";
import MovieForm from "../components/MovieForm";
import { colors } from "../theme";

export default function FormScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);

  // Se veio um filme via parâmetros, estamos editando; senão, criando
  const movie = route.params?.movie || null;
  const isEditing = !!movie;

  async function handleSubmit(formData) {
    setLoading(true);

    try {
      if (isEditing) {
        await updateMovie(movie.id, formData);
        Alert.alert("Sucesso!", `"${formData.title}" foi atualizado.`, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await createMovie(formData);
        Alert.alert("Sucesso!", `"${formData.title}" foi adicionado à coleção.`, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      // Mostra o erro vindo da API ou da rede para o usuário
      Alert.alert(
        "Erro",
        err.message || "Não foi possível salvar o filme. Verifique sua conexão.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <MovieForm
        movie={movie}
        onSubmit={handleSubmit}
        onCancel={() => navigation.goBack()}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});

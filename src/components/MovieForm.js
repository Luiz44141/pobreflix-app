// Este formulário serve para dois casos: cadastrar e editar
// Quando recebe o prop "movie", pré-preenche os campos (modo edição)
// Quando não recebe, começa em branco (modo criação)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../theme";

// Lista de gêneros mais comuns — facilita pra não precisar digitar
const GENRES = [
  "Ação", "Aventura", "Animação", "Comédia", "Crime",
  "Drama", "Ficção Científica", "Horror", "Romance",
  "Suspense", "Terror", "Documentário", "Fantasia",
];

export default function MovieForm({ movie, onSubmit, onCancel, loading }) {
  // Estado do formulário — se vier um filme (edição), usa os valores dele
  const [form, setForm] = useState({
    title: "",
    director: "",
    genre: "",
    year: String(new Date().getFullYear()),
    rating: "",
    watched: false,
    synopsis: "",
  });

  const [errors, setErrors] = useState({});
  const [showGenrePicker, setShowGenrePicker] = useState(false);

  // Preenche os campos quando estamos editando um filme existente
  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title || "",
        director: movie.director || "",
        genre: movie.genre || "",
        year: String(movie.year || ""),
        rating: movie.rating !== null && movie.rating !== undefined ? String(movie.rating) : "",
        watched: !!movie.watched,
        synopsis: movie.synopsis || "",
      });
    }
  }, [movie]);

  // Atualiza um campo específico e limpa o erro correspondente
  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  // Validação local antes de enviar pro servidor
  function validate() {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Informe o título do filme.";
    if (!form.director.trim()) newErrors.director = "Informe o nome do diretor.";
    if (!form.genre.trim()) newErrors.genre = "Selecione ou informe o gênero.";

    const yearNum = parseInt(form.year, 10);
    if (!form.year || isNaN(yearNum) || yearNum < 1888 || yearNum > new Date().getFullYear() + 5) {
      newErrors.year = "Informe um ano válido (de 1888 em diante).";
    }

    if (form.rating !== "") {
      const r = parseFloat(form.rating);
      if (isNaN(r) || r < 0 || r > 10) {
        newErrors.rating = "A nota deve ser um número entre 0 e 10.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    onSubmit({
      title: form.title.trim(),
      director: form.director.trim(),
      genre: form.genre.trim(),
      year: parseInt(form.year, 10),
      rating: form.rating !== "" ? parseFloat(form.rating) : null,
      watched: form.watched,
      synopsis: form.synopsis.trim() || null,
    });
  }

  const isEditing = !!movie;

  return (
    // KeyboardAvoidingView garante que o teclado não esconda os campos
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formTitle}>
          {isEditing ? "Editar Filme" : "Novo Filme"}
        </Text>

        {/* Campo: Título */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={form.title}
            onChangeText={(v) => setField("title", v)}
            placeholder="Ex: Interestelar"
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
        </View>

        {/* Campo: Diretor */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Diretor *</Text>
          <TextInput
            style={[styles.input, errors.director && styles.inputError]}
            value={form.director}
            onChangeText={(v) => setField("director", v)}
            placeholder="Ex: Christopher Nolan"
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
          {errors.director ? <Text style={styles.errorText}>{errors.director}</Text> : null}
        </View>

        {/* Campo: Gênero — com atalhos rápidos */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Gênero *</Text>
          <TextInput
            style={[styles.input, errors.genre && styles.inputError]}
            value={form.genre}
            onChangeText={(v) => setField("genre", v)}
            placeholder="Ex: Ficção Científica"
            placeholderTextColor={colors.textMuted}
            onFocus={() => setShowGenrePicker(true)}
            onBlur={() => setTimeout(() => setShowGenrePicker(false), 200)}
          />
          {errors.genre ? <Text style={styles.errorText}>{errors.genre}</Text> : null}

          {/* Chips de gênero para seleção rápida */}
          {showGenrePicker && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.genreScroll}
              keyboardShouldPersistTaps="handled"
            >
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genreChip, form.genre === g && styles.genreChipActive]}
                  onPress={() => {
                    setField("genre", g);
                    setShowGenrePicker(false);
                  }}
                >
                  <Text style={[styles.genreChipText, form.genre === g && styles.genreChipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Linha com Ano e Nota lado a lado */}
        <View style={styles.row}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Ano *</Text>
            <TextInput
              style={[styles.input, errors.year && styles.inputError]}
              value={form.year}
              onChangeText={(v) => setField("year", v)}
              placeholder="2024"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
            />
            {errors.year ? <Text style={styles.errorText}>{errors.year}</Text> : null}
          </View>

          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Nota (0–10)</Text>
            <TextInput
              style={[styles.input, errors.rating && styles.inputError]}
              value={form.rating}
              onChangeText={(v) => setField("rating", v)}
              placeholder="Ex: 8.5"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              maxLength={4}
            />
            {errors.rating ? <Text style={styles.errorText}>{errors.rating}</Text> : null}
          </View>
        </View>

        {/* Toggle: Já assistiu? */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.label}>Já assisti</Text>
            <Text style={styles.switchHint}>Marque se você já viu este filme</Text>
          </View>
          <Switch
            value={form.watched}
            onValueChange={(v) => setField("watched", v)}
            trackColor={{ false: colors.border, true: colors.primary + "66" }}
            thumbColor={form.watched ? colors.primary : colors.textMuted}
          />
        </View>

        {/* Campo: Sinopse (opcional) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Sinopse <Text style={styles.optional}>(opcional)</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.synopsis}
            onChangeText={(v) => setField("synopsis", v)}
            placeholder="Uma breve descrição do filme..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botões de ação */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={loading}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.bg} />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? "save-outline" : "add-circle-outline"}
                  size={18}
                  color={colors.bg}
                />
                <Text style={styles.submitText}>
                  {isEditing ? "Salvar" : "Cadastrar"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  formTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optional: {
    fontWeight: typography.regular,
    textTransform: "none",
    fontSize: typography.xs,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.xs,
    color: colors.error,
    marginTop: 2,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchHint: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  genreScroll: {
    marginTop: spacing.xs,
  },
  genreChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  genreChipActive: {
    backgroundColor: colors.primary + "22",
    borderColor: colors.primary,
  },
  genreChipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  genreChipTextActive: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: colors.bg,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
});

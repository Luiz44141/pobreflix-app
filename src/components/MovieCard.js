// O MovieCard é o componente principal da listagem
// Ele exibe as informações mais importantes do filme de forma compacta
// e dá acesso às ações de editar e deletar

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadow } from "../theme";

// Exibe estrelas cheias/meias/vazias de acordo com a nota
function StarRating({ rating }) {
  if (rating === null || rating === undefined) {
    return (
      <Text style={styles.noRating}>Sem nota</Text>
    );
  }

  // Converte a nota de 0–10 para 0–5 estrelas
  const stars = rating / 2;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <View style={styles.starsRow}>
      {Array(full).fill(0).map((_, i) => (
        <Ionicons key={`f${i}`} name="star" size={12} color={colors.primary} />
      ))}
      {half === 1 && (
        <Ionicons name="star-half" size={12} color={colors.primary} />
      )}
      {Array(empty).fill(0).map((_, i) => (
        <Ionicons key={`e${i}`} name="star-outline" size={12} color={colors.primary} />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export default function MovieCard({ movie, onEdit, onDelete }) {
  // Confirma antes de deletar — UX importante pra evitar exclusões acidentais
  function handleDelete() {
    Alert.alert(
      "Remover filme",
      `Tem certeza que quer remover "${movie.title}" da sua coleção?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => onDelete(movie.id),
        },
      ]
    );
  }

  return (
    <View style={styles.card}>
      {/* Coluna lateral colorida indicando se já assistiu */}
      <View style={[styles.indicator, movie.watched && styles.indicatorWatched]} />

      <View style={styles.content}>
        {/* Cabeçalho: título + badges */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          {movie.watched && (
            <View style={styles.watchedBadge}>
              <Ionicons name="checkmark" size={10} color={colors.bg} />
              <Text style={styles.watchedText}>Assistido</Text>
            </View>
          )}
        </View>

        {/* Diretor e gênero */}
        <Text style={styles.director}>
          <Ionicons name="person-outline" size={12} color={colors.textSecondary} /> {movie.director}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.genreBadge}>
            <Text style={styles.genreText}>{movie.genre}</Text>
          </View>
          <Text style={styles.year}>{movie.year}</Text>
        </View>

        {/* Nota em estrelas */}
        <StarRating rating={movie.rating} />

        {/* Sinopse truncada, se existir */}
        {movie.synopsis ? (
          <Text style={styles.synopsis} numberOfLines={2}>
            {movie.synopsis}
          </Text>
        ) : null}
      </View>

      {/* Ações: editar e remover */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onEdit(movie)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="pencil-outline" size={18} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    overflow: "hidden",
    ...shadow,
  },
  // Barra lateral: cinza = não assistido, dourado = assistido
  indicator: {
    width: 4,
    backgroundColor: colors.border,
  },
  indicatorWatched: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  title: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  watchedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  watchedText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    color: colors.bg,
  },
  director: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  genreBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genreText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  year: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontWeight: typography.medium,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: typography.xs,
    color: colors.primary,
    fontWeight: typography.semibold,
    marginLeft: 4,
  },
  noRating: {
    fontSize: typography.xs,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  synopsis: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  actions: {
    justifyContent: "space-around",
    padding: spacing.sm,
    gap: spacing.sm,
  },
  actionBtn: {
    padding: spacing.xs,
  },
});

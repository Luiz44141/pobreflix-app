// Esta é a tela inicial do app — exibe a coleção completa de filmes
// Tem busca por título/diretor e filtros rápidos (todos / assistidos / fila)

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getMovies, deleteMovie } from "../services/api";
import MovieCard from "../components/MovieCard";
import { colors, spacing, radius, typography } from "../theme";

// Filtros disponíveis na listagem
const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "watched", label: "Assistidos" },
  { key: "unwatched", label: "Na fila" },
];

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState(null);

  // Carrega os filmes sempre que a tela ganha foco
  // Isso garante que a lista atualiza depois de criar/editar um filme
  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, [])
  );

  async function loadMovies(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteMovie(id);
      // Remove da lista local sem precisar recarregar tudo
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      // Aqui poderíamos mostrar um toast — por simplicidade usamos alert
      console.error("Erro ao deletar:", err.message);
    }
  }

  // Aplica filtro e busca em memória — sem nova chamada à API
  const filteredMovies = useMemo(() => {
    let result = movies;

    // Filtro de status
    if (activeFilter === "watched") result = result.filter((m) => m.watched);
    if (activeFilter === "unwatched") result = result.filter((m) => !m.watched);

    // Busca por título ou diretor (case-insensitive)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q)
      );
    }

    return result;
  }, [movies, activeFilter, search]);

  // Estatísticas rápidas para exibir no header
  const stats = useMemo(() => ({
    total: movies.length,
    watched: movies.filter((m) => m.watched).length,
    avgRating: movies.filter((m) => m.rating !== null).length > 0
      ? (movies.filter((m) => m.rating !== null).reduce((s, m) => s + m.rating, 0) /
         movies.filter((m) => m.rating !== null).length).toFixed(1)
      : null,
  }), [movies]);

  function renderHeader() {
    return (
      <View>
        {/* Cabeçalho com estatísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>filmes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.watched}</Text>
            <Text style={styles.statLabel}>assistidos</Text>
          </View>
          {stats.avgRating && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  ★ {stats.avgRating}
                </Text>
                <Text style={styles.statLabel}>média</Text>
              </View>
            </>
          )}
        </View>

        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por título ou diretor..."
            placeholderTextColor={colors.textMuted}
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Chips de filtro */}
        <View style={styles.filtersRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contador de resultados */}
        <Text style={styles.resultsCount}>
          {filteredMovies.length}{" "}
          {filteredMovies.length === 1 ? "filme" : "filmes"}
          {search ? ` para "${search}"` : ""}
        </Text>
      </View>
    );
  }

  function renderEmpty() {
    if (loading) return null;
    if (error) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="wifi-outline" size={48} color={colors.error} />
          <Text style={styles.emptyTitle}>Erro de conexão</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadMovies()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (movies.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>Sua coleção está vazia</Text>
          <Text style={styles.emptySubtitle}>
            Toque no botão + para adicionar seu primeiro filme
          </Text>
        </View>
      );
    }
    // Havia filmes mas a busca não retornou nada
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Nenhum resultado</Text>
        <Text style={styles.emptySubtitle}>Tente buscar por outro título ou diretor</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando sua coleção...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onEdit={(m) => navigation.navigate("Form", { movie: m })}
            onDelete={handleDelete}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMovies(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Botão flutuante para adicionar novo filme */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Form", {})}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.bg} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  list: {
    paddingBottom: 100, // espaço pro FAB não cobrir o último item
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    marginHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary + "22",
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  resultsCount: {
    fontSize: typography.xs,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + "22",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retryText: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

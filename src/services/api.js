// Aqui ficam todas as funções que conversam com a nossa API
// Centralizar assim facilita muito: se a URL mudar, muda só aqui

// ⚠️  IMPORTANTE: troque o IP abaixo pelo IP da sua máquina na rede local
// Não use "localhost" aqui — o celular físico não consegue acessar o seu computador por localhost
// Exemplo: se seu IP for 192.168.1.5, use "http://192.168.1.5:3000"
// Para descobrir seu IP: no Mac/Linux rode "ifconfig", no Windows rode "ipconfig"

const BASE_URL = "http://192.168.1.100:3000"; // ← substitua pelo seu IP

// Função genérica que cuida do fetch e dos erros de rede
// Assim não precisamos repetir try/catch em todo lugar
async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Se a resposta for 204 (sem conteúdo), não tenta parsear JSON
    if (response.status === 204) return { success: true };

    const data = await response.json();

    // Repassa o erro vindo do servidor como uma exceção
    if (!response.ok) {
      throw new Error(data.error || "Algo deu errado na requisição.");
    }

    return data;
  } catch (err) {
    // Se for erro de rede (servidor desligado, IP errado etc.)
    if (err.message === "Network request failed") {
      throw new Error(
        "Não foi possível conectar ao servidor. Verifique se a API está rodando e se o IP em api.js está correto."
      );
    }
    throw err;
  }
}

// ── Funções da coleção de filmes ──────────────────────────────────────────────

// Retorna todos os filmes cadastrados
export async function getMovies() {
  const { data } = await request("/movies");
  return data;
}

// Retorna um único filme pelo ID
export async function getMovie(id) {
  const { data } = await request(`/movies/${id}`);
  return data;
}

// Cadastra um novo filme e retorna o registro criado
export async function createMovie(movieData) {
  const { data } = await request("/movies", {
    method: "POST",
    body: JSON.stringify(movieData),
  });
  return data;
}

// Atualiza os dados de um filme existente
export async function updateMovie(id, movieData) {
  const { data } = await request(`/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(movieData),
  });
  return data;
}

// Remove um filme da coleção
export async function deleteMovie(id) {
  return request(`/movies/${id}`, { method: "DELETE" });
}

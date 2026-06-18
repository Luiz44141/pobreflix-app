# 🎬 PobreFlix — App React Native

Aplicativo mobile para gerenciar sua coleção de filmes, desenvolvido com **React Native** e **Expo**.

## Funcionalidades

- 📋 **Listar** todos os filmes da coleção
- ➕ **Cadastrar** novos filmes com título, diretor, gênero, ano, nota e sinopse
- ✏️ **Editar** filmes existentes
- 🗑️ **Remover** filmes da coleção
- ✅ Marcar filmes como **assistidos**
- 🔍 **Buscar** por título ou diretor
- 🏷️ **Filtrar** por status (todos / assistidos / na fila)
- ⭐ Exibição de **nota em estrelas**

## Tecnologias

- React Native 0.74
- Expo SDK 51
- React Navigation (Native Stack)
- @expo/vector-icons (Ionicons)
- Fetch API para comunicação com o backend

## Estrutura do Projeto

```
movievault-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js    # Listagem com busca e filtros
│   │   └── FormScreen.js    # Cadastro e edição de filmes
│   ├── components/
│   │   ├── MovieCard.js     # Card individual de filme
│   │   └── MovieForm.js     # Formulário reutilizável
│   ├── services/
│   │   └── api.js           # Funções de chamada à API
│   └── theme/
│       └── index.js         # Cores, fontes e estilos globais
├── App.js                   # Ponto de entrada e navegação
├── app.json                 # Configurações do Expo
└── package.json
```

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/movievault-app.git
cd pobreflix-app

# 2. Instale as dependências
npm install

# 3. Configure o IP do backend
# Abra o arquivo src/services/api.js e atualize a variável BASE_URL
# com o IP da sua máquina na rede local:
# const BASE_URL = "http://SEU_IP_AQUI:3000";

# 4. Inicie o Expo
npx expo start
```

### Descobrindo seu IP

- **Mac/Linux:** `ifconfig | grep "inet "`
- **Windows:** `ipconfig` → procure "Endereço IPv4"

### Rodando no dispositivo

1. Abra o app **Expo Go** no celular
2. Escaneie o QR code exibido no terminal
3. Certifique-se que o celular e o computador estão na **mesma rede Wi-Fi**

> ⚠️ O backend precisa estar rodando antes de abrir o app.

## Telas

| Tela | Descrição |
|------|-----------|
| Home | Lista todos os filmes com busca e filtros |
| Formulário | Cadastra ou edita um filme |

## Conexão com o Backend

O app consome a API do [movievault-backend](https://github.com/seu-usuario/movievault-backend).

Certifique-se de que o backend está rodando em `http://localhost:3000` e atualize o arquivo `src/services/api.js` com seu IP local.

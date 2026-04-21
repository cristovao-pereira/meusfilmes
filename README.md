# 🎬 Meus Filmes

Aplicativo completo de gerenciamento de filmes com autenticação, permitindo que usuários cadastrem filmes que desejam assistir, marquem como assistidos, filtrem por nome e categoria, e realizem operações CRUD completas.

## ✨ Funcionalidades

- ✅ **Autenticação completa** (Login/Cadastro com Supabase Auth)
- ✅ **Listagem de filmes** com busca e filtros
- ✅ **CRUD completo** via modais
- ✅ **Toggle de "Assistido"**
- ✅ **Filtro por categorias** (multi-select)
- ✅ **Busca por título** com debounce
- ✅ **Paginação**
- ✅ **Estados de loading, empty e error**
- ✅ **Design premium e responsivo**
- ✅ **Dark mode automático**
- ✅ **Integração com TMDB API** para dados reais de filmes

## 🚀 Tecnologias

- **Frontend**: React 18 + Vite
- **Backend/Auth**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Roteamento**: React Router v6
- **Ícones**: Lucide React
- **Estilo**: CSS moderno com design system premium
- **Dados**: TMDB API

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)

## 🎥 Demonstração

![Demonstração do Meus Filmes](public/assets/meufilme-gif.gif)

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
3. Preencha as variáveis de ambiente no arquivo `.env` com suas credenciais do Supabase:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima (anon/public key)


### 3. Criar tabela no Supabase

Execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela de filmes
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  categorias TEXT[] NOT NULL,
  ano INTEGER,
  poster_url TEXT,
  observacoes TEXT,
  assistido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Usuários podem ver apenas seus próprios filmes
CREATE POLICY "Users can view own movies"
  ON movies FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir seus próprios filmes
CREATE POLICY "Users can insert own movies"
  ON movies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios filmes
CREATE POLICY "Users can update own movies"
  ON movies FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem excluir seus próprios filmes
CREATE POLICY "Users can delete own movies"
  ON movies FOR DELETE
  USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_movies_user_id ON movies(user_id);
CREATE INDEX idx_movies_categorias ON movies USING GIN(categorias);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. Configurar autenticação no Supabase

1. Vá em **Authentication** > **Providers**
2. Habilite **Email** provider
3. (Opcional) Configure confirmação de e-mail conforme necessário

## 🎯 Executar o projeto

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 📱 Como usar

1. **Criar conta**: Acesse a tela de cadastro e crie sua conta
2. **Fazer login**: Entre com suas credenciais
3. **Adicionar filmes**: Clique em "Adicionar Filme" e preencha o formulário
4. **Buscar**: Use a barra de busca para encontrar filmes por título
5. **Filtrar**: Selecione categorias para filtrar sua lista
6. **Marcar como assistido**: Clique no botão de toggle em cada card
7. **Editar**: Passe o mouse sobre o card e clique no ícone de editar
8. **Excluir**: Passe o mouse sobre o card e clique no ícone de lixeira (confirmação será solicitada)

## 🎨 Design

O aplicativo segue princípios de design moderno:

- **Paleta de cores vibrante** e harmoniosa
- **Glassmorphism** e gradientes suaves
- **Micro-animações** para melhor UX
- **Tipografia moderna** (Google Fonts - Inter)
- **Dark mode** automático baseado nas preferências do sistema
- **Responsivo** para desktop, tablet e mobile

## 📂 Estrutura do projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── LoadingSpinner.jsx
│   ├── EmptyState.jsx
│   ├── SearchBar.jsx
│   ├── CategoryFilter.jsx
│   ├── MovieCard.jsx
│   ├── MovieModal.jsx
│   ├── ConfirmDialog.jsx
│   ├── MultiSelect.jsx
│   └── ProtectedRoute.jsx
├── contexts/            # Contexts React
│   └── AuthContext.jsx
├── hooks/               # Custom hooks
│   └── useDebounce.js
├── lib/                 # Configurações externas
│   └── supabase.js
├── pages/               # Páginas da aplicação
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Movies.jsx
├── utils/               # Utilitários
│   └── constants.js
├── App.jsx              # Componente principal
├── main.jsx             # Entry point
└── index.css            # Design system global
```

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado no Supabase
- Cada usuário só pode ver/editar seus próprios filmes
- Autenticação via Supabase Auth
- Rotas protegidas no frontend

## 📝 Categorias disponíveis

- Ação
- Aventura
- Comédia
- Drama
- Ficção Científica
- Terror
- Romance
- Suspense
- Animação
- Documentário
- Fantasia
- Musical

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe e está preenchido corretamente
- Reinicie o servidor de desenvolvimento após alterar o `.env`

### Erro ao carregar filmes
- Verifique se a tabela `movies` foi criada corretamente
- Confirme que as políticas RLS estão ativas
- Verifique as credenciais do Supabase no `.env`

### Erro ao fazer login/cadastro
- Verifique se o Email provider está habilitado no Supabase
- Confirme que as credenciais do `.env` estão corretas

## 📄 Licença

Este projeto foi criado para fins educacionais.

---

Desenvolvido com ❤️ usando React e Supabase 

# 🎯 Guia de Configuração do Supabase

## Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: Meus Filmes (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
5. Clique em **"Create new project"**
6. Aguarde alguns minutos enquanto o projeto é criado

## Passo 2: Obter Credenciais

1. No painel do projeto, vá em **Settings** (ícone de engrenagem) > **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon/public key** (uma chave longa começando com "eyJ...")

## Passo 3: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua os valores:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Salve o arquivo
4. **IMPORTANTE**: Reinicie o servidor de desenvolvimento após salvar

## Passo 4: Criar Tabela no Banco de Dados

1. No painel do Supabase, vá em **SQL Editor** (ícone de banco de dados)
2. Clique em **"New query"**
3. Cole o seguinte SQL:

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
CREATE POLICY "Users can view own movies"
  ON movies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own movies"
  ON movies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own movies"
  ON movies FOR UPDATE
  USING (auth.uid() = user_id);

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

4. Clique em **"Run"** (ou pressione Ctrl+Enter)
5. Você deve ver a mensagem "Success. No rows returned"

## Passo 5: Configurar Autenticação

1. No painel do Supabase, vá em **Authentication** > **Providers**
2. Certifique-se de que **Email** está habilitado (deve estar por padrão)
3. (Opcional) Desabilite **"Confirm email"** para facilitar testes:
   - Vá em **Authentication** > **Settings**
   - Em **Email Auth**, desmarque **"Enable email confirmations"**
   - Clique em **Save**

## Passo 6: Testar o Aplicativo

1. Certifique-se de que o servidor está rodando (`npm run dev`)
2. Abra o navegador em `http://localhost:5173`
3. Você deve ver a tela de login
4. Clique em **"Criar conta"**
5. Preencha o formulário e crie sua conta
6. Após o cadastro, você será redirecionado para a tela de filmes

## ✅ Checklist de Verificação

- [ ] Projeto criado no Supabase
- [ ] Credenciais copiadas para o arquivo `.env`
- [ ] Servidor reiniciado após configurar `.env`
- [ ] Tabela `movies` criada com sucesso
- [ ] Políticas RLS configuradas
- [ ] Email provider habilitado
- [ ] Aplicativo abrindo em `http://localhost:5173`
- [ ] Conseguiu criar uma conta
- [ ] Conseguiu fazer login
- [ ] Conseguiu adicionar um filme

## 🐛 Problemas Comuns

### "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que as variáveis estão preenchidas corretamente
- Reinicie o servidor (`Ctrl+C` e depois `npm run dev`)

### "Failed to fetch" ao fazer login
- Verifique se as credenciais no `.env` estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique sua conexão com a internet

### Erro ao criar tabela
- Certifique-se de estar no SQL Editor correto
- Execute o SQL completo de uma vez
- Verifique se não há erros de sintaxe

### Não recebe email de confirmação
- Desabilite a confirmação de email nas configurações
- Ou configure um provedor de email personalizado

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12) para erros JavaScript
2. Terminal onde o servidor está rodando
3. Logs do Supabase (Authentication > Logs)

---

**Próximo passo**: Configure o Supabase seguindo este guia e depois teste o aplicativo! 🚀

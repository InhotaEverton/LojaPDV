# ModaPDV - Sistema de Ponto de Venda

Sistema de PDV moderno para lojas de roupas, desenvolvido com React, TypeScript e Tailwind CSS, utilizando Supabase como backend (PostgreSQL).

## 🚀 Funcionalidades

- **PDV (Frente de Caixa):** Interface ágil, busca de produtos, carrinho, múltiplas formas de pagamento.
- **Gestão de Produtos:** Cadastro com variações (Tamanho/Cor).
- **Controle de Estoque:** Baixa automática nas vendas.
- **Fluxo de Caixa:** Abertura e fechamento, controle de turnos.
- **Relatórios:** Gráficos de vendas diárias.
- **Controle de Acesso:** Perfis de Gerente e Vendedor.
- **Interface:** Dark Mode nativo, responsivo.

## 🛠️ Tecnologias

- **Frontend:** React 18 (Vite Template), TypeScript, React Router DOM.
- **Estilização:** Tailwind CSS, Lucide Icons.
- **Gráficos:** Recharts.
- **Backend/DB:** Supabase (Auth + Database + RPC).

## 📦 Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/modapdv.git
cd modapdv
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com).
2. Vá em **SQL Editor** e cole o conteúdo do arquivo `db_setup.sql`. Execute para criar as tabelas e funções.
3. Vá em **Authentication** e crie um usuário (este será seu admin/gerente inicial).
4. Copie a `Project URL` e `anon public key` nas configurações do projeto.

### 3. Variáveis de Ambiente

Crie um arquivo `.env` (ou `.env.local`) na raiz:

```env
REACT_APP_SUPABASE_URL=sua_url_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima
```

*Nota: Se usar Vite padrão, use `VITE_SUPABASE_URL`. O código fornecido usa uma abstração em `constants.ts` que lê `process.env` para compatibilidade geral.*

### 4. Rodar Localmente

```bash
npm start
# ou
npm run dev
```

## ☁️ Deploy na Vercel

1. Suba o código no GitHub.
2. Importe o projeto na Vercel.
3. Nas configurações do projeto na Vercel, adicione as variáveis de ambiente:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
4. Clique em Deploy.

## 📱 Telas do Sistema

- **/login**: Acesso ao sistema.
- **/dashboard**: Visão geral e atalhos.
- **/pdv**: Tela principal de vendas.
- **/produtos**: Cadastro (Apenas gerente).
- **/caixa**: Abertura/Fechamento (Apenas gerente).

## 👤 Login de Teste (Após rodar o SQL)

Crie um usuário no painel do Supabase. O script SQL define automaticamente novos usuários como 'manager' (gerente) via trigger para facilitar o setup inicial. Para criar vendedores, altere a coluna `role` na tabela `profiles` para 'seller'.

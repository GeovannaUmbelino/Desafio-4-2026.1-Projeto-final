# Desafio-4-2026.1-Projeto-final

## Sistema de Controle de Presença - Cessa.io (Acessa)

O **Cessa.io** é uma plataforma web full-stack de gestão e controle de frequência escolar/acadêmica em tempo real. O sistema foi desenvolvido para descentralizar a chamada física, permitindo que professores gerenciem diários de classe com facilidade, administradores acompanhem métricas institucionais e alunos visualizem seu histórico de presença e alertas de risco de baixa frequência de forma transparente.

---

## Links do Projeto

* **🚀 Link do Deploy (Frontend):** [Acesse a Aplicação Aqui](https://seu-frontend.vercel.app)
* **⚙️ Link do Deploy (API/Backend):** [Acesse a API Aqui](https://seu-backend.onrender.com)
* **📚 Documentação da API:** [Acesse a Documentação (Postman/Swagger)](https://link-da-documentacao.com)

---


# Como Rodar o Projeto Localmente

##  Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

## 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

---

## 2. Configurando o Backend (NestJS)

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:

```env
PORT=3001
JWT_SECRET=sua_chave_secreta_e_segura_aqui
DATABASE_URL=database.sqlite
```

!!! warning "Segurança"
    Nunca commite o arquivo `.env` no repositório. Adicione-o ao `.gitignore`.

Execute o projeto em modo de desenvolvimento:

```bash
npm run start:dev
```

O servidor backend iniciará em: **http://localhost:3001**

---

## 3. Configurando o Frontend (Next.js)

Abra um **novo terminal** na raiz do projeto e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env.local` na raiz da pasta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

!!! tip "Rodando com Docker"
    Se preferir usar Docker Compose, substitua `NEXT_PUBLIC_API_URL=http://localhost:3001` por `NEXT_PUBLIC_API_URL=http://backend:3001` no `docker-compose.yml` e execute `docker compose up --build`.


 #  Usuários de Teste Padrão
 
Caso o banco SQLite seja populado via seed automaticamente, utilize as credenciais abaixo para testar cada painel funcional do ecossistema:
 
| Nível de Acesso | E-mail de Teste | Senha Padrão |
|---|---|---|
| Administrador | `admin@admin.com` | `admin123` |
| Professor | `professor@escola.com` | `123456` |
| Estudante | `aluno@escola.com` | `123456` |
 
!!! danger "Atenção"
    Essas credenciais são exclusivas para ambiente local de desenvolvimento. **Nunca utilize senhas padrão em produção.**

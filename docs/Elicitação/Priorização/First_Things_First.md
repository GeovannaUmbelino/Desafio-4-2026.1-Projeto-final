# First Things First

## Objetivo do Projeto

O objetivo deste projeto é desenvolver os pontos essenciais para um sistema digital voltado à gestão de presença em aulas práticas e laboratoriais em uma instituição de ensino. Neste documento, são apresentadas as funcionalidades voltadas para cada tipo de usuário envolvido no processo, visando:
* Eliminar o uso de listas impressas;
* Reduzir fraudes e erros manuais;
* Automatizar a geração de relatórios.

## Público-Alvo e Stakeholders

O público-alvo do projeto é composto por três perfis principais: professores, coordenadores e administradores. 

Os **stakeholders** englobam todos os indivíduos e grupos que, de forma direta ou indireta, são impactados pelo uso ou desenvolvimento do sistema:

* **Professores (Usuários finais):** Possuem expectativas relacionadas à agilidade, simplicidade e confiabilidade no registro diário de frequência, faltas, horários das aulas e alertas.
* **Coordenadores:** Precisam de um sistema que facilite o acompanhamento da carga horária, visualização da taxa média de presença e otimize a identificação de alunos faltosos.
* **Administradores:** Responsáveis pela criação e gestão centralizada de turmas e supervisão administrativa. São beneficiados com a centralização das informações e automação de tarefas.
* **Alunos (Stakeholders indiretos):** Impactados positivamente pela eliminação de fraudes e maior transparência no controle da própria frequência.
* **Equipe de Desenvolvimento (EngNet):** Stakeholder técnico responsável por garantir que o sistema atenda aos requisitos de escalabilidade, responsividade e segurança.

## Escopo Inicial

O escopo inicial foi definido de maneira estratégica para atender às principais necessidades dos usuários finais. Ele contempla as funcionalidades essenciais da aplicação, buscando garantir uma navegação fluida, um processo de autenticação seguro e a implementação de recursos como *dashboard*, gerenciamento de turmas, controle de frequência e relatórios. 

O sistema deve ser utilizável em diferentes dispositivos (desktop, tablet e mobile) sem comprometer a experiência do usuário (UX).

---

## Funcionalidades Gerais Previstas (Primeira Versão)

### 1. Tela de Autenticação (Login)
* Visualização da logomarca do sistema.
* Campos para inserção de e-mail e senha.
* Autenticação com restrição de acesso a dados sensíveis (professores, coordenadores e administradores).

### 2. Dashboard Principal
Fornece uma visão rápida e consolidada da situação acadêmica, contendo:
* Quantidade total de alunos cadastrados;
* Quantidade de aulas cadastradas;
* Taxa média de presença geral;
* Alertas de baixa frequência (alunos com percentual abaixo do mínimo exigido).

### 3. Gerenciamento de Turmas
Permite que administradores realizem operações de CRUD. Cada turma deve conter:
* Nome da turma (ex: "Turma A - Laboratório de Química");
* Código único de identificação;
* Horário (dia da semana e horário da aula);
* Quantidade de alunos matriculados.

### 4. Controle de Frequência
Permite o registro digital (sem papel) e validação integral no sistema, impedindo assinaturas manuais, registros falsos ou presença em aulas simultâneas:
* Registrar presença e falta por aluno;
* Visualizar data e horário da aula registrados automaticamente;
* Acessar histórico de frequência por turma e aluno.

### 5. Relatórios
Geração de relatórios instantâneos visualizáveis no navegador:
* Frequência individual por aluno (total de presenças e faltas);
* Percentual de presença por aluno;
* Lista de alunos faltosos (com filtro por turma e período);
* Histórico de frequência por turma.

### 6. Responsividade
Adaptação automática do *layout* utilizando **Tailwind CSS** para:
* Desktop
* Tablet
* Mobile

---

## Perfis de Acesso e Funcionalidades

### Funcionalidades para Professores

**1. Navegação Principal (Navbar):**
* **Dashboard:** Indicadores adaptados (apenas turmas que leciona).
* **Turmas:** Lista de turmas atribuídas. Permite acessar alunos e registrar presença.
* **Registrar Frequência:** Atalho direto para a aula atual.
* **Relatórios:** Acesso rápido aos relatórios de suas turmas.
* **Notificações:** Alertas de baixa frequência e confirmações.

**2. Registro de Frequência (Fluxo Principal):**
* Visualização da lista de alunos da turma selecionada.
* Botões de ação para cada aluno: "Presente" e "Falta".
* Botão "Confirmar frequência" (salva informações com data e hora automáticas).

**3. Histórico de Frequência:**
* Visualização por turma contendo: Data/hora, quantidade de presentes/faltas e lista detalhada de faltosos.
* Filtros por período (ex: última semana, último mês).

### Funcionalidades para Coordenadores/Administradores

**1. Navegação Principal (Navbar):**
* **Dashboard:** Indicadores de todas as turmas e alertas gerais.
* **Gestão de Turmas:** CRUD (Criar, ler, atualizar e deletar) de turmas.
* **Gestão de Alunos:** Cadastro, edição, remoção e associação a turmas.
* **Relatórios Avançados:** Consolidados por turma, aluno e período.
* **Notificações:** Alertas sistêmicos.

**2. Gestão de Turmas e Alunos:**
* Visualização de lista de turmas com detalhes.
* Ações de editar, remover e listar alunos de uma turma.
* Busca de alunos por nome ou matrícula.

**3. Relatórios Avançados:**
* Filtros por turma(s), período (data inicial e final) e tipo (individual, consolidado, faltosos).
* Exibição de: Nome, presenças, faltas, percentual e *status* (acima/abaixo da média).

---

## Fluxo de Uso Esperado

1. O professor acessa o sistema via navegador e realiza login.
2. Na *dashboard*, visualiza as turmas que leciona.
3. Seleciona uma turma e clica em "Registrar frequência".
4. Marca "Presente" ou "Falta" para cada aluno e confirma o registro.
5. O sistema salva automaticamente a data e o horário.
6. A qualquer momento, o professor gera relatórios ou acessa o histórico.
7. Paralelamente, coordenadores e administradores gerenciam turmas/alunos e visualizam relatórios e alertas consolidados.

---

## Requisitos Técnicos e de Interface

### Interface e UX
* Navegação intuitiva e menus claros.
* Identidade visual consistente (Cores: preto, laranja, rosa, roxo e branco).
* *Feedback* visual para ações (ex: mudança de cor em botões, mensagens de sucesso).
* Componentes organizados e reutilizáveis (botões, *cards*, *modais*, tabelas).
* Prototipagem obrigatória (Wireframes de média ou alta fidelidade).

### Front-end
* Responsividade obrigatória via **Tailwind CSS**.
* Componentização adequada e separação de responsabilidades (páginas, componentes, serviços, *hooks*).
* Boas práticas de semântica HTML.
* Consumo de API REST desenvolvida em NestJS (com *front* em NextJS/React).

### Back-end e Autenticação
* API REST desenvolvida em **NestJS**.
* Endpoints para autenticação, CRUD de turmas/alunos, frequência e relatórios.
* Banco de dados: PostgreSQL, MongoDB ou SQLite.
* Autenticação via Token (JWT) ou *session* para rotas protegidas.
* Armazenamento seguro de senhas (Hash).

---

## Diferenciais (Extras)
* **Dark mode.**
* Gráficos de frequência (ex: evolução semanal).
* Filtro e busca de alunos dentro das turmas.
* Exportação de relatórios (PDF ou CSV).

## Organização da Entrega
* Repositório no GitHub (público ou com acesso liberado).
* `README.md` completo com instruções de instalação, execução e *deploy*.
* *Deploy* acessível online (GitHub Pages, Vercel ou Netlify).
* Código-fonte completo com *commits* semânticos e frequentes.

---

## Considerações Finais:
O desafio simula um cenário real de desenvolvimento *full stack*, exigindo interpretação de problemas reais, modelagem de soluções, design responsivo, escalabilidade e garantia de uma boa experiência para o usuário (UX) e satisfação do cliente.



## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 05/06/2026 | Documentação do first things first       | [Ronan Freitas](https://github.com/HunterBRR) | [Felipe Serikava](https://github.com/felipeserikava-web), [Geovanna Alves](https://github.com/GeovannaUmbelino) |
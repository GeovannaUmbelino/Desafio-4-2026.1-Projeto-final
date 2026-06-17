# Backlog

## Introdução
O product backlog é um instrumento central na gestão ágil, atuando como o repositório oficial de todo o trabalho previsto para o projeto, incluindo novos recursos, refinamentos e correções de falhas. Sua função principal é orientar e estruturar o fluxo de trabalho do time de desenvolvimento, alinhando a evolução do software às necessidades do usuário e às metas estratégicas do negócio. Por se tratar de um artefato vivo e flexível, o backlog passa por constantes revisões e atualizações à medida que o escopo e o direcionamento do produto se transformam [1].


## Metodologia
A organização das histórias de usuário foi estruturada a partir de dois eixos temáticos principais:

Funcionalidades: Compreende as capacidades operacionais necessárias para que o usuário execute suas tarefas com êxito.

Perfil: Engloba as ferramentas que permitem ao usuário customizar o sistema conforme suas preferências e necessidades.

### Épicos
Visando reduzir a abstração, os temas foram desdobrados em Épicos. Para este projeto, os épicos foram redigidos utilizando a estrutura padrão de histórias de usuário, incorporando uma camada intermediária de organização denominada Features.

### Features
As Features consistem em descrições simplificadas das capacidades do produto, situando-se em um nível hierárquico superior ao das histórias de usuário. Elas definem, de maneira objetiva, como o software atende aos objetivos estratégicos dos usuários.

### Histórias de Usuário
As histórias de usuário detalham as Features e serão aprofundadas na seção dedicada deste documento. Elas funcionam como descrições concisas e de alto nível, focadas na perspectiva do cliente, usualmente seguindo a sintaxe: "Eu, como [papel], desejo [ação] para [valor/benefício]."

## Product Backlog
O Product Backlog consolidado encontra-se apresentado na Tabela 2.

## Product Backlog
 
A Tabela 2 apresenta o Product Backlog completo do sistema de gestão de presença acadêmica, organizado por épicos, features e histórias de usuário, com suas respectivas priorizações.
 
<font size="3"><p style="text-align: center">Tabela 2: Product Backlog — Sistema de Gestão de Presença Acadêmica</p></font>
 
| Épico | Feature | História de Usuário | Priorização |
| :--- | :--- | :--- | :--- |
| Épico 1 - Autenticar | Feature 1 — Autenticação de Usuários | **US01** — Cadastro de usuário com foto e tipo de perfil | Alta |
| Épico 1 - Autenticar | Feature 1 — Autenticação de Usuários | **US02** — Login seguro com JWT e redirecionamento por role | Alta |
| Épico 2 - Gerenciar Perfil | Feature 1 — Perfil do Usuário | **US03** — Visualizar e editar perfil pessoal do usuário | Média |
| Épico 3 - Visualizar Dashboard | Feature 1 — Métricas Gerais | **US04** — Visualizar dashboard com métricas do sistema | Alta |
| Épico 3 - Visualizar Dashboard | Feature 1 — Métricas Gerais | **US05** — Visualizar gráficos dinâmicos de frequência | Média |
| Épico 4 - Gerenciar Turmas | Feature 1 — CRUD de Turmas | **US06** — Criar turma com nome, código, horário e alunos | Alta |
| Épico 4 - Gerenciar Turmas | Feature 1 — CRUD de Turmas | **US07** — Editar dados de uma turma existente | Alta |
| Épico 4 - Gerenciar Turmas | Feature 1 — CRUD de Turmas | **US08** — Remover turma com exclusão lógica (soft delete) | Média |
| Épico 4 - Gerenciar Turmas | Feature 2 — Visualização e Busca | **US09** — Listar turmas e alunos com busca e filtro rápido | Alta |
| Épico 5 - Controlar Frequência | Feature 1 — Registro de Chamada | **US10** — Registrar presença digital em aula (professor) | Alta |
| Épico 5 - Controlar Frequência | Feature 1 — Registro de Chamada | **US11** — Visualizar histórico de frequência por turma | Alta |
| Épico 5 - Controlar Frequência | Feature 2 — Carga Horária | **US12** — Gerenciar automaticamente a carga horária das aulas | Média |
| Épico 6 - Gerar Relatórios | Feature 1 — Relatórios do Professor | **US13** — Gerar relatório consolidado de todas as turmas do professor | Alta |
| Épico 6 - Gerar Relatórios | Feature 1 — Relatórios do Professor | **US14** — Gerar relatório detalhado por turma selecionada com exportação | Alta |
| Épico 7 - Área do Aluno | Feature 1 — Acompanhamento de Frequência | **US15** — Visualizar turmas em que o aluno está matriculado | Alta |
| Épico 7 - Área do Aluno | Feature 1 — Acompanhamento de Frequência | **US16** — Visualizar histórico detalhado de presenças e faltas | Alta |
| Épico 7 - Área do Aluno | Feature 1 — Acompanhamento de Frequência | **US17** — Receber alertas automáticos de baixa frequência | Média |
| Épico 8 - Requisitos Técnicos | Feature 1 — Interface e Responsividade | **US18** — Garantir layout responsivo em Desktop, Tablet e Mobile | Alta |
| Épico 8 - Requisitos Técnicos | Feature 1 — Interface e Responsividade | **US19** — Configurar stack obrigatória: Next.js, NestJS e SQLite | Alta |
| Épico 8 - Requisitos Técnicos | Feature 1 — Interface e Responsividade | **US20** — Criar protótipo com identidade visual da empresa | Alta |
| Épico 8 - Requisitos Técnicos | Feature 2 — Entrega e Deploy | **US21** — Versionar código no GitHub com README completo | Alta |
| Épico 8 - Requisitos Técnicos | Feature 2 — Entrega e Deploy | **US22** — Configurar deploy automatizado via Vercel ou Netlify | Alta |
| Épico 9 - Diferenciais | Feature 1 — Experiência do Usuário | **US23** — Implementar alternância de tema dark mode | Baixa |
| Épico 9 - Diferenciais | Feature 1 — Experiência do Usuário | **US24** — Adicionar filtro e busca avançada de alunos | Média |

 
 Fonte:  [Geovanna Alves](https://github.com/GeovannaUmbelino).

 
## Épico 1 — Autenticar
 
Esse épico apresenta as funcionalidades que permitem ao administrador, professor e aluno realizarem o cadastro e o login de forma segura na plataforma, com autenticação via JWT e redirecionamento automático por tipo de perfil.
 
## Épico 2 — Gerenciar Perfil
 
Esse épico apresenta as funcionalidades que permitem aos usuários visualizarem e editarem suas informações pessoais dentro da plataforma, como nome, e-mail e foto de perfil.
 
## Épico 3 — Visualizar Dashboard
 
Esse épico apresenta as funcionalidades que permitem ao administrador e ao professor visualizarem uma visão geral do sistema, com métricas como total de alunos, aulas cadastradas, taxa média de presença, alertas de baixa frequência e gráficos dinâmicos de desempenho.
 
## Épico 4 — Gerenciar Turmas
 
Esse épico apresenta as funcionalidades que permitem ao administrador criar, editar, remover e listar turmas, associando professores e alunos. Inclui também funcionalidades de busca e filtro para localização rápida.
 
## Épico 5 — Controlar Frequência
 
Esse épico apresenta as funcionalidades que permitem ao professor registrar a presença dos alunos de forma estritamente digital, eliminando o uso de papel e prevenindo fraudes como a assinatura por terceiros. Inclui também o gerenciamento automático da carga horária das aulas.
 
## Épico 6 — Gerar Relatórios
 
Esse épico apresenta as funcionalidades que permitem ao professor gerar relatórios de frequência de forma consolidada (todas as turmas) e detalhada (por turma selecionada), com visualização de gráficos e opção de exportação em PDF ou CSV.
 
## Épico 7 — Área do Aluno
 
Esse épico apresenta as funcionalidades voltadas ao aluno, permitindo que ele visualize as turmas em que está matriculado, consulte o histórico detalhado de presenças e faltas, e receba alertas automáticos quando a frequência estiver abaixo do mínimo exigido.
 
## Épico 8 — Requisitos Técnicos
 
Esse épico apresenta as histórias de usuário relacionadas à infraestrutura técnica do projeto: responsividade da interface, configuração da stack obrigatória (Next.js, NestJS e SQLite), prototipagem com a identidade visual da empresa, versionamento no GitHub e deploy automatizado.
 
## Épico 9 — Diferenciais
 
Esse épico apresenta as funcionalidades extras que agregam valor à experiência do usuário, como a alternância de tema (dark mode) e o sistema de filtro e busca avançada de alunos.
 


## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 03/06/2026 | Documentação da visão de produto      |  [Geovanna Alves](https://github.com/GeovannaUmbelino), [Felipe Serikava](https://github.com/felipeserikava-web) e [Ronan Freitas](https://github.com/HunterBRR)| [Felipe Serikava](https://github.com/felipeserikava-web) e [Ronan Freitas](https://github.com/HunterBRR)|

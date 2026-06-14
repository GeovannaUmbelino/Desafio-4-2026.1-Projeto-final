# Perfil de Usuário

## Introdução

No intuito de se conhecer melhor os usuários do sistema de gestão de presença acadêmica, é necessário elaborar perfis genéricos que representem as diferentes categorias de pessoas que irão interagir com a plataforma. Segundo Barbosa e Silva (2011)<a id="anchor_1" href="#FRM1">[1]</a>, perfil de usuário é uma descrição detalhada das características dos usuários cujos objetivos devem ser apoiados pelo sistema sendo projetado.

## Participantes

A seguir temos a tabela 1, onde indica todos os participantes da criação do Perfil de usuário, o horário e sua contribuição.

<div align="center">
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Data</th>
        <th>Participação</th>
      </tr>
    </thead>
    <tbody>
        <tr>
        <td><a href="https://github.com/felipeserikava-web">Felipe Serikava</a></td>
         <td>05/06/2026</td>
        <td>Criação do perfil de usuário através da elaboração do questionário</td>
      </tr>
      <tr>
        <tr>
        <td><a href="https://github.com/GeovannaUmbelino">Geovanna Alves</a></td>
         <td>05/06/2026</td>
        <td>Criação do perfil de usuário através da gravação das entrevistas e questionário</td>
      </tr>
      <tr>
        <tr>
        <td><a href="https://github.com/HunterBRR">Ronan Freitas</a></td>
         <td>05/06/2026</td>
        <td>Criação do perfil de usuário através da gravação das entrevistas</td>
      </tr>
    </tbody>
  </table>
</div>

Tabela 1: Participantes
Autor: [Geovanna Alves](https://github.com/GeovannaUmbelino) 

## Metodologia

Para a definição dos perfis de usuário, o squad newtons realizou uma análise qualitativa do enunciado do desafio disponibilizado pela EngNet, identificando os três tipos de atores do sistema: Administrador, Professor e Aluno. A partir das problemáticas relatadas pelo cliente — como fraudes em lista de presença, sobrecarga administrativa e falta de rastreabilidade — foram mapeadas as necessidades, objetivos e expectativas de cada perfil. Durante o processo (versão 1.3), os perfis também foram validados junto à equipe e através de checagens com potenciais usuários para garantir o alinhamento com a realidade.

As fontes utilizadas para a construção dos perfis foram:

- Enunciado do desafio que contém os problemas relatados pelo cliente (instituição de ensino);
- Requisitos elicitados (RQ1 a RQ22);
- Boas práticas de engenharia de requisitos e design centrado no usuário.

---

### Usuário 1 - Administrador

O Administrador é o responsável pela configuração e manutenção geral da plataforma. Possui acesso total ao sistema, podendo gerenciar usuários, turmas e configurações globais. Geralmente ocupa um cargo técnico ou de coordenação na instituição de ensino.

| Atributo do Perfil de Administrador | Detalhes |
| :--- | :--- |
| **Classificação** | Usuário Secundário |
| **Idade** | Entre 25 e 50 anos |
| **Escolaridade** | Ensino superior completo (Tecnologia da Informação, Administração ou áreas correlacionadas) |
| **Afinidade com dispositivos eletrônicos** | Alta - utiliza sistemas administrativos e ferramentas digitais no dia a dia |
| **Frequência de uso** | Ocasional / Semanal |
| **Dispositivos** | Principalmente desktop/notebook; eventualmente mobile |
| **Tarefas desejadas** | Cadastrar e gerenciar usuários (professores e alunos); criar, editar e remover turmas; acessar relatórios gerais; configurar parâmetros do sistema |
| **Objetivo no sistema** | Garantir o funcionamento correto da plataforma e manter os dados organizados e seguros |
| **Dores atuais** | Sobrecarga administrativa com planilhas manuais, dificuldade para rastrear informações e gerar relatórios rapidamente |
| **Expectativas** | Sistema centralizado, fácil de operar, com controles robustos de acesso e dados confiáveis |
| **Permissões e Responsabilidades** | Acesso total (criar, editar, remover e visualizar). Gerenciamento de usuários, aprovação de cadastros e configuração global do sistema |

**Requisitos relacionados ao perfil do Administrador:**
<br>RQ1 — Cadastro e login seguro
<br>RQ2 — Página de perfil
<br>RQ3 — Dashboard com métricas gerais
<br>RQ4 — Criar, editar, remover e listar turmas
<br>RQ6 — Geração de relatórios

---

### Usuário 2 - Professor

O Professor é o principal operador do controle de presença. É responsável por registrar a frequência dos alunos em cada aula, acompanhar o histórico e gerar relatórios de desempenho. Atualmente sofre com processos manuais, erros de lançamento e dificuldade para identificar alunos em risco de reprovação.

| Atributo do Perfil de Professor | Detalhes |
| :--- | :--- |
| **Classificação** | Usuário Primário |
| **Idade** | Entre 25 e 60 anos |
| **Escolaridade** | Ensino superior completo (bacharelado, mestrado, doutorado ou especialização) |
| **Afinidade com dispositivos eletrônicos** | Média a alta — familiarizado com sistemas acadêmicos, e-mail e ferramentas de produtividade |
| **Frequência de uso** | Diária |
| **Dispositivos** | Notebook em sala de aula; mobile para consultas rápidas |
| **Tarefas desejadas** | Registrar presença e falta por aluno; visualizar histórico de frequência; gerar relatórios de turmas; acompanhar alertas de baixa frequência |
| **Objetivo no sistema** | Realizar o controle de presença de forma rápida, digital e confiável, sem depender de listas impressas |
| **Dores atuais** | Alunos assinando por outros; erros humanos no lançamento; lentidão para gerar relatórios; excesso de papel |
| **Expectativas** | Registrar presença em poucos cliques, visualizar dados em gráficos e exportar relatórios sem esforço |
| **Permissões e Responsabilidades** | Edição restrita às suas turmas. Pode registrar presenças/faltas, visualizar histórico dos seus alunos e emitir relatórios das turmas vinculadas |

**Requisitos relacionados ao perfil do Professor:**
<br>RQ1 — Login seguro
<br>RQ3 — Dashboard com métricas
<br>RQ5 — Registrar presença, marcar falta e visualizar histórico
<br>RQ6 — Geração de relatórios por turma e individual
<br>RQ7 — Gestão automática de carga horária
<br>RQ8 — Validação digital sem papel
<br>RQ17 — Gráficos de frequência
<br>RQ18 — Filtro e busca de alunos

---

### Usuário 3 - Aluno

O Aluno é o usuário final que consome as informações sobre sua própria frequência. Não realiza lançamentos, mas precisa acompanhar seu histórico para evitar reprovação por falta.

| Atributo do Perfil de Aluno | Detalhes |
| :--- | :--- |
| **Classificação** | Usuário Primário |
| **Idade** | Entre 15 e 40 anos |
| **Escolaridade** | Cursando o Ensino Médio ou cursando o Ensino Superior  |
| **Afinidade com dispositivos eletrônicos** | Média a alta — usa dispositivos mobile frequentemente; familiarizado com aplicativos e plataformas educacionais |
| **Frequência de uso** | Semanal |
| **Dispositivos** | Principalmente mobile; eventualmente notebook/desktop |
| **Tarefas desejadas** | Visualizar turmas em que está matriculado; consultar histórico de presenças e faltas; verificar percentual de frequência; receber alertas de risco |
| **Objetivo no sistema** | Acompanhar sua frequência em tempo real para tomar ações preventivas antes de atingir o limite de faltas |
| **Dores atuais** | Falta de visibilidade sobre frequência; descobrir o problema apenas no fechamento do período; dependência do professor para obter informações |
| **Expectativas** | Interface simples e rápida, especialmente em mobile; notificações proativas de risco; histórico claro e organizado por turma |
| **Permissões e Responsabilidades** | Apenas leitura (visualização). Restrito ao acesso dos próprios dados de frequência e turmas nas quais está matriculado |

**Requisitos relacionados ao perfil do Aluno:**
<br>RQ1 — Login seguro
<br>RQ3 — Dashboard com métricas (foco individual)
<br>RQ5 — Visualizar histórico próprio
<br>RQ17 — Gráficos de frequência (visão do aluno)

---


## Bibliografia

<a id="FRM1" href="#anchor_1">1.</a> BARBOSA, S. D. J.; SILVA, B. S. Interação Humano-Computador. Rio de Janeiro: Elsevier, 2011.

## Histórico de Versões

| Versão | Data       | Descrição                                 | Autor                                                                                                                                                                                                                     | Revisor                                            |
| ------ | ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1.0    | 05/06/2026 | Documentação do perfil de usuário         | [Felipe Serikava](https://github.com/felipeserikava-web), [Geovanna Alves](https://github.com/GeovannaUmbelino) e [Ronan Freitas](https://github.com/HunterBRR)  |  [Geovanna Alves](https://github.com/GeovannaUmbelino)   |


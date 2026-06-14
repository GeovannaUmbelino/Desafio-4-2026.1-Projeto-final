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
 
<div align="center">
<table border="1" cellspacing="0" cellpadding="6">
  <thead style="background-color:#E8610A; color:#ffffff;">
    <tr>
      <th>Épico</th>
      <th>Feature</th>
      <th>História de Usuário</th>
      <th>Priorização</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 1<br/>Autenticar
      </td>
      <td rowspan="2">Feature 1 — Autenticação de Usuários</td>
      <td><strong>US01</strong> — Cadastro de usuário com foto e tipo de perfil</td>
      <td >Alta</td>
    </tr>
    <tr>
      <td><strong>US02</strong> — Login seguro com JWT e redirecionamento por role</td>
      <td >Alta</td>
    </tr>
    <tr>
      <td >
        Épico 2<br/>Gerenciar Perfil
      </td>
      <td >Feature 1 — Perfil do Usuário</td>
      <td><strong>US03</strong> — Visualizar e editar perfil pessoal do usuário</td>
      <td >Média</td>
    </tr>
    <tr>
      <td rowspan="2" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 3<br/>Visualizar Dashboard
      </td>
      <td rowspan="2">Feature 1 — Métricas Gerais</td>
      <td><strong>US04</strong> — Visualizar dashboard com métricas do sistema</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US05</strong> — Visualizar gráficos dinâmicos de frequência</td>
      <td style="background-color:#FFF8E1; color:#E65100; font-weight:bold; text-align:center;">Média</td>
    </tr>
    <tr>
      <td rowspan="4" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 4<br/>Gerenciar Turmas
      </td>
      <td rowspan="3">Feature 1 — CRUD de Turmas</td>
      <td><strong>US06</strong> — Criar turma com nome, código, horário e alunos</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US07</strong> — Editar dados de uma turma existente</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US08</strong> — Remover turma com exclusão lógica (soft delete)</td>
      <td style="background-color:#FFF8E1; color:#E65100; font-weight:bold; text-align:center;">Média</td>
    </tr>
    <tr>
      <td rowspan="1">Feature 2 — Visualização e Busca</td>
      <td><strong>US09</strong> — Listar turmas e alunos com busca e filtro rápido</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td rowspan="3" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 5<br/>Controlar Frequência
      </td>
      <td rowspan="2">Feature 1 — Registro de Chamada</td>
      <td><strong>US10</strong> — Registrar presença digital em aula (professor)</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US11</strong> — Visualizar histórico de frequência por turma</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td rowspan="1">Feature 2 — Carga Horária</td>
      <td><strong>US12</strong> — Gerenciar automaticamente a carga horária das aulas</td>
      <td style="background-color:#FFF8E1; color:#E65100; font-weight:bold; text-align:center;">Média</td>
    </tr>
    <tr>
      <td rowspan="2" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 6<br/>Gerar Relatórios
      </td>
      <td rowspan="2">Feature 1 — Relatórios do Professor</td>
      <td><strong>US13</strong> — Gerar relatório consolidado de todas as turmas do professor</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US14</strong> — Gerar relatório detalhado por turma selecionada com exportação</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td rowspan="3" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 7<br/>Área do Aluno
      </td>
      <td rowspan="3">Feature 1 — Acompanhamento de Frequência</td>
      <td><strong>US15</strong> — Visualizar turmas em que o aluno está matriculado</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US16</strong> — Visualizar histórico detalhado de presenças e faltas</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US17</strong> — Receber alertas automáticos de baixa frequência</td>
      <td style="background-color:#FFF8E1; color:#E65100; font-weight:bold; text-align:center;">Média</td>
    </tr>
    <tr>
      <td rowspan="5" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 8<br/>Requisitos Técnicos
      </td>
      <td rowspan="3">Feature 1 — Interface e Responsividade</td>
      <td><strong>US18</strong> — Garantir layout responsivo em Desktop, Tablet e Mobile</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US19</strong> — Configurar stack obrigatória: Next.js, NestJS e SQLite</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US20</strong> — Criar protótipo com identidade visual da empresa</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td rowspan="2">Feature 2 — Entrega e Deploy</td>
      <td><strong>US21</strong> — Versionar código no GitHub com README completo</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td><strong>US22</strong> — Configurar deploy automatizado via Vercel ou Netlify</td>
      <td style="background-color:#FDECEA; color:#C62828; font-weight:bold; text-align:center;">Alta</td>
    </tr>
    <tr>
      <td rowspan="2" style="background-color:#FFF3EC; font-weight:bold; color:#E8610A; text-align:center;">
        Épico 9<br/>Diferenciais
      </td>
      <td rowspan="2">Feature 1 — Experiência do Usuário</td>
      <td><strong>US23</strong> — Implementar alternância de tema dark mode</td>
      <td style="background-color:#E8F5E9; color:#2E7D32; font-weight:bold; text-align:center;">Baixa</td>
    </tr>
    <tr>
      <td><strong>US24</strong> — Adicionar filtro e busca avançada de alunos</td>
      <td style="background-color:#FFF8E1; color:#E65100; font-weight:bold; text-align:center;">Média</td>
    </tr>
 
  </tbody>
</table>
</div>

 
 Fonte:  [Geovanna Alves](https://github.com/GeovannaUmbelino), [Lara Souza](https://github.com/mel14-hub),  e [Yan Matheus](https://github.com/Yanmatheus0812).

 
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
 


Fonte:  [Geovanna Alves](https://github.com/GeovannaUmbelino), [Lara Souza](https://github.com/mel14-hub),  e [Yan Matheus](https://github.com/Yanmatheus0812).

## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 05/06/2026 | Documentação da visão de produto      |  [Geovanna Alves](https://github.com/GeovannaUmbelino), [Felipe Serikava](https://github.com/felipeserikava-web) e [Ronan Freitas](https://github.com/HunterBRR)| [Felipe Serikava](https://github.com/felipeserikava-web) e [Ronan Freitas](https://github.com/HunterBRR)|

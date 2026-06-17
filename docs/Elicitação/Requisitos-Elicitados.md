# Requisitos elicitados

## Introdução

Essa página reune todos os requisitos elicitados usando a técnicas de Análise de documentação.

## Participantes

A seguir temos a tabela 1, onde indica todos os participantes da técnica de elicitação do questionário e a data da elaboração.

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
        <td>Elaborou de forma conjunta todos os requisitos</td>
      </tr>
        <td><a href="https://github.com/GeovannaUmbelino">Geovanna Alves</a></td>
        <td>05/06/2026</td>
        <td>Elaborou de forma conjunta todos os requisitos</td>
      </tr>
      <tr>
       <td><a href="https://github.com/HunterBRR">Ronan Freitas</a></td>
         <td>05/06/2026</td>
        <td>Elaborou de forma conjunta todos os requisitos</td>
      </tr>
    </tbody>
  </table>
</div>

Tabela 1: Participantes do questionário

Autor: [Geovanna Alves](https://github.com/GeovannaUmbelino)

## Tabela de Requisitos

A tabela 2 disposta abaixo representa todos os requisitos levantados durante a análise de documentos, identificados com 'RQ' + numero do requisito, e com a seguinte legenda de categoria:

- RF: Requisitos Funcionais - Descrevem o comportamento ou a funcionalidade que o software deve ter para atender às necessidades do usuário.
- RNF: Requisitos Não-Funcionais - Descrevem os atributos que o software deve ter, como desempenho, segurança e usabilidade, mas não descrevem o comportamento do software em si.
- RI: Requisitos de Interface - Descrevem as características da interface do usuário, como layout, navegação e personalização.
- RPR: Requisitos de Produto - Descrevem as características do produto, como compatibilidade, desempenho e custo.
- RR: Riscos - São os riscos associados ao desenvolvimento e uso do software.
- RT: Testes e Validações - Descrevem as atividades necessárias para testar e validar o software antes de sua implantação.



| Identificação | Descrição                                                                                                                                                                           | Categoria | Versão | Referência                                                                                                                         |
| :------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |:----------: | :----: | ---------------------------------------------------------------------------------------------------------------------------------- |
|           RQ1 | O sistema deve permitir o cadastro e login seguro de usuários (professores, alunos e administradores).                                                                                         |    RF      |  1.0   |                        Descrição do Desafio 4                                                      |
|           RQ2 | O sistema deve possuir uma página de perfil para visualização e edição das informações do usuário.                                             |    RF      |  1.0   |                                   Descrição do Desafio 4                                           |
|           RQ3 | O sistema deve possuir um dashboard contendo: quantidade de alunos, aulas cadastradas, taxa média de presença e alertas de baixa frequência.                                                                  |    RF       |  1.0   |           Descrição do Desafio 4                                                              |
|           RQ4 | O sistema deve permitir que o administrador crie, edite, remova e liste turmas (contendo nome, código, horário, quantidade de alunos e lista de estudantes).                              |    RF         |  1.0   |                           Descrição do Desafio 4                                                     |
|           RQ5 |  O sistema deve permitir que o professor liste turmas (contendo nome, código, horário, quantidade de alunos e lista de estudantes).                                                                                                            |    RF         |  1.0   | Descrição do Desafio 4  |
|           RQ6 | O sistema deve permitir ao professor registrar presença, marcar falta, registrar data/horário da aula e visualizar o histórico de frequência.                                                                |    RF       |  1.0   |                                 Descrição do Desafio 4                                              |
|           RQ7 |  O sistema deve gerar relatórios de frequência individual, percentual de presença, lista de faltas e histórico por turma.        |    RF     |  1.0   |                                                  Descrição do Desafio 4                               |
|           RQ8 | O sistema deve permitir que o aluno visualize as turmas nas quais está matriculado, incluindo nome, código, horário e professor responsável.                                                                                                       |    RF        |  1.0   |            Descrição do Desafio 4                                                                    |
|           RQ9 | O sistema deve gerenciar automaticamente a carga horária das aulas práticas e laboratoriais.                                                                            |    RF       |  1.0   |         Descrição do Desafio 4                                                                        |
|          RQ10 | O sistema deve exibir gráficos visuais e dinâmicos para a análise de frequência.                                                                                    |    RF        |  1.0   |                            Descrição do Desafio 4                                                   |
|          RQ11 |  O sistema deve possuir um sistema de filtro e busca avançada para localizar alunos rapidamente.                                                                    |    RF         |  1.0   |                                Descrição do Desafio 4                                       |
|          RQ12 |  O sistema deve permitir que o aluno visualize seu histórico detalhado de presenças e faltas.                                                                                                 |    RF        |  1.0   |                 Descrição do Desafio 4                                                              |
|          RQ13 | A interface da aplicação deve ser totalmente responsiva, funcionando adequadamente em Desktop, Tablet e Mobile.                                                                                     |    RNF         |  1.0   |               Descrição do Desafio 4                                                                  |
|          RQ14 | O sistema deve permitir a alternância de tema da interface para o modo escuro (Dark Mode).                              |    RI          |  1.0   |                                                           Descrição do Desafio 4                      | 
|          RQ15 | Relatório geral de todas as turmas: visão consolidada de todas as turmas do professor, com frequência por aluno e gráficos, sem precisar selecionar turma tem a opção de exportar.                                                                                                     |    RF          |  1.0   |   Descrição do Desafio 4                                                                            |
|          RQ16 | Relatório detalhado por turma selecionada: o professor escolhe uma turma específica e vê só os dados daquela turma, alunos, frequência individual, faltosos, histórico e gráfico com opção de exportar.                                                                                      |    RF        |  1.0   |      Descrição do Desafio 4                                                                         |
|          RQ17 | As páginas de dashboard, listagem de turmas e relatórios devem carregar em menos de 2 segundos em conexões de banda larga padrão.                                                                                          |    RF        |  1.0   |             Descrição do Desafio 4                                |                                                                                                                              |
|          RQ18 | O estudante deve ser capaz de realizar as principais funções do aplicativo (cadastro, login, busca, e envio de dados) em até 8 minutos de uso, sem necessidade de treinamento prévio. |    RNF        |  1.0   | Descrição do Desafio 4    |
|          RQ19 | O aplicativo deve ter uma linguagem simples e adequada ao estudante (sem termos técnicos)                                                                                             |    RNF        |  1.0   |   Descrição do Desafio 4   |
|          RQ20 | O aplicativo deve carregar suas informações em no máximo 3 segundos.                                                                                                                |    RNF          |  1.0   |  Descrição do Desafio 4   |



<p style="text-align: center; font-size: 14px;">
Tabela 2 – Conjunto de requisitos elicitados.<br>
Elaboração por <a href="https://github.com/felipeserikava-web">Felipe Serikava</a>,
<a href="https://github.com/GeovannaUmbeliino">Geovanna Alves</a>,
 e
<a href="https://github.com/HunterBRR">Ronan Freitas</a>.

</p>




## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 29/06/2026 | Documentação dos requisitos elicitados        | [Felipe Serikava](https://github.com/felipeserikava-web), [Geovanna Alves](https://github.com/GeovannaUmbelino) e [Ronan Freitas](https://github.com/HunterBRR) | [Felipe Serikava](https://github.com/felipeserikava-web) |

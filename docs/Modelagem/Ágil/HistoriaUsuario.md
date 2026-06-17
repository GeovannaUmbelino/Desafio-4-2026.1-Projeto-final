# Historia de Usuário

## Introdução
Utilizada para levantar requisitos no escopo ágil, a história de usuário descreve uma funcionalidade de maneira sucinta e sob o ponto de vista do cliente. Para viabilizar a verificação do sistema, essas histórias devem vir acompanhadas de critérios de aceitação bem delimitados <a id="anchor_1" href="#FRM1">[1]</a>.

## Objetivo
O objetivo deste artefato é apresentar o detalhamento e as condições de conformidade das histórias de usuário estruturadas no product backlog.

## Histórias de usuário
As tabelas 1 a 7 descrevem as histórias de usuários elicitadas


### HU01 - Autenticação Segura
A tabela 1 mostra a história de usuário 1.

| HU01 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como usuário do sistema (professor, aluno ou administrador), desejo realizar o login seguro na plataforma para garantir a proteção dos meus dados acadêmicos. |
| **Critérios de Aceitação** | - O sistema deve apresentar campos de e-mail/matrícula e senha com validação de formato.<br>- O sistema deve diferenciar as permissões de acesso com base no perfil logado (professor, aluno ou administrador).<br>- Senhas armazenadas no banco de dados devem ser criptografadas de ponta a ponta. |
| **Rastreabilidade** | RQ01, RQ02 |
| **Prioridade** | Alta |
| **Implementado** | Sim |

**Tabela 1:** Autenticação Segura



### HU02 - Gerenciamento de Alunos e Turmas (Administrador)
A tabela 2 mostra a história de usuário 2.

| HU02 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como administrador do sistema, desejo criar, ler, atualizar e deletar (CRUD) turmas, disciplinas e alunos para manter a base de dados acadêmica integrada e atualizada. |
| **Critérios de Aceitação** | - O sistema deve permitir a importação de listas de alunos matriculados via arquivo ou cadastro manual.<br>- O administrador deve conseguir vincular um professor específico a uma ou mais turmas criadas.<br>- Alterações cadastrais devem ser refletidas instantaneamente nos painéis de chamada dos professores vinculados. |
| **Rastreabilidade** | RQ03, RQ04, RQ05 |
| **Prioridade** | Alta |
| **Implementado** | Não |

**Tabela 2:** Gerenciamento de Alunos e Turmas



### HU03 - Registro Digital de Chamada (Professor)
A tabela 3 mostra a história de usuário 3.

| HU03 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como professor, desejo registrar a presença e a falta dos alunos em uma aula prática de forma digital e rápida para eliminar pautas de papel. |
| **Critérios de Aceitação** | - O sistema deve listar todos os alunos da turma em ordem alfabética com seletores visuais de "Presença" ou "Falta".<br>- Deve permitir a inserção de justificativas médicas ou administrativas para faltas específicas.<br>- O fluxo completo de chamada deve ser intuitivo, permitindo a conclusão em menos de 8 minutos sem necessidade de treinamento prévio. |
| **Rastreabilidade** | RQ06, RQ09, RQ20 |
| **Prioridade** | Alta |
| **Implementado** | Não |

**Tabela 3:** Registro Digital de Chamada



### HU04 - Painel Analítico de Frequência (Dashboard)
A tabela 4 mostra a história de usuário 4.

| HU04 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como professor ou coordenador, desejo visualizar um painel gráfico com o total de alunos, aulas ministradas e a taxa de presença para monitorar a assiduidade em tempo real. |
| **Critérios de Aceitação** | - O dashboard deve apresentar gráficos dinâmicos de linha ou barras com o histórico de presença das turmas.<br>- Devem ser exibidos cartões de destaque com alertas para alunos que cruzarem o limite crítico de faltas estipulado pela instituição.<br>- O tempo de renderização dos dados e gráficos na tela deve ser inferior a 2 segundos. |
| **Rastreabilidade** | RQ10, RQ17, RQ22 |
| **Prioridade** | Alta |
| **Implementado** | Não |

**Tabela 4:** Painel Analítico de Frequência

---

### HU05 - Emissão de Relatórios Estatísticos (Coordenação)
A tabela 5 mostra a história de usuário 5.

| HU05 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como coordenador de curso, desejo gerar e exportar relatórios periódicos da frequência de turmas para auditorias internas e tomada de decisões pedagógicas. |
| **Critérios de Aceitação** | - O sistema deve permitir a filtragem de relatórios por disciplina, período letivo, professor ou estudante específico.<br>- Deve disponibilizar a exportação dos dados compilados em formatos padrão de mercado (como PDF ou arquivos de planilha eletrônica CSV). |
| **Rastreabilidade** | RQ11, RQ15 |
| **Prioridade** | Média |
| **Implementado** | Não |

**Tabela 5:** Emissão de Relatórios Estatísticos

---

### HU06 - Acessibilidade Visual e Interface Responsiva
A tabela 6 mostra a história de usuário 6.

| HU06 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como usuário do sistema, desejo acessar a plataforma a partir de dispositivos móveis ou desktops com suporte a modo escuro para garantir uma boa experiência de leitura e acessibilidade visual. |
| **Critérios de Aceitação** | - A interface construída com Tailwind CSS deve adaptar os elementos visuais automaticamente a telas de smartphones, tablets e desktops (responsividade).<br>- O sistema deve disponibilizar um botão global de alternância rápida entre os temas Claro (Light Mode) e Escuro (Dark Mode).<br>- A combinação de cores deve assegurar um contraste mínimo em conformidade com as diretrizes internacionais de acessibilidade web. |
| **Rastreabilidade** | RQ13, RQ18, RQ21 |
| **Prioridade** | Média |
| **Implementado** | Não |

**Tabela 6:** Acessibilidade Visual e Interface Responsiva



### HU07 - Recuperação e Redefinição de Senha
A tabela 7 mostra a história de usuário 7.

| HU07 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como usuário cadastrado, desejo solicitar a redefinição da minha senha através do envio de um link seguro por e-mail para recuperar o acesso à minha conta em caso de esquecimento. |
| **Critérios de Aceitação** | - O sistema deve validar se o e-mail informado existe na base de dados antes de disparar o fluxo.<br>- O link de redefinição enviado por e-mail deve possuir um token com tempo de expiração de no máximo 15 minutos.<br>- A nova senha deve passar por validações de complexidade (mínimo de 8 caracteres, letras e números) antes de ser persistida. |
| **Rastreabilidade** | RQ07, RQ08 |
| **Prioridade** | Alta |
| **Implementado** | Não |

**Tabela 7:** Recuperação e Redefinição de Senha

---

### HU08 - Justificativa de Ausência Acadêmica
A tabela 8 mostra a história de usuário 8.

| HU08 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como professor ou administrador, desejo anexar e registrar justificativas legais (como atestados médicos) no perfil do aluno para abonar faltas sem comprometer o histórico de assiduidade. |
| **Critérios de Aceitação** | - O sistema deve permitir a alteração do status de uma falta para "Falta Justificada" no diário de classe.<br>- Deve disponibilizar um campo de texto para descrição do motivo e inserção do código de arquivamento do documento comprovatório.<br>- O histórico de relatórios deve discriminar claramente as faltas comuns das faltas justificadas. |
| **Rastreabilidade** | RQ14 |
| **Prioridade** | Média |
| **Implementado** | Não |

**Tabela 9:** Justificativa de Ausência Acadêmica

---

### HU09 - Filtros Avançados de Busca e Consulta
A tabela 9 mostra a história de usuário 9.

| HU09 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como professor ou coordenador, desejo filtrar a listagem de alunos por turma, nome, matrícula ou intervalo de datas para localizar registros específicos rapidamente durante auditorias. |
| **Critérios de Aceitação** | - A barra de pesquisa deve executar consultas parciais (por nome ou parte da matrícula) atualizando a listagem em tela em tempo real.<br>- Os filtros por intervalo de datas devem restringir o histórico de chamadas exibido no painel de controle de turmas. |
| **Rastreabilidade** | RQ16 |
| **Prioridade** | Média |
| **Implementado** | Não |

**Tabela 9:** Filtros Avançados de Busca e Consulta

---

### HU10 - Arquitetura de Banco de Dados e Consistência Relacional
A tabela 10 mostra a história de usuário 10.

| HU10 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como desenvolvedor do sistema, desejo modelar uma estrutura de banco de dados robusta e relacional para garantir a integridade dos dados de alunos, turmas e frequências de forma modular. |
| **Critérios de Aceitação** | - O esquema do banco de dados deve utilizar chaves estrangeiras (FK) rígidas para impedir que uma chamada seja vinculada a uma turma ou aluno inexistente.<br>- A remoção de uma turma ou disciplina não deve apagar o histórico de chamadas passadas de forma destrutiva (implementar mecanismos de exclusão lógica ou restrições de integridade). |
| **Rastreabilidade** | RQ11, RQ15 (Restrições de Arquitetura) |
| **Prioridade** | Alta |
| **Implementado** | Não |

**Tabela 10:** Arquitetura de Banco de Dados e Consistência Relacional

---

### HU11 - Desempenho e Tempo de Resposta da API (Back-end)
A tabela 11 mostra a história de usuário 11.

| HU11 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como professor operando o sistema em sala de aula, desejo que as requisições de salvamento e listagem ocorram de forma extremamente ágil para evitar lentidões e filas no laboratório. |
| **Critérios de Aceitação** | - As rotas críticas da API REST construídas em NestJS para o lançamento de chamadas e carregamento de listas devem responder em um tempo inferior a 2 segundos sob condições normais de rede.<br>- O sistema deve implementar paginação de dados nas listagens de alunos para otimizar o tráfego de rede e o consumo de memória no front-end. |
| **Rastreabilidade** | RQ17 (Requisito Não Funcional de Performance) |
| **Prioridade** | Alta |
| **Implementado** | Não |

**Tabela 11:** Desempenho e Tempo de Resposta da API



### HU12 - Segurança da Informação e Controle de Sessão
A tabela 12 mostra a história de usuário 12.

| HU12 | Informações |
| :--- | :--- |
| **Descrição** | Eu, como administrador da instituição, desejo que o sistema invalide sessões inativas e restrinja acessos diretos via URL para impedir que usuários não autenticados visualizem dados sigilosos. |
| **Critérios de Aceitação** | - O sistema deve implementar autenticação baseada em tokens seguros (como JWT) com tempo de expiração definido.<br>- Tentativas de acesso direto a rotas protegidas (como `/dashboard` ou `/admin`) sem um token válido devem redirecionar o usuário imediatamente para a tela de login.<br>- Sessões sem atividade por mais de 30 minutos devem ser encerradas de forma automática pelo sistema. |
| **Rastreabilidade** | RQ02, RQ19 (Requisito Não Funcional de Segurança) |
| **Prioridade** | Alta |
| **Implementado** | Não |

**Tabela 12:** Segurança da Informação e Controle de Sessão



## Bibliografia

<a id="FRM1" href="#anchor_1">1.</a> PRESSMAN, Roger S.; MAXIM, Bruce R.. Engenharia de software: uma abordagem profissional. 8 Porto Alegre: AMGH, 2016, 940 p.


<a id="FRM2" href="#anchor_2">2.</a> Bourque, P., Fairley, R. E. Guide to the Software Engineering Body of Knowledge, Version 3.0. SWEBOK. IEEE Computer Society, 2014. Disponível em: [computer.org](http://www.computer.org/web/swebok/v3). p. 38.


## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 01/06/2026 | Documentação da visão de produto      |  [Geovanna Alves](https://github.com/GeovannaUmbelino) | [Felipe Serikava](https://github.com/felipeserikava-web)  e [Ronan Freitas](https://github.com/HunterBRR)|

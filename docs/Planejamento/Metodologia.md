# Metodologia 

Este documento apresenta a fundamentação teórica sobre metodologia de software e detalha a engenharia organizacional da **Squad Newtons**. Aqui documentamos como nossa equipe se estruturou, comunicou e gerenciou o tempo para superar o desafio entre squads, cumprindo o escopo da consultoria no prazo estipulado de 20 dias úteis.

---

## 1. O que é Metodologia?

Uma **metodologia de desenvolvimento de software** é um framework estruturado utilizado para planejar, estruturar e controlar o processo de desenvolvimento de um sistema de informação. Ela define o "como" o projeto será executado, estabelecendo regras, papéis, ferramentas, fluxos de trabalho e artefatos necessários para transformar uma ideia em um produto final de forma previsível e eficiente.

Para a **Squad Newtons**, a escolha e a adaptação da metodologia foram cruciais para garantir competitividade e excelência nas entregas do desafio, adotando uma abordagem híbrida e ágil, focada em ritmo acelerado, divisão inteligente de gargalos e adaptabilidade.

---

## 2. Estrutura e Organização da Squad (Os Newtons)

Nossa squad foi composta por **3 membros**. Visando a máxima eficiência para o desafio e considerando o prazo reduzido, dividimos as frentes de trabalho de forma dinâmica em Back-end e Front-end:

* **Membro 1 (Focado em Front-end):** Responsável pela interface, estilização com Tailwind CSS, componentização e experiência do usuário no Next.js.
* **Membro 2 (Focado em Back-end):** Responsável pela lógica de servidores, modelagem de banco de dados, APIs e regras de negócio.
* **Membro 3 (Flutuante / Full-Stack):** Atuou como o elemento de sincronia e revezamento (*buffer*) da squad, transitando entre o Back-end e o Front-end conforme a complexidade e os gargalos de cada etapa do projeto.

A divisão das documentações e das funcionalidades foi feita de maneira colaborativa no início de cada ciclo (etapa), garantindo paralelismo nas tarefas e velocidade de entrega.

---

## 3. Comunicação e Alinhamento

Para manter o alinhamento ágil exigido pela dinâmica do desafio entre squads, os Newtons utilizaram dois canais principais:

* **Microsoft Teams:** Utilizado para reuniões síncronas de alinhamento estratégico, alinhamento de arquitetura e revisões de entregas de cada etapa.
* **WhatsApp:** Canal de comunicação instantânea e de alta frequência. Utilizado tanto no grupo oficial da squad para avisos gerais e tomadas de decisão rápidas, quanto em conversas privadas (no privado) para resoluções de bugs e pareamentos rápidos de código.

---

## 4. Gestão de Configuração e Fluxo de Trabalho (Git/GitHub)

Adotamos o **Git** para garantir o histórico e a integridade do código, estabelecendo um fluxo de trabalho (Workflow) rigoroso para que nenhum membro da squad sobrescrevesse o trabalho do outro:

### Estrutura de Branches
* `main`: Ramificação de produção. Contém o produto final consolidado e pronto para o deploy na Vercel.
* `develop`: Ramificação de integração da squad. É onde as funcionalidades prontas de front e back se encontravam para validação técnica.
* **Branches Individuais (Feature Branches):** Cada membro dos Newtons possuía sua própria branch isolada para desenvolver suas tarefas, evitando conflitos diretos durante o desenvolvimento diário.

### Fluxo de Trabalho
1. O desenvolvedor iniciava a funcionalidade/artefato na sua própria branch.
2. Ao finalizar e testar localmente, abria um **Pull Request (PR)** apontando para a branch `develop`.
3. Após o alinhamento da equipe, o merge era feito na `develop`.
4. No fechamento de cada ciclo do desafio, a branch `develop` enviava um PR final para a `main`.

---

## 5. Planejamento e Execução (O Cronograma da Consultoria)

Utilizamos o **Notion** como a central de comando da Squad Newtons, onde mapeamos o cronograma e os artefatos exigidos pelo padrão de consultoria da **EngNet**. O projeto foi concebido desde o rascunho até o deploy final em exatamente **20 dias úteis**, divididos em 4 etapas principais:

| Etapa | Foco Principal | Duração | Artefatos e Entregas Realizadas pelos Newtons |
| :--- | :--- | :--- | :--- |
| **Etapa 1** | Imersão e Concepção do Produto | 4 Dias Úteis | Rich Picture (rabisco frame), Visão do produto, Matriz CSD, Perfil do usuário, Personas e Benchmarking. |
| **Etapa 2** | Design e Backlog | 6 Dias Úteis | Funcionalidades e tarefas (Backlog), *First Things First*, Sitemap, Wireframes, User Flow, Visual Final e Protótipo de baixa fidelidade simulável. |
| **Etapa 3** | Codificação | 10 Dias Úteis | Desenvolvimento do ecossistema de software utilizando **Next.js** + **Tailwind CSS**, com foco em responsividade e metadados. |
| **Etapa 4** | Deploy e Fechamento | 3 Dias Úteis | Realização do Deploy na plataforma **Vercel**, auditoria do repositório final no GitHub e entrega formal da consultoria. |
| 

## Bibliografia
# Referências Bibliográficas

<a id="FRM1" href="#anchor_1">1.</a> **ENGNET CONSULTORIA.** *Artefatos da Consultoria: Diretrizes, Modelos e Processos de Gerência de Projetos*. Brasília: Distrito Federal, 2026. Documento interno disponibilizado via plataforma Notion. Acesso em: 14 jun. 2026.




## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 05/06/2026 | Documentação da Metodologia   |  [Geovanna Alves](https://github.com/GeovannaUmbelino) | [Felipe Serikava](https://github.com/felipeserikava-web)  e [Ronan Freitas](https://github.com/HunterBRR)|
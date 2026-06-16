# Diagrama de Casos de Uso 

Este documento apresenta a fundamentação teórica sobre o **Diagrama de Casos de Uso UML** com base nas referências do Lucidchart, detalhando seus elementos, importância e as diretrizes seguidas pela **Squad Newtons** para a modelagem dos requisitos funcionais da nossa consultoria.

---

## O que é um Diagrama de Casos de Uso?

Na Linguagem de Modelagem Unificada (UML), o **Diagrama de Casos de Uso** sintetiza os detalhes dos usuários do sistema (conhecidos como **atores**) e as interações deles com a aplicação. O objetivo principal é demonstrar visualmente as diferentes maneiras pelas quais um usuário externo pode interagir com o sistema para atingir uma meta específica.

Um bom diagrama de casos de uso ajuda a nossa equipe a mapear e discutir:
*   **Cenários reais:** Contextos em que o sistema ou aplicativo interage com pessoas, organizações ou sistemas externos.
*   **Metas do usuário:** O que cada entidade busca alcançar ao interagir com a aplicação.
*   **Escopo do sistema:** Delimitação visual clara do que faz parte do software e o que é externo a ele.


---

## Elementos Principais do Diagrama

A notação gráfica adotada pela squad baseia-se em quatro componentes essenciais:

*   **Atores (Bonecos Palito):** Representam os usuários ou sistemas externos que interagem com a nossa aplicação. Os atores podem ser **primários** (aqueles que iniciam a ação no sistema) ou **secundários** (aqueles que reagem ou consomem os dados produzidos).
*   **Casos de Uso (Formas Ovais Horizontais):** Representam as funcionalidades, tarefas ou ações específicas que acontecem dentro do sistema. Devem ser sempre rotulados com verbos no infinitivo (ex: *Fazer Login*, *Cadastrar Produto*).
*   **Limite do Sistema (Caixa de Escopo):** Uma caixa que envolve todos os casos de uso. Tudo o que está dentro da caixa pertence ao escopo de desenvolvimento do software; o que está fora é considerado ambiente externo.
*   **Associações (Linhas Conectoras):** Linhas que conectam os atores aos seus respectivos casos de uso, evidenciando quem tem permissão para executar qual tarefa.

### Relacionamentos Avançados entre Casos de Uso:
1.  **Inclusão (`<<include>>`):** Quando um caso de uso obrigatoriamente precisa acionar outro para ser concluído (ex: *Finalizar Compra* inclui *Validar Cartão*).
2.  **Extensão (`<<extend>>`):** Quando um caso de uso pode opcionalmente acionar um comportamento extra sob condições específicas (ex: *Emitir Recibo* estende *Realizar Pagamento*).
3.  **Generalização (Herança):** Quando existem atores ou casos de uso gerais que compartilham propriedades com versões mais especializadas.

---

## Construção 
Para criar o diagrama de casos de uso da nossa consultoria utilizando a ferramenta **Lucidchart**, os Newtons seguiram as seguintes etapas práticas:

1.  **Definição do Limite:** Inserimos a forma retangular de limite do sistema para delimitar as fronteiras do nosso software Next.js.
2.  **Identificação dos Atores:** Mapeamos quem são as personas e os sistemas externos (como APIs ou o banco de dados) que interagem com o sistema.
3.  **Mapeamento de Funcionalidades:** Listamos os casos de uso essenciais baseados no backlog da **Etapa 2** da nossa consultoria, ordenando-os logicamente.
4.  **Conexão e Refinamento:** Traçamos as linhas de associação e especificamos onde eram necessários os relacionamentos de `<<include>>` ou `<<extend>>`.

Abaixo está a representação visual do diagrama de casos de uso desenvolvido pela nossa equipe para o desafio:

<font size="3"><p  align="center" style="text-align: center">Figura 1: Diagrama de caso de uso.</p></font>

![Diagrama de Casos de Uso da Squad](../img/WhatsApp%20Image%202026-06-15%20at%2019.18.23.jpeg)

<font size="3"><p  align="center" style="text-align: center">Fonte: [Ronan Freitas](https://github.com/HunterBRR)</p></font>
---

## Bibliografia 

<a id="FRM1" href="#anchor_1">1.</a> Para aprofundamento técnico e consultas sobre modelagem UML, utilizamos as diretrizes oficiais:
**LUCIDCHART.** *Diagrama de caso de uso UML: O que é, como fazer e exemplos*. Disponível em: <https://www.lucidchart.com>. Acesso em: 16 jun. 2026.



## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 05/06/2026 | Documentação do diagrama de caso de uso      |  [Ronan Freitas](https://github.com/HunterBRR) | [Felipe Serikava](https://github.com/felipeserikava-web) |
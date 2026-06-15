# Diagrama de Entidade e Relacionamento 

## Introdução
O Diagrama Entidade Relacionamento (DER), configura-se como uma ferramenta conceitual fundamental na Engenharia de Software para descrever e organizar a estrutura de dados de um domínio de negócios. Este documento descreve a especificação estrutural do banco de dados relacionada ao projeto Acessa.io. O diagrama foi desenvolvido a partir da análise de requisitos, com o intuito de mapear os objetos reais ou lógicos envolvidos (entidades), suas características inerentes (atributos) e as regras que definem como eles interagem entre si (relacionamentos) <a id="REF1" href="#anchor_1">[1]</a>.

O objetivo é apresentar, de forma visual e abstrata, a arquitetura que fundamentará a base de dados da aplicação. Adotando uma abordagem centrada nas regras de negócio e na integridade das informações, a documentação visa traduzir as necessidades do sistema em um esquema lógico, facilitando a comunicação clara entre analistas e a equipe de desenvolvimento responsável pela implementação.

## Metodologia
Os requisitos levantados foram analisados e transformados em um modelo conceitual detalhado, com foco em garantir que as informações da empresa fossem armazenadas de maneira eficiente e sem redundâncias. Cada elemento do domínio foi devidamente classificado para estabelecer uma fundação sólida antes da criação física do banco de dados, equilibrando normalização estrutural e desempenho.

Para organizar esses dados, optamos pela notação do Diagrama Entidade Relacionamento (DER), que utiliza uma linguagem visual padronizada. As entidades foram definidas com seus respectivos atributos listados internamente (notação atualizada inspirada na UML), e os relacionamentos foram delineados com suas devidas cardinalidades.

A Seguir temos o diagrama de entidade e relacionamento desenvolvido.

<font size="3"><p  align="center" style="text-align: center">Figura 1: Diagrama de entidade e relacionamento.</p></font>

<div align="center">
  <img src="https://i.postimg.cc/d3TdMZ4H/DER-(2).png" alt="Diagrama">
</div>

<font size="3"><p  align="center" style="text-align: center">Fonte:  [Felipe Serikava](https://github.com/felipeserikava-web).</p></font>

Para garantir padronização e servir como referência na elaboração e leitura do diagrama, foi criado um modelo a ser seguido, apresentado na legenda.

<font size="3"><p  align="center" style="text-align: center">Figura  3: Legenda .</p></font>

<div align="center">
  <img src="https://i.postimg.cc/ZKsks91S/Legendader.png" alt="Legendav1">
</div>

<font size="3"><p  align="center" style="text-align: center">Fonte:  [Felipe Serikava](https://github.com/felipeserikava-web).</p></font>

## Bibliografia
> <a id="REF1" href="#anchor_1">1.</a>. DEVMEDIA. Modelo Entidade Relacionamento. DevMedia, 2014. Disponível em: <[https://www.devmedia.com.br/mer-e-der-modelagem-de-bancos-de-dados/14332]>. Acesso em: 14 de junho de 2026.


## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 14/06/2026 | Documentação do DER    | [Felipe Serikava](https://github.com/felipeserikava-web) | [Geovanna Alves](https://github.com/GeovannaUmbelino) |

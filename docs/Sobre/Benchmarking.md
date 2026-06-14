# Benchmarking

## Introdução
O Benchmarking tem como objetivo analisar produtos, serviços ou sistemas semelhantes já existentes no mercado para identificar boas práticas, pontos fortes e oportunidades de melhoria. Na engenharia de produto do S.G.F.T. (Sistema de Gestão de Frequência e Turmas), esta etapa é fundamental, compreender os padrões de usabilidade consolidados no cenário educacional, mitigar erros recorrentes em sites com o mesmo proposito e garantir que a nosso projeto entregue diferenciais claros e competitivos frente ao mercado.

## Metodologia 
A pesquisa e estruturação desta matriz comparativa baseou-se na técnica de **Análise Competitiva de Mercado**, uma vertente da engenharia de produto que mapeia o ecossistema de soluções nas categorias de concorrentes diretos e indiretos:

1. **Critérios de Seleção de Alvos:** Foram selecionados três perfis distintos de sistemas educacionais para amostragem: um ERP acadêmico de grande porte de uso governamental/universitário SIGAA, um Ambiente Virtual de Aprendizagem assíncrono baseado em código aberto (Moodle) e uma solução comercial focada em gerenciamento simplificado (Google Classroom).
2. **Definição de Métricas de Rigor:** Os critérios avaliados foram pareados de forma a rastrear o comportamento das plataformas sob a ótica dos **22 Requisitos Elicitados** do projeto. 


## Matriz Comparativa de Mercado
Abaixo, comparamos os principais sistemas acadêmicos e ferramentas comerciais atuais com o escopo do S.G.F.T.:

| Critério / Concorrente | SIGAA | Moodle | Google Classroom | **S.G.F.T. (Nossa Solução)** |
| :--- | :--- | :--- | :--- | :--- |
| **Preço** | Gratuito (Desenvolvimento próprio / Governamental) | Gratuito (Código aberto) / Planos enterprise para servidores | Gratuito para escolas / Planos corporativos Google Workspace | Desenvolvimento sob demanda  |
| **Funcionalidades Principais** | Gestão de matrícula, histórico escolar, notas e diário de classe global. | Postagem de materiais didáticos, fóruns, tarefas e avaliações assíncronas. | Criação de turmas virtuais, atribuição de notas e entrega de atividades integradas. | CRUD de turmas, controle digital de presença, dashboard analítico e relatórios exportáveis. |
| **Diferenciais** | Centralização total dos dados da instituição em um único banco de dados. | Alta capacidade de customização através de plugins e ferramentas pedagógicas. | Integração nativa e fluida com todo o ecossistema Google (Drive, Meet, Docs). | Foco absoluto em aulas práticas, combate antifraude em tempo real e modo escuro nativo. |
| **Pontos Fortes** | Solução robusta para controle de grandes fluxos administrativos e acadêmicos. | Excelente para repositório de conteúdos e acompanhamento de tarefas a longo prazo. | Interface extremamente limpa, intuitiva e de curtíssima curva de aprendizado. | Interface web ultra-responsiva, carregamento ágil (< 2s) e linguagem simples sem jargões. |
| **Pontos Fracos** | Interface antiga e confusa; excesso de cliques para realizar uma simples chamada. | Módulo de presença complexo de configurar; telas poluídas e confusas para o professor. | Controle de faltas muito básico e superficial; falta de relatórios de assiduidade laboratorial. | Escopo inicial restrito (não realiza gestão de notas ou envio de arquivos didáticos). |
| **Feedback de Usuários** | Reclamações constantes sobre lentidão, instabilidade e burocracia excessiva nos fluxos. | Professores acham a plataforma engessada e poluída; exige treinamento prévio para uso. | Muito elogiado pela simplicidade, mas considerado incompleto para gestão de presença real. | Focado na autonomia: fluxos principais executados em até 8 minutos sem treinamento. |
| **Observações Gerais** | Focado em grandes organizações públicas, sacrificando totalmente a experiência do usuário. | Ótimo ambiente virtual de aprendizagem, mas falha no dinamismo de aulas práticas presenciais. | Excelente ponto de entrada para comunicação, mas não escala como controlador de frequência acadêmica. | Desenvolvido sob medida para eliminar papel, automatizar processos e extinguir fraudes laboratoriais.|

## Conclusão e Diferenciais

A partir do mapeamento do mercado, o Squad Newtons consolidou os seguintes direcionamentos estratégicos e técnicos para o desenvolvimento do S.G.F.T.:

- Guerra à Burocracia: Diferente do SUAP, o painel do professor no S.G.F.T. será focado em cliques rápidos para presença/falta e salvamento instantâneo, reduzindo o tempo operacional de controle de turmas com grande volume de estudantes.
- Mitigação de Fraudes e Segurança Dinâmica: Enquanto os sistemas tradicionais aceitam assinaturas retroativas ou listas em papel facilmente burláveis, nossa aplicação contará com autenticação segura e registro digital datado e indexado no banco de dados.

- Engenharia de Dados e Visualização Avançada: O S.G.F.T. preencherá a lacuna de relatórios fracos do mercado através de um painel estatístico com gráficos dinâmicos de assiduidade e algoritmos que emitem alertas preditivos de baixa frequência para alunos em situação de risco de reprovação.

- Performance Limpa e Acessibilidade: Foco total na velocidade de carregamento (métricas de desempenho rígidas com tempos de carregamento de páginas críticas inferiores a 2 segundos) e interface com suporte nativo a Dark Mode e acessibilidade digital multiplataforma.


## Bibliografia 
<a id="FRM1" href="#anchor_1">1.</a>  FIA BUSINESS SCHOOL. **Benchmarking: o que é, objetivo, tipos, como fazer e exemplos**. Blog FIA. Disponível em: <https://fia.com.br/blog/benchmarking-o-que-e-objetivo-tipos-como-fazer-e-exemplos/>. Acesso em: 2026.



## Histórico de Versões

| Versão | Data       | Descrição                                     | Autor                                                                                                                                                                                                                                                                                                      | Revisor                                               |
| ------ | ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1.0    | 05/06/2026 | Documentação do benchmarking      |  [Geovanna Alves](https://github.com/GeovannaUmbelino) | [Felipe Serikava](https://github.com/felipeserikava-web)  e [Ronan Freitas](https://github.com/HunterBRR)|




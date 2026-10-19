# LensLab — Captura Inteligente

Aplicação web desenvolvida para a atividade **Câmera, Canvas e MediaDevices** de Programação Front-End.

## Integrantes
- Nome do aluno: Cainan Bastos Da Silva


## Descrição
O LensLab permite ativar a câmera do dispositivo, visualizar o vídeo em tempo real, selecionar um filtro visual, capturar uma fotografia e inserir na própria imagem o nome informado e a data/hora da captura. A imagem processada pode ser baixada em PNG.

## Recursos utilizados
- **MediaDevices / `getUserMedia()`**: solicita acesso à câmera.
- **MediaStream / `getTracks()` / `stop()`**: encerra as faixas da câmera para liberar o recurso.
- **Canvas 2D**: processa a imagem capturada.
- **`context.filter`**: aplica filtros sépia, escala de cinza, invertido ou original.
- **`context.fillText()`**: escreve o nome do aluno e a data/hora sobre a fotografia.
- **HTML, CSS e JavaScript puro**: interface e interações sem bibliotecas de câmera.
- **`canvas.toBlob()`**: gera o arquivo final em PNG para visualização e download.

## Como executar
1. Extraia a pasta do projeto.
2. Abra a pasta no VS Code.
3. Execute com uma extensão de servidor local, como Live Server, ou utilize um servidor local.
4. Abra a página em `localhost` ou em um endereço HTTPS.
5. Clique em **Ligar câmera** e permita o acesso à câmera.
6. Informe o nome, escolha o filtro e clique em **Capturar foto**.
7. Clique em **Baixar imagem** para salvar o resultado.

> Por segurança, navegadores normalmente exigem HTTPS ou `localhost` para acessar a câmera. A permissão de câmera precisa ser concedida pelo usuário.

## Requisitos atendidos
- [x] Acesso à câmera e visualização ao vivo.
- [x] Captura da imagem exibida.
- [x] Filtro visual aplicado via Canvas.
- [x] Nome e data/hora incorporados à fotografia.
- [x] Visualização e download da imagem processada.
- [x] Botões para ligar e desligar a câmera.
- [x] Encerramento de todas as tracks do stream.
- [x] Mensagens de orientação e tratamento de erros.

## Repositório
Sugestão de nome: `Camera_PFE`

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startCamera");
const stopButton = document.getElementById("stopCamera");
const captureButton = document.getElementById("captureButton");
const downloadButton = document.getElementById("downloadButton");
const studentNameInput = document.getElementById("studentName");
const message = document.getElementById("message");
const statusPill = document.querySelector(".status-pill");
const statusText = document.getElementById("statusText");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");
const capturedImage = document.getElementById("capturedImage");
const resultContent = document.getElementById("resultContent");
const resultNote = document.getElementById("resultNote");

let cameraStream = null;
let selectedFilter = "sepia(1)";
let latestImageUrl = null;

function setMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#ff9bb0" : "";
}

function setCameraUI(isOn) {
  statusPill.classList.toggle("on", isOn);
  statusText.textContent = isOn ? "Câmera ligada" : "Câmera desligada";
  cameraPlaceholder.hidden = isOn;
  startButton.disabled = isOn;
  stopButton.disabled = !isOn;
  captureButton.disabled = !isOn;
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setMessage("Seu navegador não oferece acesso à câmera neste contexto. Use HTTPS ou localhost e tente novamente.", true);
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });
    video.srcObject = cameraStream;
    await video.play();
    setCameraUI(true);
    setMessage("Câmera ativa. Escolha um filtro e clique em “Capturar foto”.");
  } catch (error) {
    cameraStream = null;
    setCameraUI(false);
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      setMessage("Permissão negada. Autorize o uso da câmera nas configurações do navegador e tente novamente.", true);
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      setMessage("Nenhuma câmera foi encontrada neste dispositivo.", true);
    } else {
      setMessage("Não foi possível iniciar a câmera. Verifique se ela está conectada e se outro aplicativo não está usando-a.", true);
    }
  }
}

function stopCamera() {
  if (cameraStream) {
    // Encerra TODAS as faixas do stream para liberar corretamente o hardware.
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  video.pause();
  video.srcObject = null;
  setCameraUI(false);
  setMessage("Câmera desligada e recursos liberados. Você pode ligá-la novamente quando quiser.");
}

function drawLabel(text, x, y, fontSize, maxWidth) {
  context.font = `600 ${fontSize}px system-ui, sans-serif`;
  context.textBaseline = "top";
  context.fillStyle = "#ffffff";
  context.shadowColor = "rgba(0,0,0,.7)";
  context.shadowBlur = 5;
  context.fillText(text, x, y, maxWidth);
  context.shadowBlur = 0;
}

function capturePhoto() {
  if (!cameraStream || !video.videoWidth || !video.videoHeight) {
    setMessage("Ligue a câmera e aguarde a imagem aparecer antes de capturar.", true);
    return;
  }

  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // O filtro é aplicado ao desenhar o vídeo no Canvas.
  context.save();
  context.filter = selectedFilter;
  context.drawImage(video, 0, 0, width, height);
  context.restore();
  context.filter = "none";

  const name = studentNameInput.value.trim() || "Aluno não identificado";
  const capturedAt = new Date();
  const dateTime = capturedAt.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

  const padding = Math.max(18, Math.round(width * 0.025));
  const bandHeight = Math.max(78, Math.round(height * 0.16));

  // Faixa escura para manter a identificação legível sobre a fotografia.
  const gradient = context.createLinearGradient(0, height - bandHeight, 0, height);
  gradient.addColorStop(0, "rgba(10,12,20,0.35)");
  gradient.addColorStop(1, "rgba(10,12,20,0.88)");
  context.fillStyle = gradient;
  context.fillRect(0, height - bandHeight, width, bandHeight);

  context.fillStyle = "#b9adff";
  context.fillRect(padding, height - bandHeight + padding, 4, bandHeight - padding * 2);

  const mainFont = Math.max(16, Math.round(width * 0.035));
  const smallFont = Math.max(12, Math.round(width * 0.022));
  drawLabel(name, padding + 16, height - bandHeight + padding, mainFont, width - padding * 2 - 20);
  context.fillStyle = "#e0e3ed";
  context.font = `400 ${smallFont}px system-ui, sans-serif`;
  context.textBaseline = "top";
  context.fillText(`Capturado em ${dateTime}`, padding + 16, height - bandHeight + padding + mainFont + 8, width - padding * 2 - 20);

  if (latestImageUrl) URL.revokeObjectURL(latestImageUrl);
  canvas.toBlob((blob) => {
    if (!blob) {
      setMessage("Não foi possível processar a imagem. Tente novamente.", true);
      return;
    }
    latestImageUrl = URL.createObjectURL(blob);
    capturedImage.src = latestImageUrl;
    capturedImage.hidden = false;
    const emptyResult = resultContent.querySelector(".empty-result");
    if (emptyResult) emptyResult.hidden = true;
    downloadButton.disabled = false;
    resultNote.textContent = `Captura processada com filtro ${selectedFilter === "none" ? "Original" : selectedFilter}. Identificação e data/hora foram incorporadas à imagem.`;
    setMessage("Foto capturada e processada com sucesso!");
  }, "image/png");
}

function downloadPhoto() {
  if (!latestImageUrl) return;
  const link = document.createElement("a");
  link.href = latestImageUrl;
  link.download = "lenslab-captura.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

startButton.addEventListener("click", startCamera);
stopButton.addEventListener("click", stopCamera);
captureButton.addEventListener("click", capturePhoto);
downloadButton.addEventListener("click", downloadPhoto);

document.querySelectorAll(".filter-option").forEach((button) => {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;

    document.querySelectorAll(".filter-option").forEach((option) => {
      option.classList.toggle("active", option === button);
    });

    // Aplica o filtro também à visualização ao vivo.
    video.style.filter =
      selectedFilter === "none" ? "none" : selectedFilter;

    setMessage(
      `Filtro selecionado: ${
        button.textContent.trim()
      }. Capture uma foto para salvar o efeito.`
    );
  });
});

window.addEventListener("beforeunload", () => {
  if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
});

setCameraUI(false);

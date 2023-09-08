const video = document.getElementById('video');
const startButton = document.getElementById('startButton');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const barcodeResult = document.getElementById('barcodeResult');

let stream;

// Configuración de QuaggaJS
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: video,
        constraints: {
            facingMode: "environment" // Utiliza la cámara trasera
        },
    },
    decoder: {
        readers: ["code_128_reader", "ean_reader", "upc_reader"],
    },
});

startButton.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
            }
        });

        video.srcObject = stream;
        startButton.disabled = true;
        captureButton.disabled = false;

        // Inicia la detección de códigos de barras con QuaggaJS
        Quagga.start();
    } catch (error) {
        console.error('Error al acceder a la cámara trasera: ', error);
    }
});

captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    photo.src = canvas.toDataURL('image/png');
});

// Agrega un oyente para manejar los resultados de la detección de códigos de barras
Quagga.onDetected((result) => {
    const code = result.codeResult.code;
    barcodeResult.textContent = "Código de barras detectado: " + code;
});

window.addEventListener('beforeunload', () => {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
});

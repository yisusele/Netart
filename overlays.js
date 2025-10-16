const overlayLeft = document.querySelector('.overlay');
const overlayRight = document.querySelector('.overlay2');

[overlayLeft, overlayRight].forEach(overlay => {
  overlay.style.position = 'absolute';
  overlay.style.opacity = 0;
  overlay.style.transition = 'opacity 2s ease';
  overlay.style.pointerEvents = 'none';
});

// Fijamos las esquinas
overlayLeft.style.left = '3vw';
overlayLeft.style.bottom = '3vh';
overlayRight.style.right = '3vw';
overlayRight.style.bottom = '3vh';

function fadeOverlay(overlay) {
  overlay.style.opacity = 0.8;
  setTimeout(() => {
    overlay.style.opacity = 0;
  }, 10000 + Math.random() * 9000);
}

setInterval(() => {
  fadeOverlay(overlayLeft);
  fadeOverlay(overlayRight);
}, 4000);

// Aparición inicial
fadeOverlay(overlayLeft);
fadeOverlay(overlayRight);

const overlayLeft = document.querySelector('.overlay');
const overlayRight = document.querySelector('.overlay2');

[overlayLeft, overlayRight].forEach(overlay => {
  overlay.style.position = 'absolute';
  overlay.style.opacity = 0;
  overlay.style.transition = 'opacity 2s ease';
  overlay.style.pointerEvents = 'none';
});

if (!/Mobi|Android/i.test(navigator.userAgent)) {
  overlayLeft.style.left = '3vw';
  overlayLeft.style.bottom = '3vh';
  overlayRight.style.right = '3vw';
  overlayRight.style.bottom = '3vh';
} else {
  overlayLeft.style.left = '50%';
  overlayLeft.style.top = '5vh';
  overlayLeft.style.transform = 'translateX(-50%)';
  overlayRight.style.left = '50%';
  overlayRight.style.bottom = '5vh';
  overlayRight.style.transform = 'translateX(-50%)';
}


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

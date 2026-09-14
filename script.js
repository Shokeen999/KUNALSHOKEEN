const html = document.documentElement;
const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => (
  `./frames/frame_${index.toString().padStart(6, '0')}.jpg`
);

const images = [];
let imagesLoaded = 0;
let currentFrameIndex = 0;

function updateCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  context.scale(dpr, dpr);
  renderFrame(currentFrameIndex);
}

function renderFrame(index) {
  let img = images[index];
  
  if (!img || !img.complete || img.naturalWidth === 0) {
    for (let offset = 1; offset < frameCount; offset++) {
      const prev = images[index - offset];
      if (prev && prev.complete && prev.naturalWidth > 0) {
        img = prev;
        break;
      }
      const next = images[index + offset];
      if (next && next.complete && next.naturalWidth > 0) {
        img = next;
        break;
      }
    }
  }

  if (!img || !img.complete || img.naturalWidth === 0) return;
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  
  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  
  let drawWidth, drawHeight, offsetX, offsetY;
  if (canvasRatio > imgRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    drawWidth = canvasHeight * imgRatio;
    drawHeight = canvasHeight;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }
  
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
  img.onload = () => {
    imagesLoaded++;
    if (i === 1 || imagesLoaded === 1) {
      updateCanvasSize();
    } else {
      renderFrame(currentFrameIndex);
    }
  };
}

window.addEventListener('resize', updateCanvasSize);

let ticking = false;

window.addEventListener('scroll', () => {  
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollTop = html.scrollTop || document.body.scrollTop;
      const maxScrollTop = (html.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      
      if (maxScrollTop > 0) {
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(scrollFraction * frameCount))
        );
        
        if (frameIndex !== currentFrameIndex) {
          currentFrameIndex = frameIndex;
          renderFrame(currentFrameIndex);
        }
      }
      ticking = false;
    });
    ticking = true;
  }
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  updateCanvasSize();
} else {
  window.addEventListener('DOMContentLoaded', updateCanvasSize);
}

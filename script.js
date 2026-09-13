const html = document.documentElement;
const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

const frameCount = 300;
const currentFrame = index => (
  `./frames/frame_${index.toString().padStart(4, '0')}.jpg`
)

const images = [];
let imagesLoaded = 0;

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
  img.onload = () => {
    imagesLoaded++;
    if (i === 1) { 
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
    }
  };
}

let lastFrameIndex = -1;
let ticking = false;

window.addEventListener('scroll', () => {  
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollTop = html.scrollTop;
      const maxScrollTop = html.scrollHeight - window.innerHeight;
      
      if (maxScrollTop > 0) {
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(scrollFraction * frameCount)
        );
        
        if (frameIndex !== lastFrameIndex && images[frameIndex] && images[frameIndex].complete) {
          context.drawImage(images[frameIndex], 0, 0);
          lastFrameIndex = frameIndex;
        }
      }
      ticking = false;
    });
    ticking = true;
  }
});

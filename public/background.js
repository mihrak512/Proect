// Проверка: если canvas уже инициализирован — не повторять
if (!window.__backgroundCanvasInitialized) {
    window.__backgroundCanvasInitialized = true;
  
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.style.position = 'fixed';
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.zIndex = -1;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      let circles = [];
  
      for (let i = 0; i < 25; i++) {
        circles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 30 + 10,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          color: `rgba(0, 150, 136, ${Math.random() * 0.4 + 0.2})`
        });
      }
  
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(c => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fillStyle = c.color;
          ctx.fill();
          c.x += c.dx;
          c.y += c.dy;
  
          if (c.x < 0 || c.x > canvas.width) c.dx *= -1;
          if (c.y < 0 || c.y > canvas.height) c.dy *= -1;
        });
        requestAnimationFrame(animate);
      }
  
      animate();
    } else {
      console.warn('backgroundCanvas не найден на странице');
    }
  }
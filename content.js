function inlineStyles() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(stylesheet => {
      const href = stylesheet.href;
      if (href.startsWith(location.origin)) {
        fetch(href)
          .then(response => response.text())
          .then(css => {
            const styleTag = document.createElement("style");
            styleTag.textContent = css;
            document.head.appendChild(styleTag);
            stylesheet.remove();
          })
          .catch(err => console.warn("Fetch failed:", href, err));
      }
    });
  }
  
  function inlineImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.src.startsWith(location.origin)) return;
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = img.src;
  
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        try {
          const base64Image = canvas.toDataURL();
          img.src = base64Image;
        } catch (e) {
          console.warn('Failed to convert image:', img.src);
        }
      };
    });
  }
  
  function injectStatusBar() {
    const statusBar = document.createElement("div");
    statusBar.id = "custom-status-bar";
    statusBar.style.position = "fixed";
    statusBar.style.bottom = "0";
    statusBar.style.left = "0";
    statusBar.style.padding = "4px 8px";
    statusBar.style.fontSize = "12px";
    statusBar.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    statusBar.style.color = "#fff";
    statusBar.style.zIndex = "9999";
    statusBar.style.fontFamily = "monospace";
    statusBar.style.pointerEvents = "none";
    statusBar.style.maxWidth = "100%";
    statusBar.textContent = "";
    document.body.appendChild(statusBar);
  
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('mouseover', () => {
        statusBar.textContent = link.href;
      });
      link.addEventListener('mouseout', () => {
        statusBar.textContent = '';
      });
    });
  }
  
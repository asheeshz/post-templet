/* ===== START: Screen Focus Cosmos Widget JS (v1.4 - Prefix: sfcw-) ===== */
/* निर्देश: इस JS कोड को ब्लॉगर थीम के मुख्य JS स्थान (आमतौर पर </body> से पहले) में डालें। */
/* <script> टैग्स का उपयोग न करें। */

document.addEventListener('DOMContentLoaded', function() {

    // --- कॉपीराइट वर्ष अपडेट करें ---
    const sfcwYearSpan = document.getElementById('sfcw-current-year'); // Prefixed ID
    if (sfcwYearSpan) {
      sfcwYearSpan.textContent = " " + new Date().getFullYear();
    }

    // --- कण कैनवास सेटअप ---
    const sfcwCanvas = document.getElementById('sfcw-particle-canvas'); // Prefixed ID
     if (!sfcwCanvas) {
          // console.error("SFCW Particle canvas element not found!"); // त्रुटि लॉगिंग वैकल्पिक
          return; // कैनवास नहीं है तो आगे न बढ़ें
     }
    const sfcwCtx = sfcwCanvas.getContext('2d');
    let sfcwParticles = [];
    let sfcwAnimationFrameId = null; // एनिमेशन फ्रेम आईडी स्टोर करने के लिए

    function sfcwResizeCanvas() { // Prefixed function name
        sfcwCanvas.width = sfcwCanvas.offsetWidth;
        sfcwCanvas.height = sfcwCanvas.offsetHeight;
    }

    // कण ऑब्जेक्ट क्लास (Prefixed)
    class SFCW_Particle { // Prefixed class name
        constructor(x, y) {
            this.x = x || Math.random() * sfcwCanvas.width;
            this.y = y || Math.random() * sfcwCanvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() * 1 - 0.5) * 0.5;
            this.speedY = (Math.random() * 1 - 0.5) * 0.5;
            // CSS वेरिएबल्स से रंग प्राप्त करें
            const rootStyle = getComputedStyle(document.documentElement);
            const starColor = rootStyle.getPropertyValue('--sfcw-star-color').trim() || 'rgba(240, 248, 255, 0.85)';
            const particleColor = rootStyle.getPropertyValue('--sfcw-particle-color').trim() || 'rgba(0, 160, 160, 0.5)';
            this.color = Math.random() > 0.1 ? starColor : particleColor;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.initialOpacity = this.opacity;
            this.life = Math.random() * 2 + 1;
            this.initialLife = this.life;
        }
        update(deltaTime) {
            this.x += this.speedX * deltaTime * 30;
            this.y += this.speedY * deltaTime * 30;
            this.life -= deltaTime;
            if (this.life <= 0) {
                 this.opacity = 0;
                 if (this.life <= -0.5) { this.reset(); }
            } else {
                 this.opacity = this.initialOpacity * (0.6 + Math.abs(Math.sin( (this.initialLife - this.life) * Math.PI / this.initialLife ) * 0.4));
            }
            // किनारों से धीरे से वापस मोड़ें
            if (this.x <= 0 || this.x >= sfcwCanvas.width) {
                this.speedX *= -1;
                this.x = Math.max(1, Math.min(this.x, sfcwCanvas.width - 1)); // थोड़ा अंदर रखें
            }
            if (this.y <= 0 || this.y >= sfcwCanvas.height) {
                this.speedY *= -1;
                this.y = Math.max(1, Math.min(this.y, sfcwCanvas.height - 1)); // थोड़ा अंदर रखें
            }
        }
        reset() {
            this.x = Math.random() * sfcwCanvas.width;
            this.y = Math.random() * sfcwCanvas.height;
            this.opacity = this.initialOpacity;
            this.life = this.initialLife;
            this.speedX = (Math.random() * 1 - 0.5) * 0.5;
            this.speedY = (Math.random() * 1 - 0.5) * 0.5;
        }
        draw() {
            if (this.opacity <= 0) return; // अदृश्य कणों को न बनाएं
            sfcwCtx.globalAlpha = this.opacity;
            sfcwCtx.fillStyle = this.color;
            sfcwCtx.beginPath();
            sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            sfcwCtx.fill();
        }
    }

    function sfcwInitParticles() { // Prefixed function name
        sfcwParticles = [];
        let numberOfParticles = Math.floor(sfcwCanvas.width * sfcwCanvas.height / 15000);
        numberOfParticles = Math.max(50, Math.min(numberOfParticles, 150));
        for (let i = 0; i < numberOfParticles; i++) {
            sfcwParticles.push(new SFCW_Particle()); // Use prefixed class
        }
    }

    let sfcwLastTime = 0;
    function sfcwAnimateParticles(timestamp) { // Prefixed function name
         if (document.hidden) { // यदि टैब निष्क्रिय है तो एनिमेशन रोकें
             sfcwLastTime = timestamp;
             sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); // लूप जारी रखें
             return;
         }

        const deltaTime = (timestamp - sfcwLastTime) / 1000;
        sfcwLastTime = timestamp;

        sfcwCtx.clearRect(0, 0, sfcwCanvas.width, sfcwCanvas.height);
        sfcwParticles.forEach(p => {
             if (deltaTime > 0 && deltaTime < 0.1) { // वैध डेल्टा टाइम
                 p.update(deltaTime);
             } else if (deltaTime >= 0.1) { // बड़ा अंतराल
                 p.reset(); // कणों को रीसेट करें ताकि वे अटके नहीं
             }
             p.draw();
        });
        sfcwCtx.globalAlpha = 1.0; // अल्फा रीसेट करें
        sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); // अगला फ्रेम
    }

    function sfcwStartAnimation() { // Start function
        sfcwResizeCanvas(); // आकार सेट करें
        sfcwInitParticles(); // कण बनाएं
        if (sfcwAnimationFrameId) { // यदि पहले से चल रहा है तो रोकें
             cancelAnimationFrame(sfcwAnimationFrameId);
        }
        sfcwLastTime = performance.now(); // टाइमर रीसेट करें
        sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); // एनिमेशन शुरू करें
    }

    // थोड़ा विलंब से एनिमेशन शुरू करें
    const sfcwStartDelay = setTimeout(sfcwStartAnimation, 100);

    // विंडो रीसाइज़ हैंडलर
    let sfcwResizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(sfcwResizeTimeout);
        sfcwResizeTimeout = setTimeout(() => {
             // मौजूदा एनिमेशन रोकें और पुनः आरंभ करें
             if (sfcwAnimationFrameId) {
                 cancelAnimationFrame(sfcwAnimationFrameId);
             }
             sfcwStartAnimation();
        }, 500);
    });

    // पेज छोडते समय एनिमेशन साफ करें (वैकल्पिक)
    window.addEventListener('beforeunload', () => {
         if (sfcwAnimationFrameId) {
             cancelAnimationFrame(sfcwAnimationFrameId);
         }
         clearTimeout(sfcwStartDelay);
         clearTimeout(sfcwResizeTimeout);
    });

});
/* ===== END: Screen Focus Cosmos Widget JS ===== */

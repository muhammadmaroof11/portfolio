export const VTilt = {
  mounted(el, binding) {
    const isMobile = () => window.innerWidth < 768;
    
    // Set up card styling and perspective base
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    
    // Optional glow effect overlay
    let glow = null;
    const hasGlow = binding.modifiers.glow !== false;
    
    if (hasGlow) {
      glow = document.createElement('div');
      glow.style.position = 'absolute';
      glow.style.inset = '0';
      glow.style.zIndex = '99';
      glow.style.pointerEvents = 'none';
      glow.style.borderRadius = 'inherit';
      glow.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 80%)';
      glow.style.opacity = '0';
      glow.style.transition = 'opacity 0.4s ease';
      el.appendChild(glow);
    }

    const maxRotation = binding.value?.max || 12; // default max rotation in degrees
    const scale = binding.value?.scale || 1.03; // default zoom on hover
    
    const handleMove = (e) => {
      if (isMobile()) return;
      
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const px = x / width; // 0 to 1
      const py = y / height; // 0 to 1
      
      // Calculate rotation based on cursor offset from center (-0.5 to 0.5)
      const rotateX = ((0.5 - py) * maxRotation).toFixed(2);
      const rotateY = ((px - 0.5) * maxRotation).toFixed(2);
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      
      if (glow) {
        glow.style.opacity = '1';
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18) 0%, transparent 65%)`;
      }
    };
    
    const handleLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glow) {
        glow.style.opacity = '0';
      }
    };
    
    el._tiltMove = handleMove;
    el._tiltLeave = handleLeave;
    
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
  },
  
  unmounted(el) {
    el.removeEventListener('mousemove', el._tiltMove);
    el.removeEventListener('mouseleave', el._tiltLeave);
  }
};

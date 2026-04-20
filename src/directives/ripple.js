export const Ripple = {
  mounted(el, binding) {
    el.classList.add('ripple-container');
    
    const applyRipple = (e) => {
      const isMobile = e.type === 'touchstart';
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      
      // Get coordinates
      let x, y;
      if (isMobile) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      const size = Math.max(rect.width, rect.height) * 2;
      
      ripple.classList.add('ripple-effect');
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;

      // Allow customization via binding value
      if (binding.value) {
        ripple.style.backgroundColor = binding.value;
      }

      el.appendChild(ripple);

      // Haptic Feedback (Vibration)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }

      // Clean up
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    };

    el.setAttribute('data-ripple-registered', 'true');
    el.addEventListener('mousedown', applyRipple);
    el.addEventListener('touchstart', applyRipple, { passive: true });
  },
  unmounted(el) {
    // Event listeners are automatically removed
  }
};

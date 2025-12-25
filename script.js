document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      navLinks.classList.toggle("show");
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        navLinks.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const navbar = document.querySelector(".navbar");

  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else if (revealElements.length) {
    revealElements.forEach((el) => el.classList.add("reveal-visible"));
  }

  const quickConsultForm = document.getElementById("quick-consult-form");
  const contactForm = document.getElementById("contact-form");

  // WhatsApp phone number (update this with the actual number)
  const WHATSAPP_NUMBER = "923211853000";

  function handleFormSubmit(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Build WhatsApp message
      let message = `📩 *New Contact Form Submission*\n\n`;
      message += `👤 *Name:* ${data.name || 'Not provided'}\n`;
      message += `📧 *Email:* ${data.email || 'Not provided'}\n`;
      message += `📱 *Phone:* ${data.phone || 'Not provided'}\n`;
      if (data.service) message += `🏢 *Service:* ${data.service}\n`;
      if (data.country) message += `🌍 *Country:* ${data.country}\n`;
      message += `\n💬 *Message:* ${data.message || 'No message'}\n`;
      message += `\n---\n`;
      message += `📅 *Date:* ${new Date().toLocaleString()}\n`;
      message += `🌐 *Source:* Awaid International Website`;

      // Encode and open WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Show success notification
      showNotification('Opening WhatsApp to send your message...', 'success');

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Reset form
      form.reset();
    });
  }

  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // Set background color based on type
    if (type === 'success') {
      notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#ef4444';
    } else {
      notification.style.backgroundColor = '#3b82f6';
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  const airScene = document.querySelector('.air-scene');

  if (airScene && typeof THREE !== 'undefined') {
    try {
      const initialWidth = airScene.clientWidth || airScene.offsetWidth || 320;
      const initialHeight = airScene.clientHeight || 160;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 100);
      camera.position.set(3.2, 2.6, 7);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setSize(initialWidth, initialHeight);
      airScene.appendChild(renderer.domElement);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x64748b, 0.9);
      hemiLight.position.set(0, 4, 0);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
      dirLight.position.set(5, 8, 10);
      scene.add(dirLight);

      const planeGroup = new THREE.Group();
      scene.add(planeGroup);

      const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.45, 7.0, 28, 1);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.4
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      planeGroup.add(body);

      const noseGeometry = new THREE.ConeGeometry(0.45, 1.4, 28);
      const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
      nose.position.x = 3.7;
      nose.rotation.z = Math.PI / 2;
      planeGroup.add(nose);

      const tailGeometry = new THREE.ConeGeometry(0.32, 1.1, 20);
      const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
      tail.position.x = -3.7;
      tail.rotation.z = -Math.PI / 2;
      planeGroup.add(tail);

      const finGeometry = new THREE.BoxGeometry(0.14, 1.7, 0.6);
      const finMaterial = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        metalness: 0.2,
        roughness: 0.4
      });
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      fin.position.set(-3.2, 1.0, 0);
      fin.rotation.z = 0.45;
      planeGroup.add(fin);

      const mainWingGeometry = new THREE.BoxGeometry(0.22, 0.06, 7.6);
      const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0xe5e7eb,
        metalness: 0.2,
        roughness: 0.5
      });
      const mainWing = new THREE.Mesh(mainWingGeometry, wingMaterial);
      mainWing.position.set(0.5, -0.18, 0);
      mainWing.rotation.x = -0.22;
      planeGroup.add(mainWing);

      const tailWingGeometry = new THREE.BoxGeometry(0.9, 0.05, 2.6);
      const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
      tailWing.position.set(-2.6, -0.16, 0);
      tailWing.rotation.x = -0.1;
      planeGroup.add(tailWing);

      const engineGeometry = new THREE.CylinderGeometry(0.22, 0.22, 1.0, 20);
      const engineMaterial = new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        metalness: 0.4,
        roughness: 0.4
      });
      const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
      leftEngine.rotation.z = Math.PI / 2;
      leftEngine.position.set(0.9, -0.55, -1.2);
      planeGroup.add(leftEngine);

      const rightEngine = leftEngine.clone();
      rightEngine.position.z = 1.2;
      planeGroup.add(rightEngine);

      const windowStripGeometry = new THREE.BoxGeometry(0.04, 0.16, 4.6);
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0,
        roughness: 0.7
      });
      const windows = new THREE.Mesh(windowStripGeometry, windowMaterial);
      windows.position.set(0.3, 0.2, 0);
      planeGroup.add(windows);

      planeGroup.rotation.set(-0.28, -0.8, -0.12);

      function handleResize() {
        const newWidth = airScene.clientWidth || airScene.offsetWidth || initialWidth;
        const newHeight = airScene.clientHeight || initialHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }

      window.addEventListener('resize', handleResize);

      let t = 0;

      function animatePlane() {
        requestAnimationFrame(animatePlane);
        t += 0.01;

        planeGroup.position.x = 0;
        planeGroup.position.z = 0;
        planeGroup.position.y = 0.1 + Math.sin(t * 2) * 0.12;

        planeGroup.rotation.y = -0.7 + Math.sin(t * 0.6) * 0.08;
        planeGroup.rotation.z = -0.18 + Math.sin(t * 1.1) * 0.08;
        planeGroup.rotation.x = -0.18 + Math.sin(t * 0.9) * 0.05;

        renderer.render(scene, camera);
      }

      animatePlane();
    } catch (error) {
      console.error('Three.js initialization failed:', error);
      // Optionally hide the scene or show fallback content
      airScene.style.display = 'none';
    }
  } else if (airScene) {
    console.warn('Three.js not loaded or scene not found');
    airScene.style.display = 'none';
  }

  if (quickConsultForm instanceof HTMLFormElement) {
    handleFormSubmit(quickConsultForm);
  }

  if (contactForm instanceof HTMLFormElement) {
    handleFormSubmit(contactForm);
  }
});

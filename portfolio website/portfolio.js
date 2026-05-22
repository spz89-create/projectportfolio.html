

document.addEventListener("DOMContentLoaded", () => {


  const html        = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon   = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("portfolioTheme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("portfolioTheme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === "dark"
      ? "bi bi-moon-fill"
      : "bi bi-sun-fill";
  }


  const typedEl = document.getElementById("typedName");
  const words   = ["Samson", "a Developer", "a Designer", "Samson"];
  let   wi      = 0;  
  let   ci      = 0;   
  let   deleting = false;
  let   paused   = false;

  function type() {
    if (paused) return;

    const word     = words[wi];
    const current  = word.substring(0, ci);
    typedEl.textContent = current;

    if (!deleting && ci === word.length) {
      
      paused = true;
      setTimeout(() => {
        paused   = false;
        deleting = true;
        type();
      }, wi === words.length - 1 ? 99999 : 1600); 
      return;
    }

    if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % (words.length - 1); 
    }

    ci += deleting ? -1 : 1;
    setTimeout(type, deleting ? 60 : 100);
  }

  type();


  const revealEls = document.querySelectorAll(".reveal-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.closest("#skills")) {
            animateSkillBars();
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(el => observer.observe(el));


  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;

    document.querySelectorAll(".skill-fill").forEach(bar => {
      const target = bar.getAttribute("data-width");
   
      setTimeout(() => {
        bar.style.width = target + "%";
      }, 300);
    });
  }


  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function setActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav(); 


  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });


  const scrollTopBtn = document.getElementById("scrollTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }, { passive: true });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  const form        = document.getElementById("contactForm");
  const nameInput   = document.getElementById("contactName");
  const emailInput  = document.getElementById("contactEmail");
  const msgInput    = document.getElementById("contactMessage");
  const nameError   = document.getElementById("nameError");
  const emailError  = document.getElementById("emailError");
  const msgError    = document.getElementById("messageError");
  const successMsg  = document.getElementById("successMsg");
  const submitBtn   = document.getElementById("submitBtn");


  nameInput.addEventListener("input",  () => validateName(nameInput));
  emailInput.addEventListener("input", () => validateEmail(emailInput));
  msgInput.addEventListener("input",   () => validateMessage(msgInput));

  
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener("focus", () => {
      if (input.classList.contains("is-invalid")) {
        input.classList.remove("is-invalid");
      }
    });
  });

  function validateName(input) {
    const val = input.value.trim();
    if (val.length === 0) {
      showError(input, nameError, "Name is required.");
      return false;
    } else if (val.length < 2) {
      showError(input, nameError, "Name must be at least 2 characters.");
      return false;
    } else {
      clearError(input, nameError);
      return true;
    }
  }

  function validateEmail(input) {
    const val     = input.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length === 0) {
      showError(input, emailError, "Email is required.");
      return false;
    } else if (!pattern.test(val)) {
      showError(input, emailError, "Please enter a valid email address.");
      return false;
    } else {
      clearError(input, emailError);
      return true;
    }
  }

  function validateMessage(input) {
    const val = input.value.trim();
    if (val.length === 0) {
      showError(input, msgError, "Message is required.");
      return false;
    } else if (val.length < 10) {
      showError(input, msgError, "Message must be at least 10 characters.");
      return false;
    } else {
      clearError(input, msgError);
      return true;
    }
  }

  function showError(input, errorEl, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    errorEl.textContent = "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameOk  = validateName(nameInput);
    const emailOk = validateEmail(emailInput);
    const msgOk   = validateMessage(msgInput);

    if (!nameOk || !emailOk || !msgOk) {
      if (!nameOk)  nameInput.focus();
      else if (!emailOk) emailInput.focus();
      else           msgInput.focus();
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.innerHTML = `<span class="btn-text">Sending...</span> <i class="bi bi-hourglass-split ms-2"></i>`;

    setTimeout(() => {
      submitBtn.classList.remove("loading");
      submitBtn.innerHTML = `<span class="btn-text">Send Message</span> <i class="bi bi-send ms-2"></i>`;

      successMsg.classList.add("show");
      form.reset();

      [nameInput, emailInput, msgInput].forEach(el => {
        el.classList.remove("is-valid", "is-invalid");
      });

      setTimeout(() => successMsg.classList.remove("show"), 5000);
    }, 1500);
  });


  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const navCollapse = document.getElementById("navbarNav");
      const bsCollapse  = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    });
  });

}); 

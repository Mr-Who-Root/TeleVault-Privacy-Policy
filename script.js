/**
 * TeleVault - Privacy Policy Client Script
 * Handles theme toggling, scrollspy TOC, clipboard copy, and dynamic year.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Theme Toggle (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('televault_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('televault_theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'light' 
        ? '<i class="fa-solid fa-moon"></i>' 
        : '<i class="fa-solid fa-sun"></i>';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  }

  if (storedTheme) {
    setTheme(storedTheme);
  } else if (!prefersDark) {
    // If system defaults to light mode and no preference is stored
    setTheme('dark'); // TeleVault looks best with dark theme by default, but respects toggle
  } else {
    setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // 3. Email Copy Functionality
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const emailToCopy = 'letter2govind@gmail.com';

  if (copyEmailBtn && copyFeedback) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        const originalText = copyFeedback.textContent;
        copyFeedback.textContent = 'Copied!';
        copyEmailBtn.style.borderColor = 'var(--accent-primary)';
        copyEmailBtn.style.color = 'var(--accent-primary)';

        setTimeout(() => {
          copyFeedback.textContent = originalText;
          copyEmailBtn.style.borderColor = '';
          copyEmailBtn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyFeedback.textContent = 'Copied!';
        setTimeout(() => {
          copyFeedback.textContent = 'Copy';
        }, 2000);
      }
    });
  }

  // 4. Scrollspy for Table of Contents
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.policy-section');

  if (tocLinks.length && sections.length && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }
});

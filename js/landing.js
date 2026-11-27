const toggle = document.querySelector('.menu-toggle');
const navContent = document.querySelector('.nav-content');
if (toggle && navContent) {
  toggle.addEventListener('click', () => {
    const isOpen = navContent.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

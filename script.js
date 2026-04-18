const header = document.getElementById("header");

window.addEventListener("scroll", () => {
header.classList.toggle("scrolled", window.scrollY > 50);
});

// Smooth scrolling for nav links
document.querySelectorAll('nav a').forEach(anchor => {
anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
        behavior: 'smooth'
    });
});
});

// Fade-in animation on scroll
const observerOptions = {
threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
    }
});
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
observer.observe(section);
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

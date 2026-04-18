// Seleção de elementos
const header = document.getElementById("header");
const backToTopButton = document.getElementById('back-to-top');
const images = document.querySelectorAll('.carousel img');
let currentIndex = 0;

// 1. Controle do Header e Botão Voltar ao Topo durante o Scroll
window.addEventListener("scroll", () => {
    // Muda o fundo do header ao rolar mais de 50px
    header.classList.toggle("scrolled", window.scrollY > 50);

    // Mostra ou esconde o botão de voltar ao topo
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// 2. Scroll Suave para os links de navegação
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 3. Animação de Entrada (Fade-in) ao rolar a página
const observerOptions = {
    threshold: 0.1 // Ativa quando 10% da seção aparece
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Aplica o observador em todas as seções
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// 4. Funcionalidade do Carrossel (Troca de Imagem)
function changeImage() {
    // Remove a classe 'active' da imagem atual (isso reseta o zoom e a opacidade)
    images[currentIndex].classList.remove('active');
    
    // Calcula o próximo índice (volta ao zero se chegar no final)
    currentIndex = (currentIndex + 1) % images.length;
    
    // Adiciona a classe 'active' na nova imagem (isso inicia o zoom suave do CSS)
    images[currentIndex].classList.add('active');
}

// Troca a imagem a cada 4 segundos (tempo ideal para apreciar o efeito de zoom)
setInterval(changeImage, 4000);

// 5. Clique do Botão Voltar ao Topo
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

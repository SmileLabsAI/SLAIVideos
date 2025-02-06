// Função para redirecionar para a página de pagamento da "Kiwify"
function comprarPack(link) {
    window.location.href = link;
}

// Função para abrir/fechar o menu mobile
function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('open');
        console.log(menu.classList.contains('open')
            ? "📂 Menu hambúrguer aberto"
            : "❌ Menu hambúrguer fechado");
    }
}

// Fecha o menu ao clicar em um link dentro dele
function closeMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        console.log("❌ Menu fechado ao clicar fora ou em um link");
    }
}

// Espera o DOM carregar antes de adicionar eventos
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Script.js inicializado");

    // Botão hambúrguer
    const menuButton = document.querySelector('.hamburger');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
        // Remove o atributo inline para evitar chamada dupla da função
        menuButton.removeAttribute('onclick');
        console.log("🍔 Botão de menu hambúrguer ativado.");
    }

    // Captura clique em qualquer link dentro do menu para fechar
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 📌 Verifica se o usuário está logado
    const userToken = localStorage.getItem("userToken");
    const isLoggedIn = userToken && isTokenValid(userToken);

    // 📌 Seleciona os links de Login/Logout e Members
    const loginLink = document.querySelector('.nav-links li a[href="login.html"]');
    const loginLinkMobile = document.querySelector('.mobile-menu a[href="login.html"]');
    const membersLink = document.querySelector('.nav-links li a[href="members.html"]');
    const membersLinkMobile = document.querySelector('.mobile-menu a[href="members.html"]');

    // 📌 Se estiver logado, altera "Login" para "Logout"
    if (isLoggedIn) {
        [loginLink, loginLinkMobile].forEach(link => {
            if (link) {
                link.textContent = "Logout";
                link.href = "#";
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    logoutUser();
                });
            }
        });
    } else {
        [loginLink, loginLinkMobile].forEach(link => {
            if (link) {
                link.textContent = "Login";
                link.href = "login.html";
            }
        });
    }

    // --> Adicionando código para ocultar o botão "Sign In" caso o usuário esteja logado
    const signInButton = document.querySelector('.nav-links li a[href="cadastro.html"]');
    const signInButtonMobile = document.querySelector('.mobile-menu a[href="cadastro.html"]');
    if (isLoggedIn) {
        if (signInButton) signInButton.style.display = "none";
        if (signInButtonMobile) signInButtonMobile.style.display = "none";
    }

    // 📌 Se clicar em "Members" e não estiver logado, redireciona para "login.html"
    [membersLink, membersLinkMobile].forEach(link => {
        if (link) {
            link.addEventListener("click", function (e) {
                if (!isLoggedIn) {
                    e.preventDefault();
                    window.location.href = "login.html";
                }
            });
        }
    });

    // 📌 Se abrir diretamente "members.html" sem estar logado, redireciona para "login.html"
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "members.html" && !isLoggedIn) {
        window.location.href = "login.html";
    }

    // 📌 Redirecionamento do logo para a página inicial
    const navbarLogo = document.querySelector('.navbar-left img');
    if (navbarLogo) {
        navbarLogo.addEventListener('click', function () {
            window.location.href = "home.html";
        });
    }

    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const container = document.querySelector('.carousel-track-container');

    if (!track || !slides.length || !nextButton || !prevButton || !container) return;

    let currentIndex = 0;

    function updateCarousel() {
        const containerWidth = container.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const gap = window.innerWidth <= 768 ? 1 : 20;
        
        // Calcula o offset total disponível
        const totalWidth = slides.length * (slideWidth + gap);
        
        // Adiciona margem extra para o último slide
        const extraMargin = 30;
        
        // Calcula o centro do container
        const centerOffset = (containerWidth - slideWidth) / 2;
        
        // Calcula o offset para centralizar o slide atual
        let offset = (currentIndex * (slideWidth + gap)) - centerOffset;
        
        // Limita o offset para não ultrapassar os limites
        const maxOffset = totalWidth - containerWidth + extraMargin;
        offset = Math.max(0, Math.min(offset, maxOffset));
        
        // Aplica a transformação com transição suave
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${offset}px)`;

        // Atualiza estado dos botões
        const isFirstSlide = currentIndex <= 0;
        const isLastSlide = currentIndex >= slides.length - 1;

        prevButton.disabled = isFirstSlide;
        nextButton.disabled = isLastSlide;

        prevButton.style.opacity = isFirstSlide ? '0.5' : '1';
        nextButton.style.opacity = isLastSlide ? '0.5' : '1';
    }

    function moveToSlide(targetIndex) {
        // Garante que o índice está dentro dos limites
        currentIndex = Math.max(0, Math.min(targetIndex, slides.length - 1));
        updateCarousel();
    }

    function moveNext() {
        if (currentIndex < slides.length - 1) {
            moveToSlide(currentIndex + 1);
        }
    }

    function movePrev() {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    }

    // Event Listeners para botões com mesmo comportamento do touch
    nextButton.addEventListener('click', moveNext);
    prevButton.addEventListener('click', movePrev);

    // Touch events mantidos iguais
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        track.style.transition = 'none'; // Remove transição durante o toque
    });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        track.style.transition = 'transform 0.5s ease-in-out'; // Restaura transição
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0 && !nextButton.disabled) {
                moveNext();
            } else if (difference < 0 && !prevButton.disabled) {
                movePrev();
            }
        }
    }

    // Resize handler mantido
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });

    // Inicialização
    updateCarousel();
});

// Função para validar se o token JWT ainda é válido
function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch (e) {
        console.error("⚠ Token inválido:", e);
        return false;
    }
}

// Função de logout unificada para evitar código duplicado
function logoutUser() {
    localStorage.removeItem("userToken");
    console.log("🔴 Usuário fez logout.");
    window.location.href = "index.html";
}

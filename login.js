document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (userLoggedIn) {
        // Se o usuário estiver logado, exibe o botão de logout
        if (logoutButton) {
            logoutButton.style.display = "inline-block";
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("userLoggedIn");
                window.location.href = "index.html";
            });
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita o envio do formulário padrão
            localStorage.setItem("userLoggedIn", "true");
            window.location.href = "membros.html";
        });
    }
});

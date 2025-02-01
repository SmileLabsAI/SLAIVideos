document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página carregada. Inicializando login.js...");

    // Remove token antigo se estivermos na página de login
    if (window.location.pathname.endsWith("login.html")) {
        localStorage.removeItem("userToken");
    }

    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");

    // URLs do Backend e páginas de destino
    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const MEMBERS_PAGE = "members.html"; // Página protegida
    const CADASTRO_PAGE = "cadastro.html"; // Página de cadastro

    // Função para validar token JWT (opcional)
    function isTokenValid(token) {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now;
        } catch (e) {
            console.error("⚠ Token inválido:", e);
            return false;
        }
    }

    // Se não estivermos na página de login, verifique se há token válido
    if (!window.location.pathname.endsWith("login.html")) {
        const storedToken = localStorage.getItem("userToken");
        if (!storedToken || !isTokenValid(storedToken)) {
            console.warn("🔒 Token ausente ou inválido. Redirecionando para login...");
            window.location.href = "login.html";
        }
    }

    // Logout do usuário
    if (logoutButton) {
        logoutButton.style.display = "inline-block";
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("userToken");
            console.log("🔴 Usuário fez logout.");
            window.location.href = "index.html";
        });
    }

    // Processo de Login
    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("password").value.trim();

            if (!email || !senha) {
                alert("⚠ Preencha todos os campos.");
                return;
            }

            console.log("🟡 Tentando login com:", { email, senha });

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email, senha: senha })
                });

                /** @type {{ token?: string, message?: string, error?: string }} */
                const data = await response.json();
                console.log("🟢 Resposta do servidor:", data);

                if (response.ok && data.token) {
                    localStorage.setItem("userToken", data.token);
                    // Redireciona para a área de membros sem exibir alerta com o token
                    setTimeout(() => {
                        window.location.href = MEMBERS_PAGE;
                    }, 1000); // 1 segundo de atraso opcional
                } else {
                    if (data.error === "Usuário não encontrado.") {
                        alert("Usuário não encontrado. Redirecionando para cadastro.");
                        setTimeout(() => {
                            window.location.href = CADASTRO_PAGE;
                        }, 3000); // 3 segundos de atraso para que o alerta seja lido
                    } else if (data.error === "Senha incorreta.") {
                        alert("Senha incorreta. Por favor, tente novamente.");
                    } else {
                        alert(data.error || "❌ Erro ao fazer login. Verifique suas credenciais.");
                    }
                    console.error("⚠ Erro de login:", data);
                }
            } catch (error) {
                console.error("❌ Erro ao conectar com o servidor:", error);
                alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }
        });
    } else {
        console.warn("⚠ Formulário de login não encontrado no DOM.");
    }
});

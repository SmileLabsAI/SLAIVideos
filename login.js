document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página carregada. Inicializando login.js...");

    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken");

    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const MEMBERS_PAGE = "members.html"; // Página protegida

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

    if (userToken && isTokenValid(userToken)) {
        console.log("✅ Usuário autenticado e token válido.");
        if (window.location.pathname.endsWith("login.html")) {
            window.location.href = MEMBERS_PAGE;
        }
    } else {
        console.log("❌ Usuário não autenticado ou token inválido.");
        localStorage.removeItem("userToken");
    }

    if (logoutButton) {
        logoutButton.style.display = "inline-block";
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("userToken");
            console.log("🔴 Usuário fez logout.");
            window.location.href = "index.html";
        });
    }

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
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();
                console.log("🔍 Resposta da API:", data);

                if (response.ok && data.token) {
                    localStorage.setItem("userToken", data.token);
                    console.log("✅ Login bem-sucedido. Redirecionando...");

                    setTimeout(() => {
                        window.location.href = MEMBERS_PAGE;
                    }, 500);
                } else if (data.message && data.message.includes("bem-sucedido")) {
                    // Se a API disser que o login foi bem-sucedido, trata como sucesso mesmo sem token explícito
                    console.warn("⚠ Login bem-sucedido, mas sem token. Verifique API.");
                    alert("⚠ Login realizado, mas sem token. Entre em contato com o suporte.");
                } else {
                    console.error("❌ Erro de login:", data?.error || "Usuário ou senha incorretos.");
                    alert("❌ Erro ao fazer login. Verifique suas credenciais.");
                }

            });
    } else {
        console.warn("⚠ Formulário de login não encontrado no DOM.");
    }
});

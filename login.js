document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Página carregada. Inicializando login.js...");

    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken");

    // URLs do Backend e Supabase
    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const SUPABASE_URL = "https://rxqieqpxjztnelrsibqc.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWllcXB4anp0bmVscnNpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzAzMDYsImV4cCI6MjA1MzQwNjMwNn0.-eFyRvUhRRGwS5u2zOdKjhHronlw8u-POJzCaBocBxc";

    // 🔹 Inicializa Supabase corretamente
    if (typeof window.supabase === "undefined") {
        console.warn("⚠ Supabase não estava inicializado. Criando agora...");
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // 🔹 Verifica se o usuário já está logado
    if (userToken) {
        console.log("✅ Usuário já autenticado.");
        if (logoutButton) {
            logoutButton.style.display = "inline-block";
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("userToken");
                console.log("🔴 Usuário fez logout.");
                window.location.href = "index.html";
            });
        }
    }

    // 🔹 Processo de Login
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email")?.value.trim();
            const senha = document.getElementById("password")?.value.trim();

            if (!email || !senha) {
                alert("⚠ Preencha todos os campos.");
                return;
            }

            console.log("🟡 Tentando login com:", { email, senha });

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha }),
                });

                const data = await response.json();
                console.log("🟢 Resposta do servidor:", data);

                if (response.ok) {
                    localStorage.setItem("userToken", data.token);
                    alert("✅ Login realizado com sucesso!");
                    console.log("🔄 Redirecionando para membros.html...");
                    window.location.href = "members.html";
                } else {
                    alert(data.error || "❌ Erro ao fazer login. Verifique suas credenciais.");
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

// 🔹 Redirecionamento após login
document.addEventListener("DOMContentLoaded", () => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
        console.log("✅ Usuário autenticado. Redirecionando...");
        window.location.href = "members.html"; // ✅ Verifique se esse arquivo existe no GitHub Pages!
    }
});

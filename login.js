document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken"); // Armazena o token do usuário

    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login"; // Backend no Render
    const SUPABASE_URL = "https://rxqieqpxjztnelrsibqc.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWllcXB4anp0bmVscnNpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzAzMDYsImV4cCI6MjA1MzQwNjMwNn0.-eFyRvUhRRGwS5u2zOdKjhHronlw8u-POJzCaBocBxc";
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    if (userToken) {
        console.log("Usuário já está logado.");
        if (logoutButton) {
            logoutButton.style.display = "inline-block";
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("userToken");
                console.log("Usuário fez logout.");
                window.location.href = "index.html";
            });
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Evita recarregar a página

            const email = document.getElementById("email").value;
            const senha = document.getElementById("password").value;

            console.log("Tentando fazer login com:", { email, senha });

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha }),
                });

                const data = await response.json();
                console.log("Resposta do servidor:", data);

                if (response.ok) {
                    localStorage.setItem("userToken", data.token); // Salva token no navegador
                    alert("Login realizado com sucesso!");
                    console.log("Redirecionando para members.html...");
                    window.location.href = "members.html"; // Redireciona para área logada
                } else {
                    alert(data.error || "Erro ao fazer login. Verifique suas credenciais.");
                    console.error("Erro de login:", data);
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }
        });
    }
});

// 🔹 Verifica a autenticação ao carregar a página
async function checkAuth() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
        console.log("Usuário autenticado. Redirecionando...");
        window.location.href = "members.html"; // Redireciona se já estiver logado
    }
}

document.addEventListener("DOMContentLoaded", checkAuth);

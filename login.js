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
                window.location.href = "catalog.html";
            });
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita o envio do formulário padrão
            localStorage.setItem("userLoggedIn", "true");
            window.location.href = "members.html";
        });
    }
});
// Configuração do Supabase
const SUPABASE_URL = "https://rxqieqpxjztnelrsibqc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWllcXB4anp0bmVscnNpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzAzMDYsImV4cCI6MjA1MzQwNjMwNn0.-eFyRvUhRRGwS5u2zOdKjhHronlw8u-POJzCaBocBxc";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para login com Google
async function loginWithGoogle() {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/members.html" // Página para onde será redirecionado após login
        }
    });

    if (error) {
        console.error("Erro ao fazer login:", error.message);
        alert("Erro ao autenticar com o Google!");
    }
}

// Evento de clique para botão de login
document.getElementById("login-google").addEventListener("click", loginWithGoogle);

// Verifica se o usuário já está autenticado
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        window.location.href = "/members.html";
    }
}

// Verifica a autenticação ao carregar a página
document.addEventListener("DOMContentLoaded", checkAuth);

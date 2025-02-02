document.addEventListener("DOMContentLoaded", function () {
    console.log("🔍 Verificando autenticação...");

    const userToken = localStorage.getItem("userToken");

    // Função para validar se o token JWT ainda é válido
    function isTokenValid(token) {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now; // Verifica se o token ainda não expirou
        } catch (e) {
            console.error("⚠ Erro ao validar token:", e);
            return false;
        }
    }

    if (!userToken || !isTokenValid(userToken)) {
        console.warn("🚫 Acesso negado. Redirecionando para login...");
        localStorage.removeItem("userToken"); // Remove token inválido
        window.location.href = "login.html";
    } else {
        console.log("✅ Token válido. Acesso permitido.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const userToken = localStorage.getItem("userToken");

    function isTokenValid(token) {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now; // Verifica se o token ainda está válido
        } catch (e) {
            console.error("⚠ Token inválido:", e);
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

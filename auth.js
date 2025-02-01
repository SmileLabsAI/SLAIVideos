document.addEventListener("DOMContentLoaded", function () {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
        console.warn("🚫 Acesso negado. Redirecionando para login...");
        window.location.href = "login.html";
    }
});

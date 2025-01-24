const mp = new MercadoPago("APP_USR-7a366cc9-b73c-409f-a12a-c4f978c4b569", { locale: "pt-BR" });

// Adiciona eventos aos botões de compra
document.getElementById("checkout-button-5").addEventListener("click", () => {
    iniciarPagamento("pack5");
});

document.getElementById("checkout-button-10").addEventListener("click", () => {
    iniciarPagamento("pack10");
});

// Função para criar a preferência no backend
async function iniciarPagamento(pack) {
    try {
        const response = await fetch("https://slaivideos-backend.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pack: pack })
        });

        const data = await response.json();

        if (data.id) {
            mp.checkout({
                preference: {
                    id: data.id
                },
                autoOpen: true
            });
        } else {
            alert("Erro ao criar a preferência de pagamento.");
        }
    } catch (error) {
        console.error("Erro ao iniciar pagamento:", error);
    }
}

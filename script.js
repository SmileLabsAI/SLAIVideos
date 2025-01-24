const mp = new MercadoPago("APP_USR-7a366cc9-b73c-409f-a12a-c4f978c4b569", { locale: "pt-BR" });

// Adiciona eventos aos botões de compra
document.getElementById("checkout-button-5").addEventListener("click", () => {
    iniciarPagamento("pack5", 100.00); // Corrigi o preço para reais (R$ 100,00)
});

document.getElementById("checkout-button-10").addEventListener("click", () => {
    iniciarPagamento("pack10", 180.00); // Corrigi o preço para reais (R$ 180,00)
});

// Função para criar a preferência no backend
async function iniciarPagamento(pack, price) {
    try {
        console.log(`Iniciando pagamento para ${pack} - R$ ${price}`);

        const response = await fetch("https://slaivideos-backend.onrender.com/api/payment/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title: pack, 
                price: price
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar preferência: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Resposta do backend:", data);

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
        alert("Erro ao processar o pagamento. Tente novamente.");
    }
}

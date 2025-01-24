async function iniciarPagamento(pack) {
    console.log(`Iniciando pagamento para ${pack} - R$ ${pack === "pack5" ? 100 : 180}`);

    try {
        const response = await fetch("https://slaivideos-backend.onrender.com/api/checkout/create_preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title: pack, 
                price: pack === "pack5" ? 100.00 : 180.00 
            })
        });

        const text = await response.text(); // Obtém o texto da resposta
        console.log("Resposta do backend:", text);

        let data;
        try {
            data = JSON.parse(text); // Tenta converter para JSON
        } catch (error) {
            console.error("Erro ao converter resposta para JSON:", error);
            alert("Erro ao criar a preferência de pagamento. Resposta inválida.");
            return;
        }

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
        alert("Falha na comunicação com o servidor.");
    }
}

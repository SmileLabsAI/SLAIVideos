const mp = new MercadoPago("APP_USR-2558136151487812-012311-08dd4e15416784773f715f16a694e92f-220300097", {
    locale: "pt-BR"
});

document.getElementById("btn5").addEventListener("click", function() {
    processarPagamento(100.00, "Pack de 5 Vídeos");
});

document.getElementById("btn10").addEventListener("click", function() {
    processarPagamento(180.00, "Pack de 10 Vídeos");
});

function processarPagamento(valor, descricao) {
    fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer APP_USR-2558136151487812-012311-08dd4e154167847737f151f6a694e92f-220300097"
        },
        body: JSON.stringify({
            transaction_amount: valor,
            description: descricao,
            payment_method_id: "pix",
            payer: {
                email: "comprador@email.com"
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "approved") {
            alert("Pagamento aprovado! Você receberá seus vídeos em breve.");
        } else {
            alert("Erro no pagamento. Tente novamente.");
        }
    })
    .catch(error => console.error("Erro ao processar pagamento:", error));
}

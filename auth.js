/* Reset de estilos */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background-color: #141414;
    color: white;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Navbar estilo Netflix */
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 50px;
    background-color: rgba(0, 0, 0, 0.9);
}

.navbar img {
    height: 50px;
}

.navbar ul {
    list-style: none;
    display: flex;
    gap: 20px;
}

.navbar ul li {
    display: inline;
}

.navbar ul li a {
    color: white;
    text-decoration: none;
    font-size: 18px;
    transition: color 0.3s ease-in-out;
}

.navbar ul li a:hover {
    color: #e50914;
}

/* Hero Section */
.hero {
    text-align: center;
    padding: 60px 20px;
}

.hero h1 {
    font-size: 48px;
    font-weight: bold;
}

.hero p {
    font-size: 20px;
    color: #b3b3b3;
    margin-top: 10px;
}

/* Pacotes */
.container {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 30px;
}

.pack {
    background-color: #1f1f1f;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease-in-out;
    width: 300px;
    text-align: center;
}

.pack:hover {
    transform: scale(1.05);
}

.pack img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 15px;
}

p {
    font-size: 18px;
    margin: 10px 0;
}

/* Botões */
button {
    background-color: #e50914;
    color: white;
    border: none;
    padding: 12px 20px;
    font-size: 16px; /* Ajustado para um tamanho menor */
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
    width: 100%;
}

button:hover {
    background-color: #b20710;
    transform: scale(1.05);
}

/* Botão Google */
.social-login button {
    font-size: 12px; /* Reduzindo tamanho da fonte */
}

.social-login button img {
    width: 14px; /* Reduzindo tamanho do ícone */
    height: 14px;
    margin-right: 8px;
    position: relative;
    left: -5px; /* Ajustando posicionamento */
}

/* Login Persistente */
#menu-login {
    cursor: pointer;
}

/* Responsividade */
@media (max-width: 768px) {
.navbar {
        flex-direction: column;
        text-align: center;
    }
.navbar ul {
        flex-direction: column;
        padding-top: 10px;
    }
.hero h1 {
        font-size: 32px;
    }
.hero p {
        font-size: 18px;
    }
.container {
        flex-direction: column;
        align-items: center;
    }
.pack {
        width: 90%;
    }
    button {
        font-size: 14px;
    }
}

/* Rodapé fixado */
footer {
    margin-top: auto;
    background: black;
    color: white;
    text-align: center;
    padding: 15px;
}

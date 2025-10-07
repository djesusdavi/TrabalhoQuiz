class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
    }

    animateLinks() {
        this.navLinks.forEach((link, index) => {
            link.style.animation
                ? (link.style.animation = "")
                : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`);
        });
    }

    handleClick() {
        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass);
        this.animateLinks();
    }

    addClickEvent() {
        this.mobileMenu.addEventListener("click", this.handleClick);
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }
}

const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li",
);
mobileNavbar.init();

document.addEventListener('DOMContentLoaded', () => {
    const nomeInput = document.getElementById('nomeJogador');
    const startBtn = document.getElementById('startBtn');
    const nomeError = document.getElementById('nomeError');

    if (!nomeInput || !startBtn) return;

    let nome = "";

    nomeInput.addEventListener('input', () => {
        startBtn.disabled = nomeInput.value.trim() === "";
        if (nomeInput.value.trim() !== "") nomeError.textContent = "";
    });

    function iniciarQuiz() {
        nome = nomeInput.value.trim();
        if (!nome) {
            nomeError.textContent = "Por favor, digite seu nome.";
            nomeInput.focus();
            return;
        }
        localStorage.setItem("nomeJogador", nome);
        document.getElementById('inicio').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';
        const msg = document.getElementById('mensagemNome');
        if (msg) msg.textContent = `${nome}, boa sorte!`;
    }

    startBtn.addEventListener('click', iniciarQuiz);
    nomeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !startBtn.disabled) iniciarQuiz();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mensagemNome = document.getElementById("mensagemNome");
    const perguntaTexto = document.getElementById("perguntaTexto");
    const opcoes = document.getElementById("opcoes");
    const proximoBtn = document.getElementById("proximoBtn");
    const resultado = document.getElementById("resultado");
    const mensagemFinal = document.getElementById("mensagemFinal");
    const recomecar = document.getElementById("recomecar");

    const nomeJogador = localStorage.getItem("nomeJogador") || "Jogador";
    mensagemNome.innerText = `${nomeJogador}, boa sorte!`;

    const perguntas = [
        { pergunta: "1. O que significa HTML?", opcoes: ["HyperText Markup Language","Hyperlinks and Text Markup Language","Home Tool Markup Language","Hyper Transfer Markup Language"], resposta: 0 },
        { pergunta: "2. Qual é o propósito da tag <head> no HTML?", opcoes: ["Exibir o conteúdo principal","Conter metadados e links","Criar seções de texto","Mostrar imagens"], resposta: 1 },
        { pergunta: "3. Em CSS, qual propriedade muda a cor do texto?", opcoes: ["background-color","text-color","color","font-color"], resposta: 2 },
        { pergunta: "4. Em JavaScript, qual símbolo é usado para comentários de linha?", opcoes: ["<!-- -->","//","/* */","#"], resposta: 1 },
        { pergunta: "5. O que significa CSS?", opcoes: ["Creative Style System","Cascading Style Sheets","Computer Style Syntax","Colorful Style Script"], resposta: 1 },
        { pergunta: "6. Qual tag cria um link em HTML?", opcoes: ["<a>","<link>","<href>","<url>"], resposta: 0 },
        { pergunta: "7. Em CSS, qual unidade representa porcentagem?", opcoes: ["px","pt","%","em"], resposta: 2 },
        { pergunta: "8. Em JavaScript, qual comando mostra algo no console?", opcoes: ["log.console()","console.log()","show.console()","print()"], resposta: 1 },
        { pergunta: "9. Qual atributo define o caminho da imagem no HTML?", opcoes: ["link","href","src","path"], resposta: 2 },
        { pergunta: "10. Em CSS, qual propriedade muda o tamanho da fonte?", opcoes: ["text-size","font-weight","font-size","text-style"], resposta: 2 },
        { pergunta: "11. O que o comando 'var' faz no JavaScript?", opcoes: ["Cria uma variável","Cria uma função","Cria um objeto","Cria um loop"], resposta: 0 },
        { pergunta: "12. Qual elemento HTML é usado para listas não ordenadas?", opcoes: ["<ol>","<ul>","<li>","<dl>"], resposta: 1 },
        { pergunta: "13. O que é uma função em JavaScript?", opcoes: ["Um tipo de variável","Um bloco de código reutilizável","Um comando condicional","Um objeto de estilo"], resposta: 1 },
        { pergunta: "14. Em CSS, o que faz a propriedade 'margin'?", opcoes: ["Define o espaço interno","Define o espaço externo","Define a cor da borda","Define a posição do texto"], resposta: 1 },
        { pergunta: "15. Qual é o tipo de arquivo padrão de um script JavaScript?", opcoes: [".js",".html",".css",".json"], resposta: 0 }
    ];

    let indice = 0;
    let respostasUsuario = [];

    function mostrarPergunta() {
        const atual = perguntas[indice];
        perguntaTexto.innerText = atual.pergunta;
        opcoes.innerHTML = "";
        proximoBtn.disabled = true;
        atual.opcoes.forEach((op, i) => {
            const btn = document.createElement("button");
            btn.innerText = op;
            btn.addEventListener("click", () => {
                respostasUsuario[indice] = i;
                proximoBtn.disabled = false;
                Array.from(opcoes.children).forEach(b => b.classList.remove("selecionado"));
                btn.classList.add("selecionado");
            });
            opcoes.appendChild(btn);
        });
    }

    proximoBtn.addEventListener("click", () => {
        indice++;
        if (indice < perguntas.length) {
            mostrarPergunta();
        } else {
            mostrarResultado();
        }
    });

    function mostrarResultado() {
        document.getElementById("perguntaBox").style.display = "none";
        resultado.style.display = "block";

        let acertos = 0;
        perguntas.forEach((p, i) => {
            if (respostasUsuario[i] === p.resposta) acertos++;
        });
        let erros = perguntas.length - acertos;
        let percentual = Math.round((acertos / perguntas.length) * 100);

        let mensagemDesempenho = "";
        if (percentual >= 80) mensagemDesempenho = "Excelente!";
        else if (percentual >= 50) mensagemDesempenho = "Bom desempenho";
        else mensagemDesempenho = "Precisa melhorar";

        function criarTelaGrafico() {
            let texto = `${nomeJogador}, você acertou ${acertos}, errou ${erros}.<br>`;
            texto += `Aproveitamento: ${percentual}%<br>`;
            texto += `Desempenho: <strong>${mensagemDesempenho}</strong><br><br>`;
            texto += `<canvas id="graficoDesempenho" width="300" height="300"></canvas><br>`;
            texto += `<button id="verErros">Ver o que errou</button>`;
            mensagemFinal.innerHTML = texto;

            const ctx = document.getElementById("graficoDesempenho").getContext("2d");
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Acertos', 'Erros'],
                    datasets: [{
                        label: 'Desempenho',
                        data: [acertos, erros],
                        backgroundColor: ['#ffcc00', '#ff6b6b']
                    }]
                },
                options: { responsive: false }
            });

            const btnErros = document.getElementById("verErros");
            btnErros.addEventListener("click", mostrarErros);
        }

        function mostrarErros() {
            let textoErros = "";
            perguntas.forEach((p, i) => {
                if (respostasUsuario[i] !== p.resposta) {
                    textoErros += `${i + 1}. ${p.pergunta}<br>`;
                    textoErros += `Sua resposta: ${p.opcoes[respostasUsuario[i]] || 'Não respondeu'}<br>`;
                    textoErros += `Resposta correta: ${p.opcoes[p.resposta]}<br><br>`;
                }
            });
            mensagemFinal.innerHTML = `<div style="margin-top:20px; color:#ffcc00;">${textoErros}</div><button id="voltarGrafico">Voltar</button>`;
            document.getElementById("voltarGrafico").addEventListener("click", criarTelaGrafico);
        }

        criarTelaGrafico();
    }

    recomecar.addEventListener("click", () => {
        indice = 0;
        respostasUsuario = [];
        resultado.style.display = "none";
        document.getElementById("perguntaBox").style.display = "block";
        mostrarPergunta();
    });

    mostrarPergunta();
});

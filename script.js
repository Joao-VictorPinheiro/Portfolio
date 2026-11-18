
'use strict';
 

const PROJETOS = [
    {
        nome: 'Programa de notas',
        problema: 'Calcular a média das notas de um aluno sem fazer a conta à mão.',
        publico: 'Alunos e professores da turma.',
        contribuicao: 'Escrevi o programa inteiro (projeto de aula).',
        tecnologias: ['Java'],
        imagem: 'imagens/notas.svg',
        alt: 'Imagem de exemplo do programa de notas',
        link: 'https://github.com/Joao-VictorPinheiro/portfolio'
    },
    {
        nome: 'Portfólio',
        problema: 'Reunir meus dados e projetos em um só lugar.',
        publico: 'Professores e recrutadores de estágio.',
        contribuicao: 'Fiz o HTML, o CSS e o JavaScript (atividade de aula).',
        tecnologias: ['HTML', 'CSS', 'JavaScript'],
        imagem: 'imagens/portfolio.svg',
        alt: 'Imagem de exemplo do portfólio',
        link: 'https://github.com/Joao-VictorPinheiro/portfolio'
    }
];
 
const LIMITES = {
    nome: { min: 3, max: 80 },
    assunto: { min: 5, max: 100 },
    mensagem: { min: 30, max: 1000 }
};
 
const contarCaracteres = (texto) => Array.from(texto.trim()).length;
 

const elProjetos = {
    filtros: document.getElementById('filtros'),
    busca: document.getElementById('busca'),
    lista: document.getElementById('lista-projetos'),
    contagem: document.getElementById('contagem'),
    vazio: document.getElementById('sem-resultados')
};
 
const filtroAtual = { tecnologia: 'Todos', busca: '' };
 
function listarTecnologias(projetos) {
    return ['Todos', ...new Set(projetos.flatMap((p) => p.tecnologias))];
}
 
function filtrarProjetos(projetos, { tecnologia, busca }) {
    const termo = busca.trim().toLowerCase();
    return projetos.filter((p) => {
        const passaTecnologia = tecnologia === 'Todos' || p.tecnologias.includes(tecnologia);
        const texto = `${p.nome} ${p.problema} ${p.tecnologias.join(' ')}`.toLowerCase();
        return passaTecnologia && texto.includes(termo);
    });
}
 
function criarElemento(tag, texto) {
    const el = document.createElement(tag);
    el.textContent = texto;
    return el;
}
 
function criarCardProjeto(projeto) {
    const card = document.createElement('article');
    card.className = 'projeto';
 
    const imagem = new Image(320, 180);
    imagem.src = projeto.imagem;
    imagem.alt = projeto.alt;
 
    const detalhes = [
        ['Problema', projeto.problema],
        ['Público', projeto.publico],
        ['Minha contribuição', projeto.contribuicao],
        ['Tecnologias', projeto.tecnologias.join(', ')]
    ];
 
    const link = criarElemento('a', `Ver código: ${projeto.nome}`);
    link.href = projeto.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
 
    card.append(imagem, criarElemento('h3', projeto.nome));
    detalhes.forEach(([rotulo, valor]) => card.append(criarElemento('p', `${rotulo}: ${valor}`)));
    card.append(link);
    return card;
}
 
function renderizarFiltros() {
    listarTecnologias(PROJETOS).forEach((tecnologia) => {
        const botao = criarElemento('button', tecnologia);
        botao.type = 'button';
        botao.dataset.tecnologia = tecnologia;
        elProjetos.filtros.append(botao);
    });
}
 
function atualizarBotoesDoFiltro() {
    elProjetos.filtros.querySelectorAll('button').forEach((botao) => {
        const ativo = botao.dataset.tecnologia === filtroAtual.tecnologia;
        botao.setAttribute('aria-pressed', String(ativo));
    });
}
 
function renderizarProjetos() {
    const encontrados = filtrarProjetos(PROJETOS, filtroAtual);
    elProjetos.lista.replaceChildren(...encontrados.map(criarCardProjeto));
    elProjetos.vazio.hidden = encontrados.length > 0;
    elProjetos.contagem.textContent =
        `${encontrados.length} ${encontrados.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}`;
    atualizarBotoesDoFiltro();
}
 
function iniciarProjetos() {
    renderizarFiltros();
    elProjetos.filtros.addEventListener('click', (evento) => {
        const botao = evento.target.closest('button');
        if (!botao) return;
        filtroAtual.tecnologia = botao.dataset.tecnologia;
        renderizarProjetos();
    });
    elProjetos.busca.addEventListener('input', () => {
        filtroAtual.busca = elProjetos.busca.value;
        renderizarProjetos();
    });
    renderizarProjetos();
}
 
const form = document.getElementById('form-contato');
const campos = {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    motivo: document.getElementById('motivo'),
    assunto: document.getElementById('assunto'),
    mensagem: document.getElementById('mensagem')
};
const elForm = {
    assuntoBox: document.getElementById('assunto-box'),
    contador: document.getElementById('contador'),
    resumo: document.getElementById('resumo-erros'),
    status: document.getElementById('status-form'),
    botao: document.getElementById('botao-enviar'),
    modo: document.getElementById('modo-envio')
};
 
const camposUsados = new Set();
let enviando = false;
let statusEhSucesso = false;
 
function lerDados() {
    return {
        nome: campos.nome.value.trim(),
        email: campos.email.value.trim(),
        motivo: campos.motivo.value,
        assunto: campos.assunto.value.trim(),
        mensagem: campos.mensagem.value.trim() // só as pontas; o miolo não é alterado
    };
}
 
function montarDadosProcessados(dados) {
    const { assunto, ...base } = dados;
    return dados.motivo === 'Outro' ? { ...base, assunto } : base;
}

function validarTamanho(texto, rotulo, { min, max }) {
    const total = contarCaracteres(texto);
    if (total === 0) return `Informe ${rotulo}.`;
    if (total < min) return `Use pelo menos ${min} caracteres (agora: ${total}).`;
    if (total > max) return `Use no máximo ${max} caracteres (agora: ${total}).`;
    return '';
}
 
const validadores = {
    nome: (d) => validarTamanho(d.nome, 'seu nome', LIMITES.nome),
    email: (d) => {
        if (!d.email) return 'Informe seu e-mail.';
        if (campos.email.validity.typeMismatch) return 'Esse e-mail parece inválido. Exemplo: nome@dominio.com.';
        return '';
    },
    motivo: (d) => (d.motivo ? '' : 'Escolha um motivo do contato.'),
    assunto: (d) => (d.motivo === 'Outro' ? validarTamanho(d.assunto, 'o assunto', LIMITES.assunto) : ''),
    mensagem: (d) => validarTamanho(d.mensagem, 'sua mensagem', LIMITES.mensagem)
};
 
/* --- apresentação de erros --- */
function mostrarErro(nomeCampo, mensagem) {
    document.getElementById(`${nomeCampo}-erro`).textContent = mensagem;
    if (mensagem) {
        campos[nomeCampo].setAttribute('aria-invalid', 'true');
    } else {
        campos[nomeCampo].removeAttribute('aria-invalid');
    }
}
 
function validarCampo(nomeCampo) {
    const mensagem = validadores[nomeCampo](lerDados());
    mostrarErro(nomeCampo, mensagem);
    return mensagem;
}
 
function validarTudo() {
    return Object.keys(campos)
        .map((nomeCampo) => ({ nomeCampo, mensagem: validarCampo(nomeCampo) }))
        .filter((item) => item.mensagem);
}
 
function mostrarResumo(erros) {
    const titulo = criarElemento('p', 'Corrija os campos abaixo para enviar:');
    const lista = document.createElement('ul');
    erros.forEach(({ nomeCampo, mensagem }) => {
        const rotulo = document.querySelector(`label[for="${nomeCampo}"]`).textContent;
        lista.append(criarElemento('li', `${rotulo}: ${mensagem}`));
    });
    elForm.resumo.replaceChildren(titulo, lista);
    elForm.resumo.hidden = false;
}
 
function limparResumo() {
    elForm.resumo.hidden = true;
    elForm.resumo.replaceChildren();
}
 
function mostrarStatus(texto, sucesso = false) {
    elForm.status.textContent = texto;
    statusEhSucesso = sucesso;
}
 
function atualizarAssunto() {
    const precisa = campos.motivo.value === 'Outro';
    elForm.assuntoBox.hidden = !precisa;
    campos.assunto.disabled = !precisa;
    if (!precisa) {
        campos.assunto.value = '';
        mostrarErro('assunto', '');
        camposUsados.delete('assunto');
    }
}
 
function atualizarContador() {
    const { min, max } = LIMITES.mensagem;
    elForm.contador.textContent =
        `${contarCaracteres(campos.mensagem.value)} / ${max} caracteres (mínimo ${min})`;
}
 

function enviarDemonstracao(dados, modo) {
    return new Promise((resolver, rejeitar) => {
        setTimeout(() => {
            if (modo === 'falha') rejeitar(new Error('Falha simulada'));
            else resolver({ ok: true, dados });
        }, 1500);
    });
}
 
function definirProcessando(ativo) {
    enviando = ativo;
    elForm.botao.disabled = ativo;
    elForm.botao.textContent = ativo ? 'Enviando...' : 'Enviar';
    form.setAttribute('aria-busy', String(ativo));
}
 
async function aoEnviar(evento) {
    evento.preventDefault();
    if (enviando) return;
 
    mostrarStatus('');
    Object.keys(campos).forEach((nomeCampo) => camposUsados.add(nomeCampo));
    const erros = validarTudo();
    if (erros.length) {
        mostrarResumo(erros);
        campos[erros[0].nomeCampo].focus();
        return;
    }
    limparResumo();
 
    definirProcessando(true);
    mostrarStatus('Enviando mensagem (simulação)...');
    try {
        await enviarDemonstracao(montarDadosProcessados(lerDados()), elForm.modo.value);
        form.reset();
        camposUsados.clear();
        atualizarAssunto();
        atualizarContador();
        mostrarStatus('Sucesso (simulação): nenhum e-mail foi enviado. Para contato real, use o e-mail da página.', true);
    } catch (erro) {
        mostrarStatus('Falha ao enviar. Seus dados foram mantidos; tente novamente.');
    } finally {
        definirProcessando(false);
    }
}
 
function iniciarFormulario() {
    atualizarAssunto();
    atualizarContador();
 
    form.addEventListener('submit', aoEnviar);
 
    
    form.addEventListener('focusout', (evento) => {
        const nomeCampo = evento.target.name;
        if (campos[nomeCampo] && !campos[nomeCampo].disabled) {
            camposUsados.add(nomeCampo);
            validarCampo(nomeCampo);
        }
    });
 
    form.addEventListener('input', (evento) => {
        const nomeCampo = evento.target.name;
        if (statusEhSucesso) mostrarStatus('');
        if (nomeCampo === 'mensagem') atualizarContador();
        if (camposUsados.has(nomeCampo)) validarCampo(nomeCampo);
    });
 
    campos.motivo.addEventListener('change', () => {
        atualizarAssunto();
        if (camposUsados.has('motivo')) validarCampo('motivo');
    });
}
 
iniciarProjetos();
iniciarFormulario();

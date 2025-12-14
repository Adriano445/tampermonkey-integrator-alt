js
// ==UserScript==
// @name         Pesquisa Rápida + Auto Buscar - Integrator ALT
// @namespace    https://integrator6.alt.com.br/
// @version      1.2
// @description  Botões rápidos que configuram e disparam a pesquisa automaticamente
// @match        https://integrator6.alt.com.br/*
// @downloadURL  https://raw.githubusercontent.com/Adriano445/tampermonkey-integrator-alt/main/pesquisa-rapida-alt.user.js
// @updateURL    https://raw.githubusercontent.com/Adriano445/tampermonkey-integrator-alt/main/pesquisa-rapida-alt.user.js
// @grant        none
// ==/UserScript==
  
(function () {
  'use strict';

  const PANEL_ID = 'painel-pesquisa-rapida-alt';

  function dispararEventos(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function clicarPesquisar() {
    const botaoPesquisar = document.querySelector(
      'button.btn-primary[type="submit"]'
    );

    if (botaoPesquisar) {
      setTimeout(() => botaoPesquisar.click(), 150);
    }
  }

  function criarPainel() {
    if (document.getElementById(PANEL_ID)) return;

    const labelPesquisa = [...document.querySelectorAll('label.control-label')]
      .find(l => l.textContent.trim() === 'Pesquisa');

    if (!labelPesquisa) return;

    const container = document.createElement('div');
    container.id = PANEL_ID;
    container.style.display = 'flex';
    container.style.marginBottom = '8px';

    function criarBotao(texto, campoValue, condicaoValue) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = texto;
      btn.style.marginRight = '5px';

      btn.addEventListener('click', () => {
        const campo = document.getElementById('campo');
        const condicao = document.getElementById('condicao');
        const inputValor = document.querySelector('input[formcontrolname="valor"]');

        if (!campo || !condicao || !inputValor) {
          alert('Campos de pesquisa não encontrados');
          return;
        }

        // Define campo
        campo.value = campoValue;
        dispararEventos(campo);

        // Define condição
        condicao.value = condicaoValue;
        dispararEventos(condicao);

        // Usa valor atual do input (se existir)
        if (inputValor.value.trim() !== '') {
          clicarPesquisar();
        } else {
          inputValor.focus();
          inputValor.addEventListener(
            'keydown',
            (e) => {
              if (e.key === 'Enter') {
                clicarPesquisar();
              }
            },
            { once: true }
          );
        }
      });

      return btn;
    }

    container.appendChild(criarBotao('Nome', 'nome_cli', 'like'));
    container.appendChild(criarBotao('Código', 'codcli', '='));
    container.appendChild(criarBotao('CPF', 'cpf', 'like'));
    container.appendChild(criarBotao('CNPJ', 'cnpj', 'like'));

    labelPesquisa.parentElement.insertBefore(container, labelPesquisa);
  }

  // SPA / Angular observer
  const observer = new MutationObserver(criarPainel);
  observer.observe(document.body, { childList: true, subtree: true });

  criarPainel();
})();

describe('Jogo da Memória', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('carrega o tabuleiro com 16 cartas', () => {
    cy.get('.card').should('have.length', 16);
  });

  it('vira uma carta ao clicar', () => {
    cy.get('.card').first().click().should('have.class', 'revealed');
  });

  it('não permite clicar duas vezes na mesma carta', () => {
    cy.get('.card').first().click().click();
    cy.get('.card.revealed').should('have.length', 1);
  });

  it('vira duas cartas diferentes e esconde após 1 segundo', () => {
    // Garante que as duas primeiras não são o mesmo par
    cy.get('.card').then(cards => {
      let first = cards[0];
      let second = [...cards].find(c => c.dataset.emoji !== first.dataset.emoji);

      cy.wrap(first).click();
      cy.wrap(second).click();

      cy.wait(1200);

      cy.wrap(first).should('not.have.class', 'revealed');
      cy.wrap(second).should('not.have.class', 'revealed');
    });
  });

  it('mantém duas cartas viradas se forem iguais', () => {
    // Encontra duas cartas com o mesmo emoji
    cy.get('.card').then(cards => {
      let pairs = {};

      for (let card of cards) {
        const emoji = card.dataset.emoji;
        if (!pairs[emoji]) {
          pairs[emoji] = [card];
        } else {
          pairs[emoji].push(card);
          break;
        }
      }

      const [first, second] = Object.values(pairs).flat();

      cy.wrap(first).click();
      cy.wrap(second).click();

      cy.wrap(first).should('have.class', 'revealed');
      cy.wrap(second).should('have.class', 'revealed');
    });
  });

  it('reinicia o jogo ao clicar no botão "Reiniciar"', () => {
    cy.get('.card').first().click();
    cy.get('#reset').click();

    cy.get('.card.revealed').should('have.length', 0);
    cy.get('.card').should('have.length', 16);
  });

  it('exibe mensagem de vitória ao acertar todos os pares', () => {
    // Simula clique em todos os pares corretos
    const revealed = new Set();

    cy.get('.card').then(cards => {
      const map = {};

      for (let card of cards) {
        const emoji = card.dataset.emoji;
        if (!map[emoji]) {
          map[emoji] = [card];
        } else {
          map[emoji].push(card);
        }
      }

      const pairs = Object.values(map);

      function clickNextPair(i) {
        if (i >= pairs.length) return;

        const [first, second] = pairs[i];
        cy.wrap(first).click();
        cy.wrap(second).click();

        cy.wait(600).then(() => clickNextPair(i + 1));
      }

      clickNextPair(0);
    });

    cy.get('#status', { timeout: 10000 }).should('contain', 'Você venceu!');
  });
});

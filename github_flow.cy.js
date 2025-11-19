describe('Fluxo de Autenticação e Navegação no GitHub', () => {
  it('Deve logar, navegar e validar informações do usuário', () => {
    // 1. Abrir o navegador e Acessar a página inicial
    cy.visit('/');

    // 2. Acessar a página de login
    cy.contains('Sign in').click();

    // 3. Preencher e Efetuar a autenticação
    cy.get('#login_field', { timeout: 10000 })
      .type(Cypress.env('EMAIL'));
    cy.get('#password').type(Cypress.env('PASSWORD'));
    cy.get('.btn-primary').click();

    // 4. Validações Pós-Login
    cy.url().should('not.include', '/login');
    cy.url().should('include', 'github.com'); 

    // 5. Validar o nome do usuário (CORRIGIDO: Abertura do Menu)
    // O seletor .Header-item button[aria-label*="View profile"] é o mais resiliente.
    cy.get('.Header-item button[aria-label*="View profile"]').click(); 
    
    // O seletor abaixo (a.Truncate-text) só funciona depois que o menu está aberto!
    cy.get('a.Truncate-text').should('be.visible'); 
  });
});

// Continuação no mesmo arquivo github_flow.cy.js, ou em outro teste separado.

it('Deve interagir com Repositórios: navegar e criar um novo', () => {
  // Pré-requisito: o usuário deve estar logado.
  
  // 1. Navegar para a página de perfil
  // SUBSTITUA 'SEU_NOME_DE_USUARIO_REAL'
  cy.visit('/Lj-2013'); 
  
  // 2. Clicar na aba Repositories (CORREÇÃO FINAL: IGNORANDO O CONTÊINER VOLÁTIL)
  
  // O seletor cy.contains(regex) procura o texto "Repositories" ou "Repositórios" 
  // em QUALQUER lugar do DOM, garantindo que o link correto seja encontrado e clicado.
  cy.contains('a', /Repositories|Repositórios/, { timeout: 10000 }).click();

  // 3. Acessar um repositório aleatório do perfil
  cy.get('#user-repositories-list') 
    .find('a[itemprop="name codeRepository"]') 
    .first() 
    .click();

  // 4. Navegar até a aba Pull Requests
  cy.contains('Pull requests').click();
  cy.url().should('include', '/pulls');

  // 5. Criar um novo repositório (Usando XPath)
  cy.visit('/new');
  const newRepoName = 'teste-qa-automatizado-' + Date.now();
  
  cy.xpath('//*[@id="repository_name"]', { timeout: 10000 }).type(newRepoName);
  cy.xpath('//button[normalize-space(text())="Create repository"]').click(); 

  // 6. Acessar a tela do repositório criado
  cy.url().should('include', newRepoName);
  cy.contains('Quick setup').should('be.visible');
});

// Continuação no mesmo arquivo github_flow.cy.js.

it('Deve realizar o Logout e validar a finalização', () => {
    // 1. Deslogar da conta (CORREÇÃO FINAL ROBUSTA - Focando no Botão de Perfil)
    
    // Procura o botão (com role="button") no cabeçalho que abre o menu de perfil.
    cy.get('header button[aria-label^="View profile"]').click();

    // 2. Clica no botão "Sign out" dentro do menu que abriu
    cy.contains('Sign out').click();

    // 3. Validar que o logout foi realizado com sucesso
    cy.url().should('include', 'github.com/login'); 
    cy.contains('Sign in').should('be.visible'); 
});
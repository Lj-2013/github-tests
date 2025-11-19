// IMPORTANTE: Este teste requer que o plugin cypress-xpath esteja configurado
// e que as variáveis de ambiente EMAIL e PASSWORD estejam no arquivo .env.

describe('Fluxo de Autenticação e Navegação no GitHub', () => {

  // --- Teste 1: Login e Validação de Usuário ---
  it('Deve logar e validar as informações do usuário logado', () => {
    // 1. Abrir o navegador e Acessar a página inicial
    cy.visit('/');

    // 2. Acessar a página de login
    cy.contains('Sign in').click();

    // 3. Preencher e Efetuar a autenticação
    cy.get('#login_field', { timeout: 10000 }).type(Cypress.env('EMAIL'));
    cy.get('#password').type(Cypress.env('PASSWORD'));
    cy.get('.btn-primary').click();

    // 4. Validações Pós-Login
    cy.url().should('not.include', '/login');
    cy.url().should('include', 'github.com'); 

    // 5. Validar o nome do usuário (Abertura do Menu)
    // CORREÇÃO DEFINITIVA COM FORÇA: Encontra a imagem do avatar, sobe para o elemento clicável mais próximo e força o clique.
    cy.get('header img', { timeout: 10000 }) 
      .should('be.visible') // Espera a imagem ser visível
      .closest('a, button, summary') // Sobe para o elemento interativo mais próximo
      .click({ force: true }); // Força o clique devido à instabilidade do cabeçalho do GitHub
    
    // O seletor abaixo (a.Truncate-text) só funciona depois que o menu está aberto!
    cy.get('a.Truncate-text').should('be.visible');
  });

  // --- Teste 2: Interação com Repositórios ---
  it('Deve interagir com Repositórios: navegar e criar um novo', () => {
    // 1. Navegar para a página de perfil (CORRIGIDO: Substitua /Lj-2013 pelo usuário real)
    // Se o seu usuário for Lj-2013, o código está correto.
    cy.visit('/Lj-2013'); 
    
    // 2. Clicar na aba Repositories (Usando cy.contains genérico para o elemento <a>)
    // Este seletor suporta inglês (Repositories) ou português (Repositórios).
    cy.contains('a', /Repositories|Repositórios/, { timeout: 10000 }).click(); 

    // 3. Acessar um repositório aleatório do perfil
    cy.get('#user-repositories-list')
      .find('a[itemprop="name codeRepository"]') 
      .first()
      .click();

    // 4. Navegar até a aba Pull Requests
    cy.contains('Pull requests').click();
    cy.url().should('include', '/pulls');

    // 5. Criar um novo repositório (Usando XPath com Correção de Timing)
    cy.visit('/new');
    const newRepoName = 'teste-qa-automatizado-' + Date.now();
    
    // Espera o título da página de criação aparecer para estabilizar a navegação
    cy.contains('h1', /Create a new repository|Criar um novo repositório/, { timeout: 10000 }); 
    
    // Agora que a página está estável, procuramos o campo de input e digitamos
    cy.xpath('//*[@id="repository_name"]', { timeout: 10000 })
      .type(newRepoName);
      
    cy.xpath('//button[normalize-space(text())="Create repository"]').click();

    // 6. Acessar a tela do repositório criado
    cy.url().should('include', newRepoName);
    cy.contains('Quick setup').should('be.visible');
  });

  // --- Teste 3: Logout e Finalização ---
  it('Deve realizar o Logout e validar a finalização', () => {
    // 1. Deslogar da conta (CORREÇÃO DEFINITIVA: Encontra a imagem e clica no elemento clicável)
    // Procura a imagem no cabeçalho, garante a visibilidade e clica no elemento clicável mais próximo.
    cy.get('header img', { timeout: 10000 })
      .should('be.visible')
      .closest('a, button, summary')
      .click({ force: true }); // Força o clique para garantir que o menu abra

    // 2. Clica no botão "Sign out" dentro do menu que abriu
    cy.contains('Sign out').click();

    // 3. Validar que o logout foi realizado com sucesso
    cy.url().should('include', 'github.com/login');
    cy.contains('Sign in').should('be.visible');
  });
});
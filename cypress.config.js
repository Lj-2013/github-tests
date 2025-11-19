// cypress.config.js

const { defineConfig } = require('cypress');
// 1. Importa a biblioteca dotenv
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    // A função setupNodeEvents é onde a mágica acontece
    setupNodeEvents(on, config) {
      // 2. Itera sobre as variáveis do processo Node.js (process.env)
      // e as injeta no objeto de configuração do Cypress (config.env)
      config.env = config.env || {};

      // Injeta variáveis específicas (EMAIL e PASSWORD) no Cypress.env()
      config.env.EMAIL = process.env.EMAIL;
      config.env.PASSWORD = process.env.PASSWORD;

      // Opcional: injeta TODAS as variáveis, se preferir
      // for (const key in process.env) {
      //   config.env[key] = process.env[key];
      // }

      // 3. Retorna a configuração modificada
      return config;
    },
    baseUrl: 'https://www.github.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});

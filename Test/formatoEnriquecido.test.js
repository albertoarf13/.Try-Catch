const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const split = require('../src/controllers/preguntasController.js')
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[formato enriquedico] caso correcto', async () => {
    
    let text = "noCodigoPrueba -code- codigoPrueba -code- noCodigoPrueba"
    res = split.splitPrueba(text)
    expect(res).toBe(450);
});

test('[formato enriquedico] caso incorrecto', async () => {
    
    let text = "noCodigoPrueba -c- codigoPrueba -c- noCodigoPrueba"
    res = split.splitPrueba(text)
    expect(res).toBe(451);
});
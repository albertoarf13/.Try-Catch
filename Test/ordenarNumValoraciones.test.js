const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Ordenar num valoradas] por las mejores', async () => {
    
    const response = await request(app).get("/busqueda?bus=quijote#");
    expect(response.status).toBe(401);
});

test('[Ordenar num valoradas] por las peores', async () => {
    
    const response = await request(app).get("/busqueda?bus=test#");
    expect(response.status).toBe(401);
});
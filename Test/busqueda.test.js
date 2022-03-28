const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Busqueda basica] Prueba', async () => {
    
    const response = await request(app).get("/busqueda/test");
    expect(response.status).toBe(401);
  
});

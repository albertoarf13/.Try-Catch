const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Borrar comentario]', async () => {
    
    const response = await request(app).get("/preguntas/229/borrar_respuesta_respuesta");
    expect(response.status).toBe(302);
  
});
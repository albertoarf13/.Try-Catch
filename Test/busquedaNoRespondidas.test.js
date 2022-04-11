const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Busqueda no respondidas] con resultado', async () => {
    
    const response = await request(app).get("/busqueda?bus=test&respondidas=false");
    expect(response.status).toBe(401);
  
});

test('[Busqueda no respondidas] sin resultado', async () => {
    
    const response = await request(app).get("/busqueda?bus=asdasdasdasdd&respondidas=false");
    expect(response.status).toBe(401);
  
});

test('[Busqueda no respondidas] sin resultado pagina 2', async () => {
    
    const response = await request(app).get("/busqueda?bus=asdasdasdasdd&respondidas=false&page=2");
    expect(response.status).toBe(401);
  
});

test('[Busqueda no respondidas] buscar por etiquetas', async () => {
    
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?bus=test&etiquetas=3&respondidas=false");
    expect(response.status).toBe(401);
  
});

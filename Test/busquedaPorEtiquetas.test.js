const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Busqueda por etiquetas] con resultado', async () => {
    
    // Se buscan preguntas que contienen 'test' y las etiquetas de C++(1) o GPS(3)
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?busqueda=test&etiquetas=1&etiquetas=3");
    expect(response.status).toBe(401);
  
});

test('[Busqueda por etiquetas] sin resultado', async () => {
    
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?busqueda=asdasdasdasd");
    expect(response.status).toBe(401);
  
});

test('[Busqueda por etiquetas] sin resultado pagina 2', async () => {
    
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?busqueda=asdasdasdasd&page=2");
    expect(response.status).toBe(401);
  
});

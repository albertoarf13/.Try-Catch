const request = require('supertest');
const routes = require('./src/routes/routes');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});
test('[Busqueda basica por preguntas respondidas] con resultado', async () => {
    
    const response = await request(app).get("/busqueda?bus=test?respondidas=true");
    expect(response.status).toBe(401);
  
});

test('[Busqueda respondidas] sin resultado', async () => {
    
    const response = await request(app).get("/busqueda?bus=asdasdasdasdd&respondidas=true");
    expect(response.status).toBe(401);
  
});

test('[Busqueda respondidas] sin resultado pagina 2', async () => {
    
    const response = await request(app).get("/busqueda?bus=asdasdasdasdd&respondidas=true&page=2");
    expect(response.status).toBe(401);
  
});

test('[Busqueda respondidas] buscar por etiquetas', async () => {
    
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?bus=test&etiquetas=3&respondidas=true");
    expect(response.status).toBe(401);
  
});

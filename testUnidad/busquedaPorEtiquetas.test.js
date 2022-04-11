const request = require('supertest');
const routes = require('./src/routes/routes');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Busqueda por etiquetas] con resultado', async () => {
    
    // Se buscan preguntas que contienen 'test' y las etiquetas de C++(1) o GPS(3)
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?bus=test&etiquetas=1&etiquetas=3");
    expect(response.status).toBe(401);
  
});

test('[Busqueda por etiquetas] sin resultado', async () => {
    
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?bus=asdasdasdasd");
    expect(response.status).toBe(401);
  
});

test('[Busqueda por etiquetas] sin resultado pagina 2', async () => {
    
    const response = await request(app).get("/preguntas/busqueda-por-etiquetas?bus=asdasdasdasd&page=2");
    expect(response.status).toBe(401);
  
});

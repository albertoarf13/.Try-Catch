const request = require('supertest');
const routes = require('./src/routes/routes');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Ordenar por numero de valoraciones] ascendente', async () => {
    
    const response = await request(app).get("/busqueda?bus=test&vals=true");
    expect(response.status).toBe(401);
  
});

test('[Ordenar por numero de valoraciones] descendente', async () => {
    
    const response = await request(app).get("/busqueda?bus=test&vals=false");
    expect(response.status).toBe(401);
  
});

const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Busqueda basica] con resultado', async () => {
    
    const response = await request(app).get("/busqueda?bus=test");
    expect(response.status).toBe(401);
  
});

test('[Busqueda basica] sin resultado', async () => {
    
    const response = await request(app).get("/busqueda?bus=%");
    expect(response.status).toBe(401);
  
});

test('[Busqueda basica] sin resultado', async () => {
    
    const response = await request(app).get("/busqueda?bus=test&page=2");
    expect(response.status).toBe(401);
  
});
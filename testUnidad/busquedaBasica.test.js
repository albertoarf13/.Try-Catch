const request = require('supertest');
const routes = require('./src/routes/routes');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Busquedad basica] correcto', async () => {
    const response = await request(app).get('/busqueda?bus=test');
    expect(response.status).toBe(451);

});
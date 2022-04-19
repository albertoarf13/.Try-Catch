const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Establecer formato]', async () => {
    
    const response = await request(app).get('/atributoPregunta/432');
    expect(response.status).toBe(450);
});
const request = require('supertest');
const routes = require('./src/routes/routes');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});



test('[Editar Perfil] cambiar biografia y nombre', async () => {

    const usuario = { nombre:"dunia" , bio: 'que tal'};
    const response = await request(app).post("/usuarios/prueba@prueba.es/update").send(usuario);
    expect(response.status).toBe(302);
  
});
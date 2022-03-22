const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
var session = require('supertest-session');
var testSession = null;
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

beforeEach(function () {
    testSession = session(app);
});

//Test de integracion usando la sesion actual
test('[Ver atributos pregunta] Pregunta correcta', async () => {
    const id = 1;
    const response = await request(app).get("/atributoPregunta/:id").set(id);
    expect(response.status).toBe(201);
  
});
/*
test('[Registro] Usuarios existente', async () => {
    const usuario = { nombre: 'prueba', email: 'prueba@prueba.es', password: '1234567Aa', password2: '1234567Aa' };
    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(402);

});
test('[Registro] Usuario datos vacios', async () => {
    const usuario = { nombre: '', email: '', password: '', password2: '' };
    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(401);

});

test('[Registro] Usuarios nombre incorrecto', async () => {
    const usuario = { nombre: 'p', email: 'prueba@prueb.es', password: '12345Aa', password2: '12345Aa' };
    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(401);

});

test('[Registro] Usuarios contraseña diferente', async () => {
    const usuario = { nombre: 'prueba', email: 'prueba@prueb.es', password: '12345Aa', password2: '12345Aa' };    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(401);

});

test('[Registro] Usuarios contraseña insuficiente numero caracteres', async () => {
    const usuario = { nombre: 'prueba', email: 'prueb.es', password: '12345', password2: '12345' };
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(401);

});

test('[Registro] Usuarios contraseña falta mayusucla', async () => {
    const usuario = { nombre: 'prueba', email: 'prueb.es', password: '1234567a', password2: '1234567a' };
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(401);

});

test('[Registro] Usuarios contraseña falta minuscula', async () => {
    const usuario = { nombre: 'prueba', email: 'prueb.es', password: '1234567A', password2: '1234567A' };
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(401);

});

test('[Inicio de sesion] correo/contraseña correcto', async () => {
    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    
    testSession.post('/login')
    .send(usuario)
    .expect(201);

});

test('[Inicio de sesion] Usuarios correo/contraseña incorrecto', async () => {
    const usuario = { correo: 'prueba@prueba.es', contraseya: 'noexiste'};
    console.log(usuario.correo);
    
    testSession.post('/login')
    .send(usuario)
    .expect(401);

});
*/
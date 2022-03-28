const request = require('supertest');
const app = require('./src/app');
const routes = require('./src/routes/routes');
const session = require('supertest-session');
const { beforeAll} = require('@jest/globals');
var usuarios = []; 
beforeAll(() => {
    app.use('/', routes);  
});


test('[Registro] Usuarios correcto', async () => {// no se esta eliminando, deberia?
    const usuario = { nombre: 'prueba', email: 'prueba@prueba.es', password: '1234567Aa', password2: '1234567Aa' };
    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(451);

});
test('[Registro] Usuario datos vacios', async () => {
    const usuario = { nombre: '', email: '', password: '', password2: '' };
    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(450);

});

test('[Registro] Usuarios nombre incorrecto', async () => {
    const usuario = { nombre: 'p', email: 'prueba@prueb.es', password: '12345Aa', password2: '12345Aa' };
    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(450);

});

test('[Registro] Usuarios contraseña diferente', async () => {
    const usuario = { nombre: 'prueba', email: 'prueba@prueb.es', password: '12345Aa', password2: '12345Aa' };    
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(450);

});

test('[Registro] Usuarios contraseña insuficiente numero caracteres', async () => {
    const usuario = { nombre: 'prueba', email: 'prueb.es', password: '12345', password2: '12345' };
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(450);

});

test('[Registro] Usuarios contraseña falta mayusucla', async () => {
    const usuario = { nombre: 'prueba', email: 'prueb.es', password: '1234567a', password2: '1234567a' };
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(450);

});

test('[Registro] Usuarios contraseña falta minuscula', async () => {
    const usuario = { nombre: 'prueba', email: 'prueb.es', password: '1234567A', password2: '1234567A' };
    const response = await request(app).post("/sign-up").send(usuario);
    expect(response.status).toBe(450);

});


module.exports = usuarios;
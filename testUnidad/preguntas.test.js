const request = require('supertest');
const routes = require('./src/routes/routes');
const session = require('supertest-session');
const app = require('./src/app.js');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

/*

test('[Crear pregunta] con sesion iniciada sin etiquetas correcto', async () => {

    const usuario_r = { nombre: 'crearPregunta1', email: 'testcrear@pregunta.es', password: '1234567Aa', password2: '1234567Aa' };
    

    const usuario_l = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        titulo: "Pregunta test",
        descripcion: "Pregunta con etiqueta ",
        etiquetas: []
    }

    let testSession = session(app);

    const response1 = await request(app).post("/sign-up").send(usuario_r);
    const response2 = await testSession.post('/login').send(usuario_l);
    const response = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response.status).toBe(302);

});*/

test('[Crear pregunta] con sesion iniciada con titulo incorrecto', async () => {

    const usuario_r = { nombre: 'crearPregunta2', email: 'testcrear@pregunta.es', password: '1234567Aa', password2: '1234567Aa' };
    
    const usuario_l = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        titulo: "",
        descripcion: "Pregunta con etiqueta ",
        etiquetas: [1]
    }
    
    let testSession = session(app);

    const response1 = await request(app).post("/sign-up").send(usuario_r);
    const response2 = await testSession.post('/login').send(usuario_l);
    const response = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response.status).toBe(302);

});
test('[Crear pregunta] con sesion iniciada con descripcion incorrecto', async () => {

    const usuario_r = { nombre: 'crearPregunta2', email: 'testcrear@pregunta.es', password: '1234567Aa', password2: '1234567Aa' };
    
    const usuario_l = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        titulo: "Pregunta",
        descripcion: "",
        etiquetas: [1]
    }
    
    let testSession = session(app);

    const response1 = await request(app).post("/sign-up").send(usuario_r);
    const response2 = await testSession.post('/login').send(usuario_l);
    const response = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response.status).toBe(302);

});

test('[Crear pregunta] con sesion iniciada con titulo incorrecto', async () => {

    const usuario_r = { nombre: 'crearPregunta2', email: 'testcrear@pregunta.es', password: '1234567Aa', password2: '1234567Aa' };
    
    const usuario_l = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        titulo: "Pregunta",
        descripcion: "Pregunta",
        etiquetas: undefined
    }
    
    let testSession = session(app);

    const response1 = await request(app).post("/sign-up").send(usuario_r);
    const response2 = await testSession.post('/login').send(usuario_l);
    const response = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response.status).toBe(302);
});
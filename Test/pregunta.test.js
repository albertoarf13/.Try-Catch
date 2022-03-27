const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
var bodyParser = require('body-parser')
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Crear pregunta] con sesion iniciada sin etiquetas correcto', async () => {

    const usuario_r = { nombre: 'crearPregunta1', email: 'testcrear@pregunta.es', password: '1234567Aa', password2: '1234567Aa' };
    
    await request(app).post("/sign-up").send(usuario_r);
    const usuario_l = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        titulo: "Pregunta test",
        descripcion: "Pregunta con etiqueta ",
        etiquetas: []
    }

    let testSession = session(app);


    await testSession.post('/login').send(usuario_l);
    const response = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response.text).toBe('Found. Redirecting to /preguntas/crear');

});
test('[Crear pregunta] con sesion iniciada con etiquetas correcto', async () => {

    const usuario_r = { nombre: 'crearPregunta2', email: 'testcrear@pregunta.es', password: '1234567Aa', password2: '1234567Aa' };
    
    await request(app).post("/sign-up").send(usuario_r);
    const usuario_l = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        titulo: "Pregunta test",
        descripcion: "Pregunta con etiqueta ",
        etiquetas: [1]
    }

    let testSession = session(app);


    await testSession.post('/login').send(usuario_l);
    const response = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response.status).toBe(302);

});
test('[Crear pregunta] con sesion iniciada con titulo incorrecto', async () => {

    const usuario_r = { nombre: 'crearPregunta2', email: 'testcrear@pregunta.es', password: '1234567Aa', password2: '1234567Aa' };
    
    await request(app).post("/sign-up").send(usuario_r);
    const usuario_l = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        titulo: "",
        descripcion: "Pregunta con etiqueta ",
        etiquetas: [1]
    }
    
    let testSession = session(app);

    await testSession.post('/login').send(usuario_l);
    const response = testSession.post('/preguntas/crear').send(pregunta);
    console.log(response.text);

});



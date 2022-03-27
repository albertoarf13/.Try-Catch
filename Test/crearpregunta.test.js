const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});


test('[Crear pregunta] con sesion iniciada', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/crear');

});
test('[Crear pregunta] sin sesion iniciada', async () => {

    const pregunta = {
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }

    let testSession = session(app); 
    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.text).toBe('Found. Redirecting to /login');

});

test('[Crear pregunta] descripcion vacia', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "Pregunta de test",
        descripcion: "",
        etiquetas: [1,2,3]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/crear?error=El%20t%C3%ADtulo%2C%20descripci%C3%B3n%20y%20etiquetas%20no%20pueden%20estar%20vac%C3%ADos');
});


test('[Crear pregunta] titulo vacia', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "",
        descripcion: "hola",
        etiquetas: [1,2,3]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/crear?error=El%20t%C3%ADtulo%2C%20descripci%C3%B3n%20y%20etiquetas%20no%20pueden%20estar%20vac%C3%ADos');
});

test('[Crear pregunta] etiquetas vacia', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "Pregunta test",
        descripcion: "hola",
        etiquetas: undefined 
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/crear?error=El%20t%C3%ADtulo%2C%20descripci%C3%B3n%20y%20etiquetas%20no%20pueden%20estar%20vac%C3%ADos');
});

test('[Crear pregunta] todos vacia', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "",
        descripcion: "",
        etiquetas: undefined 
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/crear?error=El%20t%C3%ADtulo%2C%20descripci%C3%B3n%20y%20etiquetas%20no%20pueden%20estar%20vac%C3%ADos');
});
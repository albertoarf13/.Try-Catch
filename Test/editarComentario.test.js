const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll, afterAll , beforeEach} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

//PREGUNTAS
test('[Editar pregunta] con sesion iniciada', async () => {

    const usuario = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        id: 161,
        titulo: "Pregunta de testito",
        descripcion: "testeado",
        etiquetas: [1,2,4]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/'+ pregunta.id +'/actualizar').send(pregunta);
    console.log(response2.text);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/mostrar/'+pregunta.id)

});

test('[Editar pregunta] vacia', async () => {

    const usuario = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const pregunta = {
        id: 161,
        titulo: "Pregunta de testito",
        descripcion: "",
        etiquetas: [1,2,4]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/'+ pregunta.id +'/actualizar').send(pregunta);
    console.log(response2.text);
    expect(response2.status).toBe(450);

});


test('[Editar pregunta] sin sesion iniciada', async () => {

    const pregunta = {
        id: 161,
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }

    let testSession = session(app);

    const response2 = await testSession.post('/preguntas/'+ pregunta.id +'/actualizar').send(pregunta);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /login')

});

test('[Editar pregunta] con sesion iniciada pero no es mia ', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};       
    const pregunta = {
        id: 395,
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/'+ pregunta.id +'/actualizar').send(pregunta);
    expect(response2.status).toBe(302);

});

//RESPUESTAS
test('[Editar respuesta] con sesion iniciada', async () => {

    const usuario = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const respuesta = {
        idPregunta: 161,
        id: 433,
        descripcion: "testeado1",
        delImagen: null
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/respuesta/'+ respuesta.id +'/actualizar').send(respuesta);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/mostrar/'+respuesta.idPregunta)

});
test('[Editar respuesta] vacia', async () => {

    const usuario = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const respuesta = {
        idPregunta: 161,
        id: 433,
        descripcion: "",
        delImagen: null
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/respuesta/'+ respuesta.id +'/actualizar').send(respuesta);
    expect(response2.status).toBe(450);

});


test('[Editar respuesta] sin sesion iniciada', async () => {

    const respuesta = {
        idPregunta: 161,
        id: 433,
        descripcion: "test",
    }

    let testSession = session(app);

    const response2 = await testSession.post('/preguntas/respuesta/'+ respuesta.id +'/actualizar').send(respuesta);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /login')

});

test('[Editar respuesta] con sesion iniciada pero no es mia ', async () => {

    const usuario = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const respuesta = {
        idPregunta: 161,
        id: 433,
        descripcion: "test",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/respuesta/'+ respuesta.id +'/actualizar').send(respuesta);
    expect(response2.status).toBe(302);
});

//ACLARACIONES

test('[Editar aclaracion] con sesion iniciada', async () => {

    const usuario = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const aclaracion = {
        idPregunta: 161,
        id: 238,
        respuesta: "testeadisimo",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/aclaracion/'+ aclaracion.id +'/actualizar').send(aclaracion);
    console.log(response2.text);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /');

});
test('[Editar aclaracion] vacia', async () => {

    const usuario = { correo: 'testcrear@pregunta.es', contraseya: '1234567Aa'};
    const aclaracion = {
        idPregunta: 161,
        id: 238,
        respuesta: "",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/aclaracion/'+ aclaracion.id +'/actualizar').send(aclaracion);
    console.log(response2.text);
    expect(response2.status).toBe(450);

});

test('[Editar aclaracion] sin sesion iniciada', async () => {

    const aclaracion = {
        idPregunta: 161,
        id: 238,
        respuesta: "testeadisimo",
    }

    let testSession = session(app);

    const response2 = await testSession.post('/preguntas/aclaracion/'+ aclaracion.id +'/actualizar').send(aclaracion);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /login')

});

test('[Editar aclaracion] con sesion iniciada pero no es mia ', async () => {

    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};       
    const aclaracion = {
        idPregunta: 161,
        id: 238,
        respuesta: "testeadisimo",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/aclaracion/'+ aclaracion.id +'/actualizar').send(aclaracion);
    expect(response2.status).toBe(302);
});
const request = require('supertest');
const routes = require('./src/routes/routes');
const session = require('supertest-session');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

//PREGUNTAS
test('[Editar pregunta] con sesion iniciada', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const pregunta = {
        id: 1,
        titulo: "Pregunta de test",
        descripcion: "testeado",
        etiquetas: [1,2,4]
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/'+ pregunta.id +'/actualizar').send(pregunta);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/mostrar/'+pregunta.id)

});


test('[Editar pregunta] sin sesion iniciada', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const pregunta = {
        id: 1,
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }

    let testSession = session(app);

    const response2 = await testSession.post('/preguntas/'+ pregunta.id +'/actualizar').send(pregunta);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /login')

});

test('[Editar pregunta] incorreto', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const pregunta = {
        id: 1,
        titulo: "",
        descripcion: "",
        etiquetas: undefined
    }
    console.log(pregunta.titulo.length);

    let testSession = session(app);
    const response = await testSession.post('/login').send(usuario);
    const response2 = await testSession.post('/preguntas/'+ pregunta.id +'/actualizar').send(pregunta);
    expect(response2.status).toBe(450);

});


//RESPUESTAS
test('[Editar respuesta] con sesion iniciada', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const respuesta = {
        idPregunta: 1,
        id: 1,
        descripcion: "test",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);

    const response2 = await testSession.post('/preguntas/respuesta/'+ respuesta.id +'/actualizar').send(respuesta);
    console.log(response2.text);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /preguntas/mostrar/'+respuesta.idPregunta)

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

test('[Editar respuesta] incorrecto', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const respuesta = {
        idPregunta: 1,
        id: 1,
        descripcion: "",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);

    const response2 = await testSession.post('/preguntas/respuesta/'+ respuesta.id +'/actualizar').send(respuesta);
    console.log(response2.text);
    expect(response2.status).toBe(450);

});

//ACLARACIONES

test('[Editar aclaracion] con sesion iniciada', async () => {

    const usuario = { correo: 'prueab@prueba.es', contraseya: '1234567Aa'};
    const aclaracion = {
        idPregunta: 1,
        id: 1,
        respuesta: "test",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/aclaracion/'+ aclaracion.id +'/actualizar').send(aclaracion);
    console.log(response2.text);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /login');

});


test('[Editar aclaracion] sin sesion iniciada', async () => {

    const aclaracion = {
        idPregunta: 161,
        id: 238,
        respuesta: "test",
    }

    let testSession = session(app);

    const response2 = await testSession.post('/preguntas/aclaracion/'+ aclaracion.id +'/actualizar').send(aclaracion);
    expect(response2.status).toBe(302);
    expect(response2.text).toBe('Found. Redirecting to /login')

});

test('[Editar aclaracion] incorrecto ', async () => {

    const usuario = { correo: 'prueba@prueba.es', contraseya: '1234567Aa'};
    const aclaracion = {
        idPregunta: 161,
        id: 238,
        respuesta: "",
    }

    let testSession = session(app);


    const response = await testSession.post('/login').send(usuario);
    
    const response2 = await testSession.post('/preguntas/aclaracion/'+ aclaracion.id +'/actualizar').send(aclaracion);
    expect(response2.status).toBe(450);

});
const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});
test('[Funcionalidad basica]', async () => {// no se esta eliminando, deberia?
    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }
    const respuesta = {
        descripcion: "test"
    }
    const aclaracion = {
        respuesta: "Respuesta de test iniciando sesion"
    }
    
    let testSession = session(app);
    const response1 = await testSession.post('/login').send(usuario);
    expect(response1.status).toBe(302);

    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.status).toBe(302);
   
    const response3 = await testSession.post('/preguntas/1/responder').send(respuesta);
    expect(response3.text).toBe('Found. Redirecting to /preguntas/mostrar/1');

    const response4 = await testSession.post('/preguntas/1/responder-respuesta/1').send(aclaracion);
    expect(response4.text).toBe('Found. Redirecting to /preguntas/mostrar/1');

    const response5 = await testSession.post("/preguntas/respuesta/like").send({idRespuesta:1 , correo:"alberiva@ucm.es"});
    expect(response5.status).toBe(302);

});

test('[Funcionalidad basica]', async () => {// no se esta eliminando, deberia?
    const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};
    const pregunta = {
        titulo: "Pregunta de test",
        descripcion: "test",
        etiquetas: [1,2,3]
    }
    const respuesta = {
        descripcion: "test"
    }
    const aclaracion = {
        respuesta: "Respuesta de test iniciando sesion"
    }
    
    let testSession = session(app);
    const response1 = await testSession.post('/login').send(usuario);
    expect(response1.status).toBe(302);

    const response2 = await testSession.post('/preguntas/crear').send(pregunta);
    expect(response2.status).toBe(302);
   
    const response3 = await testSession.post('/preguntas/1/responder').send(respuesta);
    expect(response3.text).toBe('Found. Redirecting to /preguntas/mostrar/1');

    const response4 = await testSession.post('/preguntas/1/responder-respuesta/1').send(aclaracion);
    expect(response4.text).toBe('Found. Redirecting to /preguntas/mostrar/1');

    const response5 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:6 , correo:"alberiva@ucm.es"});
    expect(response5.status).toBe(302);

});
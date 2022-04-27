const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};    
test('[Dar like Respuesta]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/like").send({idRespuesta:1 , correo:"alberiva@ucm.es"});
    expect(response1.status).toBe(302);
});
test('[Dar like Respuesta: Cambio]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response0 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:1 , correo:"alberiva@ucm.es"});
    const response1 = await testSession.post("/preguntas/respuesta/like").send({idRespuesta:1 , correo:"alberiva@ucm.es"});
    expect(response1.status).toBe(302);
});

test('[Dar like Respuesta: quitar]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/like").send({idRespuesta:1 , correo:"alberiva@ucm.es"});
    expect(response1.status).toBe(302);
});
test('[Dar like Respuesta: Error]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/like").send({idRespuesta:1 , correo:"prueba@ucm.es"});
    expect(response1.status).toBe(450);
});
test('[Dar like aclaracion:]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/like").send({idAclaracion:2 , correo:"alberiva@ucm.es"});;
    expect(response1.status).toBe(302);
});
test('[Dar like aclaracion: Cambio]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response0 = await testSession.post("/preguntas/aclaracion/dislike").send({idAclaracion:2 , correo:"alberiva@ucm.es"});;
    const response1 = await testSession.post("/preguntas/aclaracion/like").send({idAclaracion:2 , correo:"alberiva@ucm.es"});
    expect(response1.status).toBe(302);
});
test('[Dar like aclaracion:quitar]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/like").send({idAclaracion:2 , correo:"alberiva@ucm.es"});;
    expect(response1.status).toBe(302);
});
test('[Dar like aclaracion:Error]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/like").send({idAclaracion:2 , correo:"prueba@ucm.es"});;
    expect(response1.status).toBe(450);
});
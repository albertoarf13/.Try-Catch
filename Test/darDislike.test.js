const request = require('supertest');
const app = require('../src/app');
const routes = require('../src/routes/routes');
const session = require('supertest-session');
const { beforeAll} = require('@jest/globals');

beforeAll(() => {
    app.use('/', routes);  
});

const usuario = { correo: 'alberiva@ucm.es', contraseya: '123'};    
test('[Dar dislike Respuesta]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:3 , correo:"alberiva@ucm.es"});
    expect(response1.status).toBe(302);
});

test('[Dar dislike Respuesta: quitar]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:3 , correo:"alberiva@ucm.es"});
    expect(response1.status).toBe(302);
});
test('[Dar dislike Respuesta: Error]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/respuesta/dislike").send({idRespuesta:3 , correo:"prueba@ucm.es"});
    expect(response1.status).toBe(450);
});

test('[Dar dislike aclaracion:]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/dislike").send({idAclaracion:4 , correo:"alberiva@ucm.es"});;
    expect(response1.status).toBe(302);
});

test('[Dar dislike aclaracion:quitar]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/dislike").send({idAclaracion:4 , correo:"alberiva@ucm.es"});;
    expect(response1.status).toBe(302);
});
test('[Dar dislike aclaracion:Error]', async () =>{
    let testSession = session(app);

    const response = await testSession.post('/login').send(usuario);
    const response1 = await testSession.post("/preguntas/aclaracion/dislike").send({idAclaracion:4 , correo:"prueba@ucm.es"});;
    expect(response1.status).toBe(450);
});
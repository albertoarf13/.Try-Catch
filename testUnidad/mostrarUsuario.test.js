const request = require('supertest');
const routes = require('./src/routes/routes');
const app = require('./src/app.js');
const { beforeAll } = require('@jest/globals');
const { UCS2_ROMAN_CI } = require('mysql/lib/protocol/constants/charsets');

beforeAll(() => {
    app.use('/', routes);  
});

test('[Mostrar atributos usuario] con resultado', async () => {
    const usuario = {
        correo: "test@ucm.es",
        nombre: "pepitoTest",
        id: 0,
        descripcion: "Buenas soy pepito y estudio Ingenieria del Software"
    }

    const response = await request(app).get("/usuarios/" + usuario.correo);
    expect(response.status).toBe(450);
    console.log(response.body);
    expect(response.body.correo).toBe("test@ucm.es");
    expect(response.body.nombre).toBe("pepitoTest");
  
  
});

test('[Mostrar atributos usuario] sin resultado', async () => {
    
    const response = await request(app).get("/usuarios/pepito@ucm.es");
    expect(response.status).toBe(451);  
});
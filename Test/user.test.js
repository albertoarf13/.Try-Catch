const request = require('supertest');
const {nanoid} = require('nanoid');
const app = require('../src/app.js');

let testServer;
beforeAll(()=>{
    testServer = app.listen(4000);
})
afterAll((done) =>{
    testServer.close(done);
})

describe('GET /', () => {
    it ('should init the page', async () => {
        const response = await request(app).get('/');

        expect(response.error).toBe(false);
        expect(response.status).toBe(200);
    });

});

const should = require('should');
const request = require('supertest');
const setup = require('./setup.js');
const version = require('./../package.json').version;

describe('Service:', () => {

  const { server } = setup();
  const app = server.app;

  before(async () => {
    await server.listen();
  });

  after(async () => {
    await server.close();
  });

  it('mocha should be alive', () => {
    true.should.be.true();
  });

  it('should return version', async () => {
    var res = await request(app)
      .get('/version')
      .expect(200, { version });
  });

  it('should return pong on ping', async () => {
    var res = await request(app)
      .get('/api/ping?access_token=mytoken')
      .expect(200, 'pong');
  });

  it('should return status', async () => {
    var res = await request(app)
      .get('/api/status?access_token=mytoken')
      .expect(200);
  });

  it('should not return error to client', async () => {
    var res = await request(app)
      .get('/error')
      .expect(500, { error: 'Internal server error.' });
  });

  it('should login via post body', async () => {
    var res = await request(app)
      .post('/api/login')
      .send({ login: 'admin', password: 'admin' })
      .expect(200, { access_token: 'mytoken' });
  });

  it('should login, get token and use it via url parameter', async () => {
    var res = await request(app)
      .post('/api/login?login=admin&password=admin')
      .expect(200);

    var token = res.body.access_token;

    await request(app)
      .get('/api/user?access_token=' + token)
      .expect(200, { login: 'admin' });
  });

  it('should login, get token and use it via header', async () => {
    var res = await request(app)
      .post('/api/login?login=admin&password=admin')
      .expect(200);

    var token = res.body.access_token;

    var res1 = await request(app)
      .get('/api/user')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    res1.body.login.should.be.eql('admin');
  });

  it('should not login with wrong creds', async () => {
    var res = await request(app)
      .post('/api/login?login=wrong&password=wrong')
      .expect(401);
  });
})
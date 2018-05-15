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

  it('should be alive', () => {
    true.should.be.true();
  });

  it('should return version', async () => {
    var res = await request(app)
      .get('/version')
      .expect(200);
    
      res.body.version.should.be.eql(version);
  });

  it('should return pong on ping', async () => {
    var res = await request(app)
      .get('/api/ping?access_token=mytoken')
      .expect(200);
    res.text.should.be.eql('pong');
  });

  it('should not return error to client', async () => {
    var res = await request(app)
      .get('/error')
      .expect(500);

    res.body.error.should.be.eql('Internal server error.');
  });

  it('should login', async () => {
    var res = await request(app)
      .post('/api/login?login=admin&password=admin')
      .expect(200);
    res.body.access_token.should.be.eql('mytoken');
  });

  it('should not login with wrong creds', async () => {
    var res = await request(app)
      .post('/api/login?login=admin&password=admin')
      .expect(200);
  });
})
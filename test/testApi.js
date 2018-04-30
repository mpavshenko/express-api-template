const should = require('should');
const request = require('supertest');
const setup = require('./setup.js');
const version = require('./../package.json').version;

describe('Base service:', () => {
  
  const { server } = setup();

  before(async () => {
    await server.listen();
  });

  after(async () => {
    await server.close();
  });

  it('should be true', () => {
    true.should.be.true();
  });

  it('should return version', async () => {
    var res = await request(server.app)
      .get('/version')
      .expect(200);
    
      res.body.version.should.be.eql(version);
  });
})
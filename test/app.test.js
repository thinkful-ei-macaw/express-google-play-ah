const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys(
          'App', 'Rating', 'Genres');
      });
  });
  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be one of rating or app');
  });
  it('should be 400 if genre is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'MISTAKE' })
      .expect(400, 'genre must be one of action, puzzle, strategy, arcade or card');
  });

  it('should sort by app', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'app' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let sorted = true;
        let i = 0;

        while (i < res.body.length -1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];

          if (appAtIPlus1.app < appAtI.app) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should sort by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let sorted = true;
        let i = 0;

        while (i < res.body.length -1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];

          if (appAtIPlus1.rating < appAtI.rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should filter by genre', () => {
    const query = {
      genre: 'card'
    };

    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let filtered = true;
        let i = 0;

        while (i < res.body.length) {
          const currentApp = res.body[i];
          // console.log(currentApp);
          if (!currentApp.Genres.includes('Card')) {
            filtered = false;
            break;
          }
          i++;
        }
        expect(filtered).to.be.true;
      });
  });
});
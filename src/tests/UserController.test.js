import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../routes/user.routes';
import { User } from '../models';

describe('User Controller', () => {
  let token;
  const app = express();
  app.use(bodyParser.json());
  app.use(router);

  beforeAll(async () => {
    console.log('Before all: Start');
    try {
      const response = await request(app)
        .post('/user/register')
        .send({
          name: 'TestUser',
          lastname: 'TestLastName',
          email: 'test@example.com',
          password: 'testpassword',
          priority: 1,
        });

      token = response.body.token;
      console.log('Before all: END');
    } catch (error) {
      throw error;
    }
  }, 15000);

  afterAll(async () => {

  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: '',
        lastname: 'NewLastName',
        email: 'newuser@example.com',
        password: 'newpassword',
        priority: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario creado exitosamente');
    expect(response.body.token).toBeDefined();
  });

  it('should not register a new user again', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: '',
        lastname: 'NewLastName',
        email: 'newuser2@example.com',
        password: 'newpassword',
        priority: 1,
      });

    expect(response.status).toBe(400);
  });

  it('should fail to register a user with invalid parameters', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: '',
        lastname: '',
        email: 'invalidemail',
        password: 'short',
        priority: 'notanumber',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Inicio de sesión exitoso');
    expect(response.body.token).toBeDefined();
  });

  it('should fail to log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'test@example.com',
        password: 'incorrectpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
  });
});

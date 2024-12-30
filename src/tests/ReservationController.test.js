import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../routes/parking.routes';

describe('Reservation Controller', () => {
  it('should create a new reservation', async () => {
    const mockReservationData = {
      user_id: 1,
      parking_id: 1,
      total_price: 20,
      entry_time: '2023-01-01T12:00:00.000Z',
      exit_time: null,
      extra_fee: 10
    };

    const app = express();
    app.use(bodyParser.json());
    app.use(router);

    const response = await request(app)
      .post('/reservations')
      .send(mockReservationData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user_id', mockReservationData.user_id);
    expect(response.body).toHaveProperty('parking_id', mockReservationData.parking_id);
    expect(response.body).toHaveProperty('entry_time', mockReservationData.entry_time);
    expect(response.body).toHaveProperty('exit_time', mockReservationData.exit_time);
    expect(response.body).toHaveProperty('extra_fee', mockReservationData.extra_fee);
  });

  it('should create not a new reservation again', async () => {
    const mockReservationData = {
      user_id: 1,
      parking_id: 1,
      total_price: 20,
      entry_time: '2023-01-01T12:00:00.000Z',
      exit_time: null,
      extra_fee: 10
    };

    const app = express();
    app.use(bodyParser.json());
    app.use(router);

    const response = await request(app)
      .post('/reservations')
      .send(mockReservationData);
    
    expect(response.status).toBe(400);
  });

  
  it('should return 500 for a bad reservation request', async () => {
    const badReservationData = {
      parking_id: 1,
      total_price: 'invalid',
      entry_time: 'invalid_date',
      exit_time: null,
      extra_fee: 'invalid',
    };
  
    const app = express();
    app.use(bodyParser.json());
    app.use(router);
  
    const response = await request(app)
      .post('/reservations')
      .send(badReservationData);
  
    expect(response.status).toBe(500);
  });

  it('should return error for a user with no active reservation', async () => {
    const nonExistentUserId = -999;
  
    const app = express();
    app.use(bodyParser.json());
    app.use(router);

    const response = await request(app)
      .get(`/reservations/${nonExistentUserId}`);

    expect(response.status).toBe(404);
  });
  
});

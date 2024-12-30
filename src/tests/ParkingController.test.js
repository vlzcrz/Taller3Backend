import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../routes/parking.routes';

describe('Parking Controller', () => {

  const app = express();
  app.use(bodyParser.json());
  app.use(router);

  it('should get all parking data', async () => {
    const response = await request(app).get('/parking/');
    expect(response.status).toBe(200);
  });

  it('should register payment', async () => {
    const response = await request(app).post('/registerPayment').send({
      user_id: 1,  //existing user
    });
    console.log("response: ", response.body);
    expect(response.status).toBe(200);
  });

  it('should calculate extra fee', async () => {
    const response = await request(app).get('/calculateExtraFee');
    console.log(response.body);
    expect(response.status).toBe(200);

  });

  it('should calculate final payment', async () => {
    let reservationDataInfo = {
        response: {
        user_id: -5,
        id: 1,
      }
    };
    const response = await request(app).post('/calculateFinalPayment').send({
      reservationDataInfo: reservationDataInfo,  //existing user
    });

    expect(response.status).toBe(200);
  });

  it('should not calculate final payment', async () => {
    const response = await request(app).post('/calculateFinalPaymen').send({
      user_id: -999,  //not existing user
    });
    expect(response.status).toBe(500);
  });

});
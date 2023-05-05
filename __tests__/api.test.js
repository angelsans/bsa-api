const supertest = require("supertest");
const app = require("../src/server");
const db = require("../src/db");
const CarModel = require("../src/models/car.model");
const seetData = require("../src/seeds/seed");

const request = supertest(app);
const apiBase = "/api/v1/cars";

beforeAll(async (done) => {
  await db.connect();
  done();
});

afterEach(async (done) => {
  await CarModel.deleteMany();
  done();
});

afterAll(async (done) => {
  await db.disconnect();
  done();
});

describe("GET /cars", () => {
  it("Get all - Empty rows", async () => {
    const response = await request.get(apiBase);
    expect(response.status).toBe(200);
    expect(response.body.data.data).toEqual([]);
  });

  it("Get first 10 cars", async () => {
    await seetData();
    const response = await request.get(apiBase);
    expect(response.status).toBe(200);
    expect(response.body.data.data.length).toEqual(10);
  });

  it("Get next 10 cars with custom page", async () => {
    await seetData();
    const urlRequest = `${apiBase}?page=2&limit=10`;
    const response = await request.get(urlRequest);
    expect(response.status).toBe(200);
    expect(response.body.data.data.length).toEqual(10);
    expect(response.body.data.currentPage).toEqual(2);
  });

  it("Get cars with custom limit", async () => {
    await seetData();
    const urlRequest = `${apiBase}?limit=25`;
    const response = await request.get(urlRequest);
    expect(response.status).toBe(200);
    expect(response.body.data.data.length).toEqual(25);
  });

  it("Filter cars by make 'Cadillac'", async () => {
    await seetData();
    const urlRequest = `${apiBase}?where={"make": "Cadillac"}`;
    const response = await request.get(urlRequest);
    expect(response.status).toBe(200);
    expect(response.body.data.data.length).toEqual(10);
  });

  it("Filter cars by make 'Cadillac' and model 'Seville'", async () => {
    await seetData();
    const urlRequest = `${apiBase}?where={"make": "Cadillac", "model": "Seville"}`;
    const response = await request.get(urlRequest);
    expect(response.status).toBe(200);
    expect(response.body.data.data.length).toEqual(4);
  });
});

describe("POST /cars", () => {
  it("Create a new car", async () => {
    const newCar = {
      make: "Cheverolet",
      model: "Onix",
      year: 2023,
      color: "Black",
      vin: "2C4RDGCG8DR518365",
    };

    const response = await request.post(apiBase).send(newCar);

    const carCreated = response.body.data;

    expect(response.status).toBe(201);
    expect(carCreated).toEqual(expect.objectContaining(newCar));
  });

  it("Bad request - schema required validation", async () => {
    const newCar = {
      make: "Cheverolet",
      year: 1907,
      color: "Black",
      vin: "2C4RDGCG8DR518365",
    };

    const response = await request.post(apiBase).send(newCar);

    const error = response.body.message;

    expect(response.status).toBe(400);
    expect(error).toBe('"model" is required');
  });

  it("Bad request - schema type validation", async () => {
    const newCar = {
      make: 1,
      model: "Onix",
      year: 1907,
      color: "Black",
      vin: "2C4RDGCG8DR518365",
    };

    const response = await request.post(apiBase).send(newCar);

    const error = response.body.message;

    expect(response.status).toBe(400);
    expect(error).toBe('"make" must be a string');
  });

  it("Bad request - year validation", async () => {
    const newCar = {
      make: "Cheverolet",
      model: "Onix",
      year: 1907,
      color: "Black",
      vin: "2C4RDGCG8DR518365",
    };

    const response = await request.post(apiBase).send(newCar);

    const error = response.body.message;

    expect(response.status).toBe(400);
    expect(error).toBe('"year" must be greater than or equal to 1908');
  });
});

describe("GET /cars/:id", () => {
  it("Get car by id", async () => {
    const newCar = {
      make: "Cheverolet",
      model: "Onix",
      year: 2023,
      color: "Black",
      vin: "2C4RDGCG8DR518365",
    };

    const carCreatedResponse = await request.post(apiBase).send(newCar);

    const carCreated = carCreatedResponse.body.data;

    const response = await request.get(`${apiBase}/${carCreated._id}`);

    const carFoundedResponse = response.body.data;

    expect(response.status).toBe(200);
    expect(carFoundedResponse._id).toBe(carCreated._id);
    expect(carFoundedResponse.color).toBe("Black");
  });

  it("Not found validation", async () => {
    const response = await request.get(`${apiBase}/0`);

    const error = response.body.message;

    expect(response.status).toBe(404);
    expect(error).toBe("Car with _id 0 not found");
  });
});

describe("PUT /cars/:id", () => {
  it("Update an existing car", async () => {
    const newCar = {
      make: "Cheverolet",
      model: "Onix",
      year: 2023,
      color: "Black",
      vin: "2C4RDGCG8DR518365",
    };

    const carCreatedResponse = await request.post(apiBase).send(newCar);

    const carCreated = carCreatedResponse.body.data;

    const response = await request.put(`${apiBase}/${carCreated._id}`).send({
      color: "Blue",
    });

    const carUpdated = response.body.data;

    expect(response.status).toBe(200);
    expect(carUpdated._id).toBe(carCreated._id);
    expect(carUpdated.color).toBe("Blue");
  });

  it("Bad request - schema validation", async () => {
    const dataToUpdate = {
      _id: "64553439906d",
    };

    const response = await request.put(`${apiBase}/0`).send(dataToUpdate);

    const error = response.body.message;

    expect(response.status).toBe(400);
    expect(error).toBe('"_id" is not allowed');
  });

  it("Not found validation", async () => {
    const response = await request.put(`${apiBase}/0`).send({
      color: "Blue",
    });

    const error = response.body.message;

    expect(response.status).toBe(404);
    expect(error).toBe("Car with _id 0 not found");
  });
});

describe("DELETE /cars/:id", () => {
  it("Delete an existing car", async () => {
    const newCar = {
      make: "Cheverolet",
      model: "Onix",
      year: 2023,
      color: "Black",
      vin: "2C4RDGCG8DR518365",
    };

    const carCreatedResponse = await request.post(apiBase).send(newCar);

    const carCreated = carCreatedResponse.body.data;

    const response = await request.delete(`${apiBase}/${carCreated._id}`);

    const carDeleted = await request.get(`${apiBase}/${carCreated._id}`);
    const error = carDeleted.body.message;

    expect(response.status).toBe(204);

    expect(carDeleted.status).toBe(404);
    expect(error).toBe(`Car with _id ${carCreated._id} not found`);
  });

  it("Not found validation", async () => {
    const response = await request.delete(`${apiBase}/0`);
    const error = response.body.message;

    expect(response.status).toBe(404);
    expect(error).toBe(`Car with _id 0 not found`);
  });
});

const CarModel = require("../models/car.model");
const errorHandler = require("../validators/error.handler");
class CarService {
  async getAll(query, page, limit) {
    const rows = await CarModel.find(query)
      .select("_id make model year color vin")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await CarModel.count();

    return {
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows,
    };
  }

  async createCar(carData) {
    try {
      const newCar = new CarModel(carData);
      await newCar.save();
      const row = await CarModel.findById(newCar._id).select(
        "_id make model year color vin"
      );
      return row;
    } catch (error) {
      console.log(error);
      errorHandler.serverError();
    }
  }

  async getCarById(id) {
    try {
      const row = await CarModel.findById(id).select(
        "_id make model year color vin"
      );
      if (!row) {
        errorHandler.notFound(`Car with _id ${id} not found`);
      }
      return row;
    } catch (error) {
      errorHandler.notFound(`Car with _id ${id} not found`);
    }
  }

  async updateCar(id, data) {
    try {
      await CarModel.updateOne({ _id: id }, data);
      const carUpdated = await CarModel.findById(id).select(
        "_id make model year color vin"
      );
      return carUpdated;
    } catch (error) {
      errorHandler.notFound(`Car with _id ${id} not found`);
    }
  }

  async deleteCar(id) {
    try {
      await CarModel.deleteOne({ _id: id });
    } catch (error) {
      errorHandler.notFound(`Car with _id ${id} not found`);
    }
  }
}

module.exports = new CarService();

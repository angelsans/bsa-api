const express = require("express");
const router = express.Router();
const carService = require("../../services/car.service");
const {
  searchQueryValidator,
  newCarValidator,
  updateCarValidator,
} = require("../../validators");
const errorHandler = require("../../validators/error.handler");

/**
 * @swagger
 * components:
 *   responses:
 *     BadRequestError:
 *       description: The request has invalid data.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               status:
 *                 type: integer
 *     NotFoundError:
 *       description: The requested resource was not found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               status:
 *                 type: integer
 *     InternalServerError:
 *       description: An error ocurred while performing the request.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               status:
 *                 type: integer
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         make:
 *           type: string
 *         model:
 *           type: string
 *         year:
 *           type: number
 *         color:
 *           type: string
 *         vin:
 *           type: string
 *   parameters:
 *     id:
 *       name: id
 *       in: path
 *       description: ID of the required resource.
 *       required: true
 *       schema:
 *         type: string
 *     limit:
 *       name: limit
 *       in: query
 *       description: Number of items to return.
 *       required: false
 *       schema:
 *         type: integer
 *         default: 10
 *     page:
 *       name: page
 *       in: query
 *       description: Number of page to collect the result set.
 *       required: false
 *       schema:
 *         type: integer
 *         default: 1
 *     where:
 *       name: where
 *       in: query
 *       description: Allows to filter result set with the specific requested parameters, you can use a any parameter or specific operators.
 *       required: false
 *       schema:
 *        type: string
 *       examples:
 *        whereNone:
 *          summary: None
 *          value:
 *        whereSingle:
 *          summary: Filter a single parameter
 *          value: '{"_id": "645547a07dad3902e578870f"}'
 *        whereMultiple:
 *          summary: Filter multiple parameters
 *          value: '{"make": "Cadillac", "model": "Seville"}'
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     tags:
 *      - Cars
 *     summary: Retrieve a list of cars.
 *     description: Retrieve a list of cars from a mongo db.
 *     parameters:
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/where'
 *     responses:
 *       200:
 *         description: A list of cars.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 */
router.get("/", async (req, res, next) => {
  try {
    const { query } = req;
    const { page = 1, limit = 10 } = query;
    let where;
    if (query.where) {
      try {
        where = JSON.parse(query.where);
      } catch (error) {
        console.log("Error parsing data");
      }
    }
    const { error } = searchQueryValidator.validate(where);
    if (error) {
      errorHandler.badRequest(error.message);
    }
    const cars = await carService.getAll(where, page, limit);
    res.status(200).json({
      data: cars,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * @swagger
 *  '/cars/{id}':
 *    get:
 *      tags:
 *        - Cars
 *      summary: Get car by id
 *      parameters:
 *        - $ref: '#/components/parameters/id'
 *      responses:
 *        '200':
 *          description: The request has succeeded.
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - type: object
 *                    properties:
 *                      data:
 *                        type: object
 *                        $ref: '#/components/schemas/Car'
 *        '400':
 *          $ref: '#/components/responses/BadRequestError'
 *        '404':
 *          $ref: '#/components/responses/NotFoundError'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await carService.getCarById(id);
    res.status(200).json({
      data: car,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 *  '/cars':
 *    post:
 *      tags:
 *        - Cars
 *      summary: Create a car
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Car'
 *      responses:
 *        '200':
 *          description: The request has succeeded.
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - type: object
 *                    properties:
 *                      data:
 *                        type: object
 *                        $ref: '#/components/schemas/Car'
 *        '400':
 *          $ref: '#/components/responses/BadRequestError'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *
 */
router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const { error, value } = newCarValidator.validate(body);

    if (error) {
      errorHandler.badRequest(error.message);
    }
    const response = await carService.createCar(value);
    res.status(201).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 *  '/cars/{id}':
 *    put:
 *      tags:
 *        - Cars
 *      summary: Update a car
 *      parameters:
 *        - $ref: '#/components/parameters/id'
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Car'
 *      responses:
 *        '200':
 *          description: The request has succeeded.
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - type: object
 *                    properties:
 *                      data:
 *                        type: object
 *                        $ref: '#/components/schemas/Car'
 *        '400':
 *          $ref: '#/components/responses/BadRequestError'
 *        '404':
 *          $ref: '#/components/responses/NotFoundError'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { error, value } = updateCarValidator.validate(body);

    if (error) {
      errorHandler.badRequest(error.message);
    }
    const response = await carService.updateCar(id, value);
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 *  '/cars/{id}':
 *    delete:
 *      tags:
 *        - Cars
 *      summary: Delete a car
 *      parameters:
 *        - $ref: '#/components/parameters/id'
 *      responses:
 *        '204':
 *          description: The request has succeeded.
 *        '404':
 *          $ref: '#/components/responses/NotFoundError'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await carService.deleteCar(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

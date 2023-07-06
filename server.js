const express = require("express");
const app = express();
const port = 4000;
// Cars data
const cars = require("./cars");

app.use((req, res, next) => {
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});
app.use(express.json());

function getNextIdFromCollection(collection) {
  if (collection.length === 0) return 1;
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}

app.get("/", (req, res) => {
  res.send("Welcome to the Car App Tracker API!");
});

// Get all the cars
app.get("/cars", (req, res) => {
  res.send(cars);
});

// Get a specific car
app.get("/cars/:id", (req, res) => {
  const carId = parseInt(req.params.id, 10);
  const car = cars.find((c) => c.id === carId);
  if (car) {
    res.send(car);
  } else {
    res.status(404).send({ message: "Car not found" });
  }
});

// Create a new car
app.post("/cars", (req, res) => {
  const newCar = {
    ...req.body,
    id: getNextIdFromCollection(cars),
  };
  cars.push(newCar);
  console.log("newCar", newCar);
  res.status(201).send(newCar);
});

// Update a specific car
app.patch("/cars/:id", (req, res) => {
  const carId = parseInt(req.params.id, 10);
  const carUpdates = req.body;
  const carIndex = cars.findIndex((car) => car.id === carId);
  if (carIndex !== -1) {
    const originalcar = cars[carIndex];
    const updatedcar = {
      ...originalcar,
      ...carUpdates,
    };
    cars[carIndex] = updatedcar;
    res.send(updatedcar);
  } else {
    res.status(404).send({ message: "Car not found" });
  }
});

// Delete a specific car
app.delete("/cars/:id", (req, res) => {
  const carId = parseInt(req.params.id, 10);
  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1) {
    cars.splice(carIndex, 1);
    res.send({ message: "Car deleted successfully" });
  } else {
    res.status(404).send({ message: "Car not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

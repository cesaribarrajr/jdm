const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for cars (temporary replacement for MongoDB)
let cars = [];
let nextId = 1;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mock car schema
const createCar = (data) => ({
  _id: nextId++,
  make: data.make,
  model: data.model,
  year: data.year,
  horsepower: data.horsepower,
  engine: data.engine,
  drivetrain: data.drivetrain,
  dateAdded: new Date()
});

// =====================
//   REST API ROUTES
// =====================

// POST /car — create a new car document
app.post('/car', async (req, res) => {
  try {
    const car = createCar(req.body);
    cars.push(car);
    res.status(201).json({ success: true, car });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /cars — query cars by optional params
// Query params: maxHp, minYear, make, drivetrain
app.get('/cars', async (req, res) => {
  try {
    const { maxHp, minYear, make, drivetrain } = req.query;
    let filteredCars = [...cars];

    if (maxHp)      filteredCars = filteredCars.filter(car => car.horsepower <= Number(maxHp));
    if (minYear)    filteredCars = filteredCars.filter(car => car.year >= Number(minYear));
    if (make)       filteredCars = filteredCars.filter(car => car.make.toLowerCase().includes(make.toLowerCase()));
    if (drivetrain) filteredCars = filteredCars.filter(car => car.drivetrain === drivetrain);

    filteredCars.sort((a, b) => a.horsepower - b.horsepower);
    res.json({ success: true, count: filteredCars.length, cars: filteredCars });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =====================
//   PAGE ROUTES
// =====================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

app.get('/list', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'list.html'));
});

app.get('/query', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'query.html'));
});

// Server-side data endpoint for /list
app.get('/api/cars/all', async (req, res) => {
  try {
    const sortedCars = [...cars].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    res.json({ success: true, cars: sortedCars });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`JDM Registry running on port ${PORT}`);
});

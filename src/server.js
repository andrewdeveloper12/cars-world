const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// قائمة السيارات اللي هتُرسل للفرونت إند
const cars = [
  { id: 1, name: 'BMW M4 Competition', type: 'Sports', year: 2025, price: '$85,000', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Mercedes-Benz AMG GT', type: 'Luxury', year: 2025, price: '$110,000', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Porsche 911 Carrera', type: 'Sports', year: 2025, price: '$120,000', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Range Rover Sport', type: 'SUV', year: 2025, price: '$95,000', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Audi R8 V10', type: 'Sports', year: 2024, price: '$158,000', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Tesla Model S', type: 'Electric', year: 2025, price: '$75,000', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=85' },
];

// الـ API Endpoint
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Karl Zolt Backend Server is running on http://localhost:${PORT} 🚀`);
});
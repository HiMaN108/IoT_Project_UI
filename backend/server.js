const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Replace "*" with your frontend's URL in production
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process if unable to connect
    });

// Sensor Data Schema
const sensorSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    moisture_level: { type: Number, required: true },
    motor_status: { type: Boolean, required: true },
    rain_data: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('SensorData', sensorSchema);

// WebSocket Setup
io.on('connection', (socket) => {
    console.log('Client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    
    const interval = setInterval(async () => {
        try {
            const latestData = await SensorData.findOne().sort({ timestamp: -1 }); // Fetch latest data
            if (latestData) {
                socket.emit('sensorData', latestData); // Emit latest data
            }
        } catch (err) {
            console.error('Error fetching data for WebSocket:', err);
        }
    }, 1000); // Emit every second

    socket.on('disconnect', () => clearInterval(interval));
});

// POST API to Save Sensor Data
app.post('/api/sensor_data', async (req, res) => {
    const { temperature, moisture_level, motor_status, rain_data } = req.body;

    if (
        temperature !== undefined &&
        moisture_level !== undefined &&
        motor_status !== undefined &&
        rain_data !== undefined
    ) {
        try {
            const data = new SensorData({ temperature, moisture_level, motor_status, rain_data });
            const savedData = await data.save();

            // Emit the new data to all connected clients
            io.emit('new_data', savedData);

            res.status(201).json({ message: 'Sensor data saved successfully!', data: savedData });
        } catch (err) {
            console.error('Error saving data:', err);
            res.status(500).json({ message: 'Error saving data', error: err });
        }
    } else {
        console.error('Invalid sensor data format:', req.body);
        res.status(400).json({ message: 'Invalid sensor data format' });
    }
});

// GET API to Retrieve Sensor Data
app.get('/api/sensor_data', async (req, res) => {
    try {
        const data = await SensorData.find().sort({ timestamp: -1 });
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data', error: err });
    }
});

// Default Route
app.get('/', (req, res) => {
    res.send('Sensor Data API is running.');
});

// Server Setup
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

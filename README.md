# IoT Sensor Data Management System

A Node.js and MongoDB-based backend application for storing, retrieving, and broadcasting IoT sensor data in real time using WebSocket (`Socket.IO`).

---

## Features

1. **RESTful APIs**:
   - Store IoT sensor data (temperature, moisture level, motor status, rain data).
   - Retrieve stored sensor data in real time.

2. **WebSocket Integration**:
   - Broadcast the latest sensor data to all connected clients in real time.

3. **Database Management**:
   - Stores sensor data in MongoDB Atlas.

4. **Scalable Architecture**:
   - Built with Node.js, Express, and MongoDB for scalability.

---

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - WebSocket (`Socket.IO`)

- **Database**:
  - MongoDB Atlas (Cloud Database)

- **Other Libraries**:
  - `dotenv` for environment variables
  - `mongoose` for MongoDB object modeling
  - `cors` for Cross-Origin Resource Sharing
  - `body-parser` for parsing JSON requests

---

## Installation

```bash
# Clone the repository
git clone https://github.com/HiMaN108/IoT_Project_UI.git
cd IoT_Project_UI

# Install dependencies
npm install

# Set up the .env file
# Create a .env file in the root directory and add your MongoDB URI
echo "MONGO_URI=your-mongodb-uri" > .env

# Start the server
npm start


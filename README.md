# IoT Real-Time Monitoring Dashboard

This project is a simple IoT trial system that demonstrates how sensor data can be collected, processed, and displayed in real time using a Node.js backend and a web-based dashboard.

The goal of the project is to simulate an end-to-end IoT workflow:
- Receiving sensor data
- Handling it on the server
- Broadcasting updates in real time to the client dashboard

---

## Tech Stack

- **Node.js**
- **Express.js**
- **Socket.IO** (real-time communication)
- **HTML / JavaScript** (frontend dashboard)
- **CORS**
- **HTTP Server**

---

## Project Structure
```
IoT trial project/
│
├── index.js # Main server file (Express + Socket.IO)
├── dashboard.js # Client-side dashboard logic
├── front.html # Dashboard UI
├── package.json
├── package-lock.json
└── README.md
```

---

## How It Works

1. The backend server is built using Express and runs on port `3001`.
2. Socket.IO is used to establish a real-time connection between the server and the frontend.
3. Sensor data (simulated or real) is handled by the backend.
4. Whenever new sensor data is received, it is emitted to all connected clients.
5. The dashboard updates instantly without page refresh.

---

## Running the Project Locally

### 1. Clone the repository
```
git clone https://github.com/rawansamehhosny/IoT-trial-project.git
```
### 2. Navigate to the project directory
```
cd IoT-trial-project
```
### 3. Install dependencies
```
npm install
```
### 4. Start the server
```
node index.js
```
### The server will run on:
```
http://localhost:3001
```
---

## Run the Frontend

You can open `front.html` using one of the following options:

- **Live Server** extension in VS Code  
- Any local static server

Make sure the frontend origin matches the allowed **CORS origin** in `index.js`.

---

## Use Case

This project can be used as:

- A learning example for IoT and real-time systems  
- A base for building more advanced IoT dashboards  
- A demonstration of WebSocket-based communication using Socket.IO  

---

## Future Improvements

- Connect to real IoT hardware (ESP32 / Arduino)  
- Persist sensor data in a database  
- Add authentication  
- Improve dashboard UI  
- Add alerts and threshold-based notifications  

---

## Author

**Rawan**  
Backend-focused developer with interest in IoT systems, real-time architectures, and automation.

---


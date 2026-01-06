const express = require('express');
const app = express();
const cors = require('cors'); 
const http = require('http');
app.use(cors());
const port = 3001;
const readings = [];
app.use(express.json());
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // حطي هنا رابط الفرونت إند بتاعك (Live Server مثلاً)
        methods: ["GET", "POST"]
    }
});



function handleSensorData(newData) {
 
    io.emit('sensorUpdate', newData);
}
function generateAlerts(temp, humidity) {
    const alerts = [];
    if (temp > 30) alerts.push(temp + " °C High Temperature!");
    if (temp < 16) alerts.push(temp + " °C Low Temperature!");
    if (humidity > 70 || humidity < 20) alerts.push(humidity + " % High Humidity");
    return alerts;
}
() => {
    const mockData = {
        temp: Math.floor(Mathد.random() * 40),
        humidity: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
    };

    mockData.alerts = generateAlerts(mockData.temp, mockData.humidity);

    readings.push(mockData);
    if (readings.length > 1000) readings.shift();

    handleSensorData(mockData);
}

const dataAvailable = (req, res, next) => {
    if (readings.length === 0) {
        return res.status(404).json({ error: "No readings available" });
    }
    next();
};

const checkreadings = (req, res, next) => {
    const { temp, humidity } = req.body;
    if (temp === undefined || humidity === undefined) {
        return res.status(400).json({ error: "Missing Data" });
    } next();
};

const createReading = (req, res) => {
    const { temp, humidity , timestamp} = req.body;
    const alerts = [];
    if (temp > 30 ) alerts.push(temp + " °C High Temperature!");
    
    if (temp < 16) alerts.push(temp + " °C Low Temperature!");

    if (humidity > 70 || humidity < 20) alerts.push(humidity + " % High Humidity");

const reads = {
    temp: Number(temp),
    humidity: Number(humidity),
    timestamp: timestamp || new Date().toISOString(),
    alerts: alerts
}

readings.push(reads);
io.emit('sensorUpdate', reads);
res.status(201).json({
    message: "Reading added successfully",
    data: reads
})
};

const logPost = (req, res, next) => {
    console.log("Received a POST request");
    console.log(req.body);
    next();
};


app.get("/data", (req, res) => {
    console.log("Received a GET request");
    res.json({
        message: "Hello, this is your data!",
        state: "success"
    });
}); 


app.post("/api/readings", 
    logPost,
    checkreadings,
    createReading,
);


app.get("/api/lastreadings" , dataAvailable, (req, res) => {
        const lastreading = readings.length - 1;
        return res.json ({
            data: readings[lastreading],
            state: "200 OK"
        }) 
    }
);

app.get("/api/allreadings", dataAvailable, (req, res) => {
    res.json({
        data: readings,
        state: "200 OK"
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})


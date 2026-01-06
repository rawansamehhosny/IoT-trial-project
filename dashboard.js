const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const alertsEl = document.getElementById("alerts");

let chart;
let historyData = { labels: [], temp: [], humidity: [] };

// 1. ربط الـ Socket.io بالسيرفر
const socket = io("http://localhost:3001");

// 2. دالة تحديد اللون بناءً على الحرارة
function getStatusColor(temp) {
    if (temp > 35) return '#ff4d4d'; // أحمر (حار)
    if (temp < 20) return '#4d94ff'; // أزرق (بارد)
    return '#4dff88'; // أخضر (مثالي)
}

function updateUI(readings) {
    if (!readings) return;

    // تحديث النصوص والألوان في الكروت
    const dynamicColor = getStatusColor(readings.temp);
    tempEl.textContent = `${readings.temp} °C`;
    tempEl.style.color = dynamicColor;
    humidityEl.textContent = `${readings.humidity} %`;

    // تحديث التنبيهات
    if (readings.alerts && readings.alerts.length > 0) {
        alertsEl.innerHTML = readings.alerts.map(a => `<div class="alert-item">⚠️ ${a}</div>`).join("");
    } else {
        alertsEl.innerHTML = `<span style="color: #4ade80;">System Healthy</span>`;
    }

    // تحديث بيانات المصفوفة للشارت
    const timeLabel = new Date(readings.timestamp || Date.now()).toLocaleTimeString();
    historyData.labels.push(timeLabel);
    historyData.temp.push(readings.temp);
    historyData.humidity.push(readings.humidity);

    if (historyData.labels.length > 12) {
        historyData.labels.shift();
        historyData.temp.shift();
        historyData.humidity.shift();
    }

    if (chart) {
        // تم حذف سطر تغيير الـ borderColor بالكامل
        chart.update('none'); // تحديث الشارت ليرسم الألوان الجديدة بناءً على الـ segment
    }
}

// 4. دالة لجلب أول قراءات عند فتح الصفحة (Initial Load)
async function fetchInitialData() {
    try {
        const res = await fetch("http://localhost:3001/api/lastreadings");
        const json = await res.json();
        // تأكدي من هيكل الـ JSON الراجع من الباك إند
        const readings = json.data || json;
        updateUI(readings);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

// 5. استقبال البيانات اللحظية (Real-time)
socket.on("sensorUpdate", (readings) => {
    console.log("Real-time Update:", readings);
    updateUI(readings);
});

// 6. تهيئة الشارت
function initChart() {
    const ctx = document.getElementById("historyChart").getContext("2d");

    // إنشاء تدرج لوني (Gradient) تحت الخط
    const tempGradient = ctx.createLinearGradient(0, 0, 0, 400);
    tempGradient.addColorStop(0, 'rgba(77, 255, 136, 0.2)'); // أخضر شفاف من فوق
    tempGradient.addColorStop(1, 'rgba(77, 255, 136, 0)');   // يختفي تحت

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historyData.labels,
            datasets: [
                {
                    label: 'Temperature °C',
                    data: historyData.temp,
                    fill: true, // تفعيل التعبئة تحت الخط
                    backgroundColor: tempGradient,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: ctx => {
                        const val = ctx.raw;
                        return val > 30 ? '#ff4d4d' : '#4dff88'; // تلوين النقاط بناء على قيمتها
                    },
                    segment: {
                        borderColor: ctx => {
                            const val = ctx.p1.parsed.y;
                            if (val > 30) return '#ff4d4d';
                            if (val < 16) return '#4d94ff';
                            return '#4dff88';
                        }
                    }
                },
                {
                    label: 'Humidity %',
                    data: historyData.humidity,
                    borderColor: '#38bdf8',
                    borderDash: [5, 5], // جعل خط الرطوبة "منقط" لتمييزه بسهولة عن الحرارة
                    tension: 0.4,
                    fill: false,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    // إضافة خطوط إرشادية (Grid lines) أكثر وضوحاً
                    grid: { color: '#1e293b' }
                }
            },
            plugins: {
                // إضافة خط أفقي كـ Threshold (عتبة)
                annotation: { // يحتاج لمكتبة chartjs-plugin-annotation لو أردتيه احترافي جداً
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 30,
                            yMax: 30,
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 2,
                            label: { content: 'Warning Threshold', enabled: true }
                        }
                    }
                }
            }
        }
    });
}

// التشغيل
initChart();
fetchInitialData(); // بننادي دي مرة واحدة بس في الأول
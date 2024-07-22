var pause = true;

var hour = 0;
var minute = 0;
var second = 0;
var centisecondText = 0;

// 动态生成分刻度
function generateMinuteTicks() {
    let minuteTicks = document.getElementById("minuteTicks");
    for (let i = 0; i < 60; i++) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        let angle = i * 6; // 每分钟6度
        if (angle % 30 == 0) {
            continue; // 跳过整点
        }
        line.setAttribute("x1", "0");
        line.setAttribute("y1", "-85");
        line.setAttribute("x2", "0");
        line.setAttribute("y2", "-89");
        line.setAttribute("transform", "rotate(" + angle + ")");
        minuteTicks.appendChild(line);
    }
}

// 动态生成时刻度
function generateHourTicks() {
    let hourTicks = document.getElementById("hourTicks");
    for (let i = 0; i < 12; i++) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        let angle = i * 30; // 每小时30度
        line.setAttribute("x1", "0");
        line.setAttribute("y1", "-81");
        line.setAttribute("x2", "0");
        line.setAttribute("y2", "-89");
        line.setAttribute("transform", "rotate(" + angle + ")");
        hourTicks.appendChild(line);
    }
}

// 更新数字时钟
function updateDigitalClock() {
    let minuteText = minute < 10 ? "0" + minute : minute;
    let secondText = second < 10 ? "0" + Math.floor(second) : Math.floor(second);
    let centisecondText = Math.floor((second - Math.floor(second)) * 100);
    document.getElementById("digitalClock").textContent = minuteText + ":" + secondText + ":" + centisecondText.toString().padStart(2, '0');
}

// 更新秒针
function updateSecondHand() {
    let secondAngle = (second * 6);
    document.getElementById("secondHand").setAttribute("transform", "rotate(" + secondAngle + ", 100, 100)");
}

// 更新分针
function updateMinuteHand() {
    let minuteAngle = (minute * 6);
    document.getElementById("minuteHand").setAttribute("transform", "rotate(" + minuteAngle + ", 100, 100)");
}

// 更新时针
function updateHourHand() {
    let hourAngle = (hour % 12 * 30) + (minute / 2);
    document.getElementById("hourHand").setAttribute("transform", "rotate(" + hourAngle + ", 100, 100)");
}

// 更新时钟
function updateClock() {
    if (!pause) {
        second += 0.025;
        if (Math.floor(second) == 60) {
            second = 0;
            minute++;
        }
        if (minute == 60) {
            minute = 0;
            hour++;
        }
        if (hour == 24) {
            hour = 0;
        }
        updateDigitalClock();
        updateSecondHand();
        updateMinuteHand();
        updateHourHand();
    }
}

// 启动秒表
function startStopwatch() {
    pause = false;
}

// 停止秒表
function stopStopwatch() {
    pause = true;
}

// 重置秒表
function resetStopwatch() {
    pause = true;
    hour = 0;
    minute = 0;
    second = 0;
    updateDigitalClock();
    updateSecondHand();
    updateMinuteHand();
    updateHourHand();
}

// 初始化
function initStopwatch() {
    // 初始化时针、分针、秒针指向零点
    document.getElementById("secondHand").setAttribute("transform", "rotate(0, 100, 100)");
    document.getElementById("minuteHand").setAttribute("transform", "rotate(0, 100, 100)");
    document.getElementById("hourHand").setAttribute("transform", "rotate(0, 100, 100)");

    // 生成表盘刻度
    generateMinuteTicks();
    generateHourTicks();

    // 设置初始时间为0
    hour = 0;
    minute = 0;
    second = 0;
    centisecondText = 0;
    updateDigitalClock();


    // 绑定按钮事件
    document.getElementById("start-btn").addEventListener("click", startStopwatch);
    document.getElementById("stop-btn").addEventListener("click", stopStopwatch);
    document.getElementById("reset-btn").addEventListener("click", resetStopwatch);

    // 每秒更新时钟
    setInterval(updateClock, 25);
}


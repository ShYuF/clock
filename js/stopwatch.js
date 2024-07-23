var pause = false;
var start = false;

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
    let hourText = hour < 10 ? "0" + hour : hour;
    let minuteText = minute < 10 ? "0" + minute : minute;
    let secondText = second < 10 ? "0" + Math.floor(second) : Math.floor(second);
    let centisecondText = Math.floor((second - Math.floor(second)) * 100);
    document.getElementById("digitalClock").textContent = hourText + ":" + minuteText + ":" + secondText + "." + centisecondText.toString().padStart(2, '0');
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
    if (start && !pause) {
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
    start = true;

    document.getElementById("watchList").innerHTML = "";

    document.getElementById("start-btn").disabled = true;
    document.getElementById("pause-btn").disabled = false;
    document.getElementById("reset-btn").disabled = false;
    document.getElementById("record-btn").disabled = false;
}

// 停止秒表
function pauseStopwatch() {
    if (pause) {
        pause = false;
        document.getElementById("pause-btn").innerText = "暂停";
    } else {
        pause = true;
        document.getElementById("pause-btn").innerText = "继续";
    }
}

function recordStopwatch() {
    let time = document.getElementById("digitalClock").textContent;
    let watchList = document.getElementById("watchList");
    let recordItem = document.createElement("li");

    let cnt = watchList.children.length + 1;
    let len = cnt.toString().length;
    let space = "";
    for (let i = 0; i < 5 - len; i++) {
        space += "&nbsp;";
    }
    if (len % 2 == 0) {
        space += " ";
    }
    if (cnt % 2 == 0) {
        recordItem.style.backgroundColor = "#f0f0f0";
    }
    recordItem.innerHTML = "计次 " + cnt + space + time;
    watchList.appendChild(recordItem);
}

// 重置秒表
function resetStopwatch() {
    pause = true;
    start = false;

    hour = 0;
    minute = 0;
    second = 0;

    document.getElementById("watchList").innerHTML = "";
    document.getElementById("pause-btn").innerText = "暂停";

    document.getElementById("start-btn").disabled = false;
    document.getElementById("pause-btn").disabled = true;
    document.getElementById("reset-btn").disabled = true;
    document.getElementById("record-btn").disabled = true;


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

    document.getElementById("pause-btn").disabled = true;
    document.getElementById("reset-btn").disabled = true;
    document.getElementById("record-btn").disabled = true;
    // 绑定按钮事件
    document.getElementById("start-btn").addEventListener("click", startStopwatch);
    document.getElementById("pause-btn").addEventListener("click", pauseStopwatch);
    document.getElementById("record-btn").addEventListener("click", recordStopwatch);
    document.getElementById("reset-btn").addEventListener("click", resetStopwatch);

    // 点击"时钟"按钮时跳转到 index.html 页面
    document.getElementById("clock-btn").addEventListener("click", function() {
        window.location.href = "index.html";
    });
    // 每秒更新时钟
    setInterval(updateClock, 25);
}


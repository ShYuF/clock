var start = false;
var pause = false;

var hour = 0;
var minute = 0;
var second = 0;

var hoursWheelSel = 0;
var minutesWheelSel = 0;
var secondsWheelSel = 0;

const timerMusic = new Audio("res/timer.mp3");

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

// 生成滚轮选择器
function generateSelector() {
    let hoursWheel = document.getElementById("hoursWheel"),
        minutesWheel = document.getElementById("minutesWheel"),
        secondsWheel = document.getElementById("secondsWheel");

    let blank_option = document.createElement("li");

    for (let i = 0; i < 100; i++) {
        let option = document.createElement("li");
        option.value = i;
        option.textContent = i + "时";
        hoursWheel.appendChild(option);
    }
    
    for (let i = 0; i < 60; i++) {
        let option = document.createElement("li");
        option.value = i;
        option.textContent = i + "分";
        minutesWheel.appendChild(option);
    }

    for (let i = 0; i < 60; i++) {
        let option = document.createElement("li");
        option.value = i;
        option.textContent = i + "秒";
        secondsWheel.appendChild(option);
    }

    for (let i = 0; i < 2; i++) {
        let h_option = blank_option.cloneNode(),
            m_option = blank_option.cloneNode(),
            s_option = blank_option.cloneNode();
        h_option.value = 100 + i;
        m_option.value = 60 + i;
        s_option.value = 60 + i;
        hoursWheel.appendChild(h_option);
        minutesWheel.appendChild(m_option);
        secondsWheel.appendChild(s_option);
    
    }
}

// 更新数字时钟
function updateDigitalClock() {
    let hourText = hour < 10 ? "0" + hour : hour;
    let minuteText = minute < 10 ? "0" + minute : minute;
    let secondText = second < 10 ? "0" + Math.ceil(second) : Math.ceil(second);
    document.getElementById("digitalClock").textContent = hourText + ":" + minuteText + ":" + secondText;
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
        second -= 0.025;
        if (hour == 0 && minute == 0 && second < 0.001) {
            start = false;
            pause = false;

            second = 0;

            timerMusic.play();

            document.getElementById("start-btn").disabled = false;
            document.getElementById("pause-btn").disabled = true;
            document.getElementById("stop-btn").disabled = true;
        }
        if (second < -1.00) {
            second += 60.0;
            if (hour > 0 && minute == 0 || minute > 0) {
                minute--;
            }
            else {
                second = 0.0;
            }
        }
        if (minute < 0) {
            minute += 60;
            hour--;
        }

        updateDigitalClock();
        updateSecondHand();
        updateMinuteHand();
        updateHourHand();
    }
}

function moveHoursWheel(e) {
    let hoursWheel = document.getElementById("hoursWheel");

    let y = e.clientY;

    let oldTop = parseInt(hoursWheel.style.top == "" ? 0 : hoursWheel.style.top.replace("px", ""));
    let newTop = oldTop + (y - hoursWheelSel) / 16;
    if (newTop < -30 * 99) {
        newTop = -30 * 99;
    }
    if (newTop > 0) {
        newTop = 0;
    }

    hoursWheel.style.top = newTop + "px";
}

function stopHoursWheel(e) {
    let hoursWheel = document.getElementById("hoursWheel");
    let oldTop = parseInt(hoursWheel.style.top == "" ? 0 : hoursWheel.style.top.replace("px", ""));
    let newTop = Math.round(oldTop / 30) * 30;
    hoursWheel.style.top = newTop + "px";
    document.removeEventListener("mousemove", moveHoursWheel);
    document.removeEventListener("mouseup", stopHoursWheel);
    pause = false;
}

function moveMinutesWheel(e) {
    let minutesWheel = document.getElementById("minutesWheel");

    let y = e.clientY;

    let oldTop = parseInt(minutesWheel.style.top == "" ? 0 : minutesWheel.style.top.replace("px", ""));
    let newTop = oldTop + (y - minutesWheelSel) / 16;
    if (newTop < -30 * 59) {
        newTop = -30 * 59;
    }
    if (newTop > 0) {
        newTop = 0;
    }

    minutesWheel.style.top = newTop + "px";
}

function stopMinutesWheel(e) {
    let minutesWheel = document.getElementById("minutesWheel");
    let oldTop = parseInt(minutesWheel.style.top == "" ? 0 : minutesWheel.style.top.replace("px", ""));
    let newTop = Math.round(oldTop / 30) * 30;
    minutesWheel.style.top = newTop + "px";
    document.removeEventListener("mousemove", moveMinutesWheel);
    document.removeEventListener("mouseup", stopMinutesWheel);
    pause = false;
}

function moveSecondsWheel(e) {
    let secondsWheel = document.getElementById("secondsWheel");

    let y = e.clientY;

    let oldTop = parseInt(secondsWheel.style.top == "" ? 0 : secondsWheel.style.top.replace("px", ""));
    let newTop = oldTop + (y - secondsWheelSel) / 16;
    if (newTop < -30 * 59) {
        newTop = -30 * 59;
    }
    if (newTop > 0) {
        newTop = 0;
    }

    secondsWheel.style.top = newTop + "px";
}

function stopSecondsWheel(e) {
    let secondsWheel = document.getElementById("secondsWheel");
    let oldTop = parseInt(secondsWheel.style.top == "" ? 0 : secondsWheel.style.top.replace("px", ""));
    let newTop = Math.round(oldTop / 30) * 30;
    secondsWheel.style.top = newTop + "px";
    document.removeEventListener("mousemove", moveSecondsWheel);
    document.removeEventListener("mouseup", stopSecondsWheel);
    pause = false;
}

function startTimer() {
    let hoursWheel = document.getElementById("hoursWheel"),
        minutesWheel = document.getElementById("minutesWheel"),
        secondsWheel = document.getElementById("secondsWheel");
    let hourTop = parseInt(hoursWheel.style.top == "" ? 0 : hoursWheel.style.top.replace("px", "")),
        minuteTop = parseInt(minutesWheel.style.top == "" ? 0 : minutesWheel.style.top.replace("px", "")),
        secondTop = parseInt(secondsWheel.style.top == "" ? 0 : secondsWheel.style.top.replace("px", ""));
    hour = -hourTop / 30;
    minute = -minuteTop / 30;
    second = -secondTop / 30.0;

    if (hour == 0 && minute == 0 && Math.abs(second) <= 0.001) {
        alert("定时器计时不能为0！");
        return;
    }

    if (timerMusic.paused == false) {
        timerMusic.pause();
        timerMusic.currentTime = 0;
    }
    pause = false;
    start = true;

    document.getElementById("start-btn").disabled = true;
    document.getElementById("pause-btn").disabled = false;
    document.getElementById("stop-btn").disabled = false;
}

function pauseTimer() {
    if (pause) {
        pause = false;
        document.getElementById("pause-btn").innerText = "暂停";
    }
    else {
        pause = true;
        document.getElementById("pause-btn").innerText = "继续";
    }
}

function stopTimer() {
    start = false;
    pause = false;

    hour = 0;
    minute = 0;
    second = 0;

    document.getElementById("hoursWheel").style.top = "0";
    document.getElementById("minutesWheel").style.top = "0";
    document.getElementById("secondsWheel").style.top = "0";

    document.getElementById("start-btn").disabled = false;
    document.getElementById("pause-btn").disabled = true;
    document.getElementById("pause-btn").innerText = "暂停";
    document.getElementById("stop-btn").disabled = true;

    updateDigitalClock();
    updateSecondHand();
    updateMinuteHand();
    updateHourHand();
}

// 初始化
function initTimer() {
    // 初始化时针、分针、秒针指向零点
    document.getElementById("secondHand").setAttribute("transform", "rotate(0, 100, 100)");
    document.getElementById("minuteHand").setAttribute("transform", "rotate(0, 100, 100)");
    document.getElementById("hourHand").setAttribute("transform", "rotate(0, 100, 100)");

    // 设置初始时间为0
    hour = 0;
    minute = 0;
    second = 0;

    // 生成表盘刻度
    generateMinuteTicks();
    generateHourTicks();

    updateDigitalClock();

    generateSelector();

    document.getElementById("hoursWheel").addEventListener("mousedown", function(e) {
        e.preventDefault(); // 防止默认事件（例如文本选择）
        hoursWheelSel = e.clientY;
        document.addEventListener("mousemove", moveHoursWheel);
        document.addEventListener("mouseup", stopHoursWheel);
    });
    document.getElementById("minutesWheel").addEventListener("mousedown", function(e) {
        e.preventDefault(); // 防止默认事件（例如文本选择）
        minutesWheelSel = e.clientY;
        document.addEventListener("mousemove", moveMinutesWheel);
        document.addEventListener("mouseup", stopMinutesWheel);
    });
    document.getElementById("secondsWheel").addEventListener("mousedown", function(e) {
        e.preventDefault(); // 防止默认事件（例如文本选择）
        secondsWheelSel = e.clientY;
        document.addEventListener("mousemove", moveSecondsWheel);
        document.addEventListener("mouseup", stopSecondsWheel);
    });

    // 点击按钮跳转页面
    document.getElementById("clock-btn").addEventListener("click", function() {
        window.location.href = "index.html";
    });
    document.getElementById("stopwatch-btn").addEventListener("click", function() {
        window.location.href = "stopwatch.html";
    });

    setInterval(updateClock, 25);
}


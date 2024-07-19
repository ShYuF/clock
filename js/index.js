var pause = false;

var hour = 0;
var minute = 0;
var second = 0;

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
    document.getElementById("digitalClock").textContent = hourText + ":" + minuteText + ":" + secondText;
}

// 更新时钟指针
function updateClock() {
    if (pause) {
        return;
    }

    // 计算角度
    let hourAngle = (hour % 12 * 30) + (minute / 2);
    let minuteAngle = (minute * 6);
    let secondAngle = (second * 6);

    // 更新指针
    document.getElementById("secondHand").setAttribute("transform", "rotate(" + secondAngle + ", 100, 100)");
    document.getElementById("minuteHand").setAttribute("transform", "rotate(" + minuteAngle + ", 100, 100)");
    document.getElementById("hourHand").setAttribute("transform", "rotate(" + hourAngle + ", 100, 100)");

    // 更新数字时钟
    updateDigitalClock();

    // 更新时间
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
}

// 根据输入更新时钟时间
function updateClockByTime(reset) {
    if (reset) {
        // 更新为当前时间（重置时间）
        let now = new Date();
        hour = now.getHours();
        minute = now.getMinutes();
        second = now.getSeconds();
        let hourText = hour < 10 ? "0" + hour : hour;
        let minuteText = minute < 10 ? "0" + minute : minute;
        let secondText = second < 10 ? "0" + Math.floor(second) : Math.floor(second);
        
        document.getElementById("selTime").value = hourText + ":" + minuteText + ":" + secondText;
        updateClock();
    }
    else {
        // 更新为输入时间
        const re_time = /(\d{2}):(\d{2}):(\d{2})/;
        let time = re_time.exec(document.getElementById("selTime").value);
        hour = parseInt(time[1]);
        minute = parseInt(time[2]);
        second = parseInt(time[3]);
        console.log(time, hour, minute, second);
        updateClock();
    }
}

// 指针拖动
function dragPointer(e, pointerId) {
    let rect = document.getElementById("clock").getBoundingClientRect();
    let cx = rect.left + rect.width / 2;
    let cy = rect.top + rect.height / 2;
    let x = e.clientX;
    let y = e.clientY;

    let angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90; // 计算角度并转换为度数
    document.getElementById(pointerId).setAttribute("transform", "rotate(" + angle + ", 100, 100)");

    // 更新时间
    if (pointerId == "hourHand") {
        let bias = hour >= 12;
        let m2al = hour == 12,
            m2ar = hour == 0;
        let a2ml = hour == 11,
            a2mr = hour == 23;
        hour = Math.floor(angle / 30);
        if (hour < 0) {
            hour += 12;
        }
        if (bias) {
            hour += 12;
        }
        // 修正上下午时间
        if (m2al && hour == 23) {
            hour = 11;
        }
        if (a2ml && hour == 0) {
            hour = 12;
        }
        if (m2ar && hour == 11) {
            hour = 23;
        }
        if (a2mr && hour == 12) {
            hour = 0;
        }
    } else if (pointerId == "minuteHand") {
        let l2r = minute >= 55,
            r2l = minute < 5;
        minute = Math.floor(angle / 6);
        if (minute < 0) {
            minute += 60;
        }
        // 分时转换逻辑
        if (l2r && minute < 5) {
            hour = (hour + 1) % 24;
        }
        if (r2l && minute >= 55) {
            hour = (hour + 23) % 24;
        }
        let hourAngle = (hour % 12 * 30) + (minute / 2);
        document.getElementById("hourHand").setAttribute("transform", "rotate(" + hourAngle + ", 100, 100)");
    } else if (pointerId == "secondHand") {
        let l2r = second >= 55,
            r2l = second < 5;
        second = Math.floor(angle / 6);
        if (second < 0) {
            second += 60;
        }
        // 秒分时转换逻辑
        if (l2r && second < 5) {
            minute = minute + 1;
            if (minute == 60) {
                minute = 0;
                hour = (hour + 1) % 24;
            }
        }
        if (r2l && second >= 55) {
            minute = minute - 1;
            if (minute == -1) {
                minute = 59;
                hour = (hour + 23) % 24;
            }
        }
        let hourAngle = (hour % 12 * 30) + (minute / 2);
        let minuteAngle = (minute * 6);
        document.getElementById("minuteHand").setAttribute("transform", "rotate(" + minuteAngle + ", 100, 100)");
        document.getElementById("hourHand").setAttribute("transform", "rotate(" + hourAngle + ", 100, 100)");
    }
    updateDigitalClock();
}

function moveSecondHand(e) {
    dragPointer(e, "secondHand");
}

function moveMinuteHand(e) {
    dragPointer(e, "minuteHand");
}

function moveHourHand(e) {
    dragPointer(e, "hourHand");
}

function stopDragSecondHand(e) {
    document.removeEventListener("mousemove", moveSecondHand);
    document.removeEventListener("mouseup", stopDragSecondHand);
    pause = false;
}

function stopDragMinuteHand(e) {
    document.removeEventListener("mousemove", moveMinuteHand);
    document.removeEventListener("mouseup", stopDragMinuteHand);
    pause = false;
}

function stopDragHourHand(e) {
    document.removeEventListener("mousemove", moveHourHand);
    document.removeEventListener("mouseup", stopDragHourHand);
    pause = false;
}

// 初始化
function init() {
    let now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    second = now.getSeconds();

    // 添加拖动事件监听器
    // 鼠标移动时显示坐标
    // document.getElementsByTagName("body")[0].addEventListener("mousemove", function(e) {
    //     document.getElementById("tips").textContent = "X: " + e.clientX + " Y: " + e.clientY;
    // });
    // 秒针
    document.getElementById("secondHand").addEventListener("mousedown", function(e) {
        e.preventDefault(); // 防止默认事件（例如文本选择）
        pause = true;
        document.addEventListener("mousemove", moveSecondHand);
        document.addEventListener("mouseup", stopDragSecondHand);
    });
    // 分针
    document.getElementById("minuteHand").addEventListener("mousedown", function(e) {
        e.preventDefault();
        pause = true;
        document.addEventListener("mousemove", moveMinuteHand);
        document.addEventListener("mouseup", stopDragMinuteHand);
    });
    // 时针
    document.getElementById("hourHand").addEventListener("mousedown", function(e) {
        e.preventDefault();
        pause = true;
        document.addEventListener("mousemove", moveHourHand);
        document.addEventListener("mouseup", stopDragHourHand);
    });

    document.getElementById("selTime").value = hour + ":" + minute + ":" + second;

    generateMinuteTicks();
    generateHourTicks();
    updateClock();

    // 每秒更新时钟
    setInterval(updateClock, 25);
}
            
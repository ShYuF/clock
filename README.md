Upd：7.19 20:14

**为了添加新功能，尝试对布局进行大改，因此创建该分支**

### 已完成
- 表盘基础绘制
- 时间的初始化（当前时间）和自动更新
- 表针的拖动逻辑和时间变化逻辑
- 输入设定时间（基于html自带的 `<input type="time">` 控件修改）

### 未完成
- 界面美化（<span style="color: red">重要</span>）
- 闹钟、秒表和计时？（实验文档的说明和任务点之间似乎有冲突）
- 报告文档等

### 已知问题
- 在特殊情况下时间会出现负数（已修复？未验证）
- 时间在放置状态下会出现明显的滞后情况（未修复，原因可能是浏览器后台时会暂停触发）
- 界面刷新后小概率设定时间控件不会出现初始时间（已修复？）

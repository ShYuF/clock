Upd：7.23 01:26

### 新增
- 主界面下方的四个按钮。“时钟”和“秒表”可以使用
- 秒表界面的正常使用功能。（缺少秒表的获取时间点功能，但真的要做吗）

### 未完成
- 剩余两个功能的实现——“闹钟”和“计时器”
- 界面美化（<span style="color: red">重要</span>）
- 报告文档等

Upd：7.19 20:14

**注意：有关闹钟及其它内容，见分支** `new_ui`
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

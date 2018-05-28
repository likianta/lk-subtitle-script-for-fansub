{
    // LK Subtitle Generator.jsx
    // LK字幕生成工具
    //
    // 发布注意：发布前请将`var VERSION = 'DEVELOP'`注释掉，并启用`var VERSION = 'RELEASE'`

    function LK_SubtitleGenerator(thisObj)
    {
        var scriptName = "LK Subtitle Generator"; // 脚本标题
        var VERSION = 'DEVELOP'; // 切换到“开发者版本”
        //var VERSION = 'RELEASE'; // 切换到“发布版本”
    

        // UI变量初始化
        var btn_1 = null; // 起始按钮
        var btn_2 = null; // 结束按钮
        var btn_3 = null; // 删除按钮
        var btn_4 = null; // 生成按钮
        var btn_5 = null; // 导入按钮
        var color = null; // 颜色输入框
        var edt = null; // 文本输入框
        var listbox = null; // 列表控件
        var panel = null; // 主面板
        var win = null; // 父窗口

        // 下面编写函数功能
        function createUI() {
            // 使用P9 UI创建用户交互界面
            
            // 创建窗口和面板
            // 第一个参数是控件类型
            // 第二个参数是标题名称
            // 第三个是相对位置（“100,100”是相对电脑屏幕左上角的间距，“600,575”是窗口右下角的坐标，因此窗口的宽度为500px，高度为475px）
            // 第四个参数是窗口属性
            win = new Window("palette", scriptName, [100,100,600,575], {resizeable:true});
            // 在该窗口中添加一个面板（panel），位置是相对**父控件**的位置（即充满父窗口）
            panel = win.add("panel", [0,0,500,475]);

            // 创建一个含有四纵列的列表控件（listbox）
            listbox = panel.add("listbox", [5,25,490,375], '', {
                // 花括号内是第四个参数，定义listbox的专有属性
                numberOfColumns: 4, // 列数为4
                showHeaders: true, // 显示每列的标题头
                columnTitles: ['id', 'start', 'end', 'content'], // 标题头名称依次是编号、起始时间、结束时间和文本内容
                columnWidths: [45,95,95,235]}); // 定义每列的宽度

            // 颜色编辑框，位于图中的右上角
            color = panel.add("edittext", [402,5,490,23], "color", {multiline:false, wantReturn:false});

            // 文本编辑框，位于图中的底部，用于输入当前字幕内容
            edt = panel.add("edittext", [5,380,490,430], "", {multiline:true, wantReturn:true});

            // 底部的一排按钮控件
            btn_1 = panel.add("button", [10,440,98,465], "Start");
            btn_2 = panel.add("button", [108,440,196,465], "End");
            btn_3 = panel.add("button", [206,440,294,465], "Delete");
            btn_4 = panel.add("button", [304,440,392,465], "Generate");
            btn_5 = panel.add("button", [402,440,490,465], "Import");

            // 最后记得把窗口显示出来
            win.show();
        }
        createUI(); // 执行该函数


        // 初始化值
        var content = ''; // 文本变量，记录文本编辑框中的文字
        var end_time = ''; // 结束时间，专用于记录字幕的结束时间
        var event = ''; // 用于作为事件触发的识别码
        var file = null; // 文件对象
        var id = 0; // 列表编号
        var item = null; // 字幕。一行字幕就是一个item，即一个item包含编号、起始时间、结束时间、文本内容四个属性
        var last_item = null; // 记录上一个item
        var last_time = ''; // 记录上一次的时间值
        var last_value = ''; // 记录上一次的值（可以用来记录颜色值、标记值、状态值等）
        var s = ''; // 变量`s`用于记录任何不重要的中间（过程）值，但主要是用来传递时间值的
        var start_time = ''; // 开始时间，专用于记录字幕的开始时间
        var subs = new Array(); // `subs[]`主要在btn_5事件、`ParseContent()`函数中被使用
        var CONSOLE_EDT = null; // 静态对象，用于在开发者模式下的信息输出框（EditText）
        var CONSOLE_WIN = null; // 静态对象，用于在开发者模式下的信息输出窗口
        var SCRIPT_FILE = '/LK_SubtitleScripts/LK Subtitle Import.jsxbin'; // 静态值，表示`Import`按钮关联的脚本文件
        //var SCRIPT_FILE = '/LK Subtitle Import.jsxbin';
        var FPS = 0; // 静态值，表示当前工程中的合成视频的帧速率
        var INDEX = 0; // 静态值，表示合成视频位于当前工程中的素材文件的位置
        // ↑ 相关学习：[AE脚本 app.project.item(index) 讲解](https://likianta.coding.me/2018/0130225017/)

        // 下面对静态值进行预处理
        function presetStaticValues() {
            // 一、INDEX & FPS
            // 首先获取当前工程面板中的素材总数量（相关学习：[AE脚本 app.project.item(index) 讲解](https://likianta.coding.me/2018/0130225017/）
            s = app.project.numItems;
            // 然后遍历素材，找到“合成视频”这个素材，并读取它在素材中的绝对位置（INDEX）以及视频帧速率（FPS）
            for (i = s; i > 0; i--) { // 从倒数第一个向第一个素材遍历，目的是找到一个含有合成视频的素材（也就是我们当前工程中的“视频序列”）
                if (app.project.item(i).hasVideo && app.project.item(i).typeName == '合成') {
                    // 找到以后记录下它的位置和视频帧率，以后会作为静态值调用
                    INDEX = i;
                    FPS = app.project.item(INDEX).frameRate; // 获取当前视频的帧速率
                    break;
                } else if (i == 1) { // 如果完全遍历后仍找不到，那么会弹出警告提示框
                    alert("There is no video compItem found!", 'Warning');
                }
            }

            // 二、SCRIPT_FILE
            file = new File($.fileName); // 获得父脚本的绝对路径
            // ↑ 比如`C:/Program Files/Adobe/Adobe After Effects CC 2017/Support Files/Scripts/ScriptUI Panels/LK_SubtitleScripts/LK Subtitle Generator.jsx`
            if (VERSION == 'RELEASE') { // 发布版关联的子脚本的路径
                SCRIPT_FILE = new File(file.path + SCRIPT_FILE);
                // ↑ 其值为`C:/Program Files/Adobe/Adobe After Effects CC 2017/Support Files/Scripts/ScriptUI Panels/LK_SubtitleScripts/LK Subtitle Import.jsx`
                if (!SCRIPT_FILE.exists) {
                    // 如果上述文件不存在，则看看是不是用了中文文件名
                    SCRIPT_FILE = new File(file.path + '/LK_SubtitleScripts/LK字幕导入工具.jsxbin');
                    //SCRIPT_FILE = new File(file.path + '/LK字幕导入工具.jsxbin');
                    if (!SCRIPT_FILE.exists) {
                        // 如果中文文件名也不存在，则会提示找不到子脚本，并提示用户手动查找该脚本
                        alert('Script file missed. You can browse it manually.', 'Prompt');

                        // 打开文件对话框
                        // 相关学习：[02 JS打开文件选择对话框](https://likianta.coding.me/2018/0211-213555/)
                        SCRIPT_FILE = File.openDialog ("Look for 'LK Subtitle Import.jsxbin'",
                            ["Adobe Script File Binary:*.jsxbin", "Adobe Script File:*.jsx", "All Files:*.*"],
                            false);

                        // 如果用户什么都不选（点了取消），则最后提醒一下“部分功能将无法正常工作”
                        if (SCRIPT_FILE == null) {
                            alert('Script file missed. Import function disabled.', 'Warning');
                            return;
                        }
                    }
                }
            } else if (VERSION == 'DEVELOP') { // 开发版关联此脚本
                // 开发模式就比较简单了，直接查找我放好的文件路径即可
                SCRIPT_FILE = new File(file.path + '/LK Subtitle Import.jsx');
                // ↑ 获得`F:/Workspace/LikiantaProjects/LK AE Subtitle Scripts for Fansub/LK_SubtitleScripts/LK Subtitle Import.jsx`

                // 三、在开发者模式中新建一个窗口，作为调试输出窗口
                CONSOLE_WIN = new Window("palette", 'Console (Output Test)', [750,100,1150,575], {resizeable:false});
                CONSOLE_EDT = CONSOLE_WIN.add("edittext", [2,2,398,473], 'Print Log: \n', {multiline:true, wantReturn:true});
                // ↑ 第四个参数：`multiline`表示允许自动换行；`wantReturn`表示允许用户回车换行
                CONSOLE_WIN.show();
            }
        }
        presetStaticValues(); // 执行预处理函数


        // 设置按钮监听器
        function addListeners() {
            btn_1.onClick = onBtn1Click; // 创建本条字幕开始时间
            btn_2.onClick = onBtn2Click; // 创建本条字幕结束时间
            btn_3.onClick = onBtn3Click; // 删除选定的字幕
            btn_4.onClick = onBtn4Click; // 开始生成AE文字图层
            btn_5.onClick = onBtn5Click; // 导入字幕文件（*.ass）
            color.onClick = onColorClick; // 设置颜色值
            edt.onClick = onEdtClick; // 监听编辑框中的键盘事件
        }
        addListeners();


        // 以下为具体函数功能实现
        function onBtn1Click() {
            // 主要目标：创建本条字幕的开始时间

            // 检查文本内容是否为空：
            // 当存在时赋予本条字幕内容并增加编号；若不存在则弹出警告并中止后面的操作
            content = edt.text; // 获取编辑框中的文本
            if (content == "") { // 文本为空，弹出警告
                alert("Please input some contents", "Warning");
            } else { // 文本存在，继续
                // 接下来我们从一条字幕被“生产”出来的角度来理解期间经过了什么变化

                // 首先，新建一条字幕，编号+1
                id += 1;

                // 如果id是个位数，为了看起来整齐一些，对它进行补零操作：01, 02, 03...
                if (id < 10) {
                    item = listbox.add('item','0' + id);
                } else {
                    item = listbox.add('item', id);
                }
    
                // 获取当前时间并赋值给`start`列
                s = app.project.item(INDEX).time; // 获取该合成视频的当前时间
                // ↑ 假设我们的时间位于视频大约30s处，其格式为“30.1134467801134”
                s = timeToCurrentFormat(s, FPS); // 对时间进行转制并应用static帧速率
                // ↑ 将时间转换成“00:00:30:02”的形式
                item.subItems[0].text = s; // 当前字幕的第一子列（也就是`start`列）显示时间
                item.subItems[2].text = content; // 第三子列（也就是`content`列）显示文本

                // 列表滚动到底部
                listbox.revealItem(item);
                //item.selected = true;

                // 接下来判断上一条字幕的“结束时间”是否为空
                // 若为空则将当前开始时间赋给上条字幕的结束时间
                if (id > 1 && last_time == '') {
                    last_item.subItems[1].text = s; 
                }              

                // 记得文字上屏后要把编辑框内的文字清空
                edt.text = "";

                // 记录此次操作的item和time，以供后续回调
                last_item = item;
                last_time = item.subItems[1].text;
            }
        }
    

        function onBtn2Click() {
            // 主要目标：创建本条字幕的结束时间

            // 判断本条字幕的结束时间是否已存在，若存在则新建一条字幕；不存在（默认情况）则给当前字幕赋予结束值
            if (last_time == "") {
                if (id > 0) {
                    s = app.project.item(INDEX).time; // 获取当前时间（格式为“30.1134467801134”）
                    s = timeToCurrentFormat(s, FPS); // 转换时间格式（转换为“00:00:30:02”）
                    item = listbox.items[id-1]; // 获取当前字幕（也就是列表中最后一条字幕，注意列表是从0开始数的）
                    item.subItems[1].text = s; // 赋予当前时间到`end`列
                    last_time = item.subItems[1].text; // 记录此次操作的item（略）和time，以供后续回调

                    // 强制激活“end”列，使时间码立即显示
                    s = listbox.add('item', ''); // “临时”新建一条空字幕
                    listbox.remove(s); // 随即又把它删除
                } else {
                    // 若当前字幕的`id`=0，说明用户打算在第一条就去创建结束时间
                    // 这个操作是不允许的，我们会给出一个警告窗口提示用户“先定义一个开始时间”
                    alert("Please define a start time first.", "Warning");
                }
            } else { // 若当前字幕时间值不为空，则新建一条字幕再赋值
                content = edt.text;
                // 检查文本是否为空，为空则中止操作，不为空则继续
                if (content == '') {
                    alert("Please input some contents", "Warning");
                } else {
                    // 新建字幕编号
                    id += 1;
    
                    // 个位数需要进行补零操作：01, 02, 03...
                    if (id < 10) {
                        item = listbox.add('item','0' + id);
                    } else {
                        item = listbox.add('item', id);
                    }
    
                    // 获取当前时间并赋值给`end`列
                    s = app.project.item(INDEX).time;
                    s = timeToCurrentFormat(s, FPS);
                    item.subItems[0].text = last_time; // 使本条字幕的start时间 = 上条字幕的end时间
                    item.subItems[1].text = s;
                    item.subItems[2].text = content;

                    // 列表滚动到底部
                    listbox.revealItem(item);

                    // 记得文字上屏后要把编辑框内的文字清空
                    edt.text = "";

                    // 记录此次操作的item和time，以供后续回调
                    last_item = item;
                    last_time = item.subItems[1].text;
                }
            }
        }
    

        function onBtn3Click() {
            // 删除被选中的字幕
            s = listbox.selection; // 获得当前被选中的字幕，如果没有选择任何字幕，则返回一个`null`
            var m = s.text; // 获取待删项的编号，注意一定要在删除之前获取，另外需要注意的是假如它是个位数，那么它的形式是“03”而不是“3”
            var n = id; // 获取删除前的id值（此值也就相当于删除前的字幕总条数）
            
            if (s != null) {
                listbox.remove(s);
            } else {
                alert('Please choose any listItem first', 'Prompt');
            }

            if (m == n) { // 如果`m = n`，则说明删除的是最后一项，所以只需要将id值-1即可
                id -= 1;
            } else {
                for (id = m * 1; m <= id < n; id++) { // 这里之所以定义`id=m*1`，是因为m的形式是“03”（字符串类型），因此我们要对它转成数字“3”
                    // 个位数需要进行补零操作：01, 02, 03...
                    if (id < 10) {
                        listbox.items[id-1].text = '0' + id;
                    } else {
                        listbox.items[id-1].text = id;
                    }
                }
                // 记录此次操作的item和time（略），以供后续回调
                last_item = listbox.items[id-1];

                // 强制激活listbox，使编号立即被显示
                s = listbox.add('item', '');
                listbox.remove(s);
            }
        }
    

        function onBtn4Click() {
            // 开始生成文本图层
            if (id > 0) {
                var txt_layer = null; // 定义一个区间变量，用于记录文字图层对象
                for (i = 0; i < id; i++) {
                    // 在AE的图层面板中依次为每条字幕生成文字图层
                    s = listbox.items[i];

                    // 获取`listbox`中的字幕时间并转换回“30.1134467801134”的形式
                    start_time = s.subItems[0].text;
                    start_time = currentFormatToTime(start_time, FPS);
                    end_time = s.subItems[1].text;
                    end_time = currentFormatToTime(end_time, FPS);
                    content = s.subItems[2].text; // 获取文本内容

                    // 开始生成文字图层
                    // 参考：After Effects CS6 Scripting Guide - p14,86,94,98,182,188
                    txt_layer = app.project.item(INDEX).layers.addText(content);
                    txt_layer.inPoint = start_time;
                    txt_layer.outPoint = end_time;
                }
            } else {
                alert("There are no subtitles in your list!", 'Warning');
            }
        }
    

        function onBtn5Click() {
            // 导入字幕文件（会弹出文件选择对话框）

            SCRIPT_FILE.open('r'); // 该`SCRIPT_FILE`就是`LK Subtitle Import.jsx`文件
            content = eval(SCRIPT_FILE.read()); // `eval`函数可读取并执行一个脚本对象
            // ↑ 因为我们的父脚本中已经有一个`content`变量，可用其接收子脚本返回的对象
            SCRIPT_FILE.close();

            if (content != null) {
                // Obtained the subtitle file content
                // Parse it to be list items
                ParseContent();
            }
        }


        function ParseContent() {
            var regex = RegExp('Dialogue.+\n*', 'g');
            // 先预测（`test`）一下有没有匹配项，有的话再执行（`exec`）匹配
            if (regex.test(content)) {
                // 执行匹配：
                // 使用正则匹配来解析文本内容，此将返回一个字符串数组
                // 注意：`exec()`函数每次执行都只会返回一个match，第二次执行则会继续查找下一个match
                // （参考：http://blog.csdn.net/danzhang1010/article/details/51204566）
                for (i = 0; ; i++) {
                    s = regex.exec(content); // returns one string array
                    if (s != null || s != undefined) {
                        subs[i] = s[0]; // 注意`s`是数组（虽然里面只有一行字符串）
                        // （PS：其实`s`显示的内容和`s[0]`是一样的，但我们需要的类型是字符串而不是数组。所以必须取出这个字符串，以方便后续处理）
                    } else if (i > 1000) {
                        alert('Script stoped because of too many matches.\nPlease check the type of source file which you selected.', 'Warning');
                        break;
                    } else {
                        // 匹配完成。正常退出
                        break;
                    }
                }
            } else {
                alert('There are no matches in the content.', 'Prompt');
            }
            
            // Dev output test
            if (VERSION == 'DEVELOP') {
                file = new File($.fileName);
                file = new File(file.path + "/resources/output.txt");
                file.open('w');
                s = 'Output Info:\n';
                for (i = 0; i < subs.length; i++) { s += subs[i] + '\n'; } // `subs[i]`已含有换行符，这里又添加一个换行符，此时每段之间都有一个空行
                file.write(s);
                file.close();
                $.writeln('Output done.');
            }
            
            // 对每一条数据进行解析，并生成可识别的字幕后上屏
            regex = RegExp('\\d:\\d\\d:\\d\\d\\.\\d\\d', 'g'); // 获得当前时间（时分秒毫秒）
            regex_2 = RegExp('[^,]+$');
            for (i = 0; i < subs.length; i++) {
                // Content
                s = subs[i].slice(45, -1); // 先“大概”剪一下，取字符串的后半截，以适当减轻匹配压力
                // ↑注意：如果剪得太多，会造成匹配式`regex_2`失效，表现为列表为空
                s = regex_2.exec(s);
                content = s[0];

                // 特别注意！ASS与AE的时间码是不同的！
                // ASS时间码为`时:分:秒.毫秒`；AE时间码为`时:分:秒:帧数`
                // （AE的帧数是从零开始数的，比如一个视频是24FPS，那么它每秒就由0-23帧组成）
                // AE无法直接使用ASS文件中的时间码。因此要进行一次换算：
                // 相关学习：[Aegisub时间码格式详解](https://likianta.coding.me/2018/0213-224002/)
                var half_frame = Math.round(500 / FPS); // = Math.round((1000ms/24fps)/2) = 21
                var t = 0;
                var timecode = '';
                function timeCodeConversion(event) {
                    if (event == 'start') {
                        // 开始时间处理
                        // Example: source time code: 0:00:06.81
                        timecode = subs[i].slice(12, 22) + '0'; // = 0:00:06.810

                        // 还原真实时间
                        if (timecode != '0:00:00.000') {
                            t = timecode.slice(-3) * 1; // = [number]810ms
                            t += half_frame; // = 832ms

                        }

                        // 计算溢出
                        s = timecode.slice(0, 1) * 3600 +  // = 0 hour
                            timecode.slice(2, 4) * 60 + // = 00 minute
                            timecode.slice(5, 7) * 1; // = 06 seconds


                        if (s.slice(0, 1) == 0) { // 判断小时数
                            // 获取分钟数
                            t = s.slice(2, 4) * 1;
                            // 判断：如果分钟数不超过十分钟，则继续；否则会提示视频过长，无法处理
                            if (t <= 10) {
                                t = s.slice(5, 7) * 1 + t * 60; // 获取总秒数
                            } else {
                                alert('This video is too long to handle.\nPlease choose a video shorter than 10 minutes.', 'Warning');
                                //break;
                            }

                            start_time = s.slice(0,-3); // 0:00:06
                            s = Math.floor(s.slice(-2) * FPS / 100) - 1;
                            if (t <= 20) {
                                if (s <= -1) {
                                    if (start_time.slice(-2) < 10) {
                                        s = start_time.slice(-1) - 1;
                                        start_time = start_time.slice(0, -1) + s;
                                    } else {
                                        s = start_time.slice(-2) - 1;
                                        start_time = start_time.slice(0, -2) + s;
                                    }
                                    s = Math.ceil(FPS) - 1;
                                    start_time = start_time + ':' + s;
                                } else {
                                    // 为了看起来好看，对个位数进行补零操作：01,02,03...
                                    if (s < 10) {
                                        start_time = start_time + ':0' + s; // 0:00:06:03
                                    } else {
                                        start_time = start_time + ':' + s; // 0:00:06:20
                                    }
                                }
                            } else {
                                t = Math.floor((t - 20) * 0.024) + 1; // 偏差值
                                s -= t;
                                if (s <= -1) {
                                    if (start_time.slice(-2) < 10) {
                                        s = start_time.slice(-1) - 1;
                                        start_time = start_time.slice(0, -1) + s;
                                    } else {
                                        s = start_time.slice(-2) - 1;
                                        start_time = start_time.slice(0, -2) + s;
                                    }
                                    s = Math.ceil(FPS) - 1;
                                    start_time = start_time + ':' + s;
                                } else {
                                    if (s < 10) {
                                        start_time = start_time + ':0' + s; // 0:00:06:03
                                    } else {
                                        start_time = start_time + ':' + s; // 0:00:06:20
                                    }
                                }
                            }

                            if (VERSION == 'DEVELOP' && CONSOLE_EDT != null) {
                                CONSOLE_EDT.text = CONSOLE_EDT.text + 'Start-time result: ' + s + ' fps\n';
                                //$.writeln('timeCodeConversionResult: ' + s);
                            }
                        } else {
                            alert('This video is too long to handle.\nPlease choose a video shorter than 1 hour.', 'Warning');
                            //break;
                        }
                    } else if (event == 'end') {
                        // 结束时间处理
                        s = subs[i].slice(23, 33);

                        t = s.slice(5, 7) * 1 + s.slice(2, 4) * 60; // 获取总秒数

                        end_time = s.slice(0,-3);
                        s = Math.floor(s.slice(-2) * FPS / 100) - 1;

                        if (t <= 20) {
                            if (s <= -1) {
                                if (end_time.slice(-2) < 10) {
                                    s = end_time.slice(-1) - 1;
                                    end_time = end_time.slice(0, -1) + s;
                                } else {
                                    s = end_time.slice(-2) - 1;
                                    end_time = end_time.slice(0, -2) + s;
                                }
                                s = Math.ceil(FPS) - 1;
                                end_time = end_time + ':' + s;
                            } else {
                                // 为了看起来好看，对个位数进行补零操作：01,02,03...
                                if (s < 10) {
                                    end_time = end_time + ':0' + s; // 0:00:06:03
                                } else {
                                    end_time = end_time + ':' + s; // 0:00:06:20
                                }
                            }
                        } else {
                            t = Math.floor((t - 20) * 0.024) + 1; // 偏差值
                            s -= t;
                            if (s <= -1) {
                                if (end_time.slice(-2) < 10) {
                                    s = end_time.slice(-1) - 1;
                                    end_time = end_time.slice(0, -1) + s;
                                } else {
                                    s = end_time.slice(-2) - 1;
                                    end_time = end_time.slice(0, -2) + s;
                                }
                                s = Math.ceil(FPS) - 1;
                                end_time = end_time + ':' + s;
                            } else {
                                if (s < 10) {
                                    end_time = end_time + ':0' + s; // 0:00:06:03
                                } else {
                                    end_time = end_time + ':' + s; // 0:00:06:20
                                }
                            }
                        }
                    } else {
                        alert('Unexpected error, time conversion failed!', 'Warning');
                    }
                }

                function createSubs() {
                    id += 1;

                    // 个位数需要进行补零操作：01, 02, 03...
                    if (id < 10) {
                        item = listbox.add('item','0' + id);
                    } else {
                        item = listbox.add('item', id);
                    }

                    // 将数据填入该行字幕中
                    item.subItems[0].text = start_time;
                    item.subItems[1].text = end_time;
                    item.subItems[2].text = content;
                }

                timeCodeConversion('start');
                timeCodeConversion('end');
                createSubs();

                // 当遍历到最后一条字幕时，进行收尾工作（激活界面、保存回执）
                if (i == subs.length - 1) {
                    // 记录此次操作的item和time，以供后续回调
                    last_item = item;
                    last_time = item.subItems[1].text;

                    // 强制激活“end”列，使时间码被立即显示
                    s = listbox.add('item', '');
                    listbox.remove(s);

                    // Scroll to the latest item (scroll to the bottom)  
                    listbox.revealItem(item);
                }
            }
        }
    

        function onColorClick() {
            // 输入颜色六位十六进制值
            last_value = color.text;
            color.text = '';

        }
    

        function onEdtClick() {
            // 检查颜色输入框的情况
            if (color.text == '') {
                color.text = last_value;
            }
    
        }
    }


    LK_SubtitleGenerator(this);
}
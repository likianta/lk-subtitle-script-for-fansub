{
    // LK Generate Subtitles.jsx
    //
    // 升级注意：查找该字符串：`LK Import Subtitles 1.0.jsxbin`并更新为最新版本
    // 发布注意：发布版请先搜索“Release version”，启用其内容并关闭相邻的“Dev version”

    function LK_GenerateSubtitles(thisObj)
    {
        var scriptName = "LK Generate Subtitles";
    
        function createUI(){
            // 使用P9 UI创建用户交互界面
            
            // 创建窗口和母版
            win = new Window("palette", scriptName, [100,100,600,575], {resizeable:true});
            panel = win.add("panel", [0,0,500,475]);

            // Create a list box with 4 columns
            listbox = panel.add("listbox", [5,25,490,375], '', {
                numberOfColumns: 4,
                showHeaders: true,
                columnTitles: ['id', 'start', 'end', 'content'],
                columnWidths: [45,95,95,235]});

            // 颜色编辑框
            color = panel.add("edittext", [402,5,490,23], "color", {readonly:0, noecho:0, borderless:0, multiline:0, enterKeySignalsOnChange:0});

            // 文本编辑框
            edt = panel.add("edittext", [5,380,490,430], "", {readonly:0, noecho:0, borderless:0, multiline:2, enterKeySignalsOnChange:0});
            //edt.graphics.foregroundColor = edt.graphics.newPen (edt.graphics.PenType.SOLID_COLOR, [0,0,0], 1);
            //edt.graphics.backgroundColor = edt.graphics.newBrush (edt.graphics.BrushType.SOLID_COLOR, [0.62,0.62,0.62]);

            // 底部的一排按钮控件
            btn_1 = panel.add("button", [10,440,98,465], "Start");
            btn_2 = panel.add("button", [108,440,196,465], "End");
            btn_3 = panel.add("button", [206,440,294,465], "Delete");
            btn_4 = panel.add("button", [304,440,392,465], "Generate");
            btn_5 = panel.add("button", [402,440,490,465], "Import Subs");

            // 窗口展示
            win.show();
        }
        createUI(); // 对以上函数予以执行

        // Initialize
        var content = '';
        var end_time = 0;
        var event = ''; // 用于作为事件触发的识别码
        var file = null;
        var id = 0;
        var item = null;
        var last_item = null;
        var last_time = '';
        var last_value = '';
        var s = ''; // 活跃的变量s，到处可以看到它的身影。用于传递任何不重要的中间过程值，但主要用于传递以及转换时间值
        var start_time = 0;
        var subs = new Array(); // `subs[]`主要在`ParseContent()`函数中被使用
        var txt_layer = null;
        var SCRIPT_FILE = '/LK Import Subtitles 1.0.jsxbin'; // 静态值
        var FPS = 0; // 静态值
        var INDEX = 0; // 静态值

        // 下面对静态值（全局不变量）进行预处理
        function presetStaticValues(){
            // INDEX & FPS
            s = app.project.numItems;
            for (i = s; i > 0; i--){
                if (app.project.item(i).hasVideo && app.project.item(i).typeName == '合成') {
                    INDEX = i;
                    FPS = app.project.item(INDEX).frameRate; // 获取当前视频的帧速率（是一个整数）
                    break;
                } else if (i == 1) {
                    alert("There is no video compItem found!", 'Warning');
                }
            }

            // SCRIPT_FILE
            file = new File($.fileName);
            // Release version:
            //SCRIPT_FILE = new File(file.path + SCRIPT_FILE);
            //if (!SCRIPT_FILE.exists) {
            //    SCRIPT_FILE = new File(file.path + '/LK字幕导入工具 v1.0.jsxbin');
            //    if (SCRIPT_FILE == null) {
            //        alert('Script file missed. Import function disabled.', 'Warning');
            //    }
            //}

            // Dev version:
            SCRIPT_FILE = new File(file.path + '/LK Import Subtitles.jsx');
        }
        presetStaticValues();
        
        // 设置按钮监听器
        btn_1.onClick = onBtn1Click; // 创建本条字幕开始时间
        btn_2.onClick = onBtn2Click; // 创建本条字幕结束时间
        btn_3.onClick = onBtn3Click; // 删除选定的字幕
        btn_4.onClick = onBtn4Click; // 开始生成字幕图层
        btn_5.onClick = onBtn5Click; // 导入字幕文件
        color.onClick = onColorClick; // 设置颜色值
        edt.onClick = onEdtClick; // 监听编辑框中的键盘事件
           
        // 以下为具体函数功能实现
    
        function onBtn1Click(event) {
            // 主要目标：创建本条字幕的开始时间

            if (event == 'clicking' || event == '') {
                // 检查文本内容，当存在时赋予本条字幕内容并增加编号；若不存在则弹出警告并中止后面的操作
                content = edt.text;
                if (content == "") {
                    alert("Please input some contents", "Warning");
                } else {
                    // 载入该条字幕的编号
                    id += 1;
    
                    // 个位数需要进行补零操作：01, 02, 03...
                    if (id < 10) {
                        item = listbox.add('item','0' + id);
                    } else {
                        item = listbox.add('item', id);
                    }
        
                    // 获取当前时间并赋值给`start`列
                    s = app.project.item(INDEX).time; // 获取该合成视频的当前时间（其格式为“30.1134467801134”）
                    s = timeToCurrentFormat(s, FPS); // 对时间进行转制并应用static帧速率（其结果为“00:00:30:02”）
                    item.subItems[0].text = s;
                    item.subItems[2].text = content;
    
                    // Scroll to the latest item (scroll to the bottom)  
                    listbox.revealItem(item);
                    //item.selected = true;
    
                    // 接下来判断上一条字幕的“结束时间”是否为空
                    if (id > 1 && last_time == '') {
                        last_item.subItems[1].text = s; // 若为空则将当前开始时间赋给上条字幕的结束时间
                    }              
    
                    // 记得文字上屏后要把编辑框内的文字清空
                    edt.text = "";
    
                    // 记录此次操作的item和time，以供后续回调
                    last_item = item;
                    last_time = item.subItems[1].text;
                }
            } else if (event == 'regex') {
                id += 1;

                // 个位数需要进行补零操作：01, 02, 03...
                if (id < 10) {
                    item = listbox.add('item','0' + id);
                } else {
                    item = listbox.add('item', id);
                }

                // Start time value
                item.subItems[0].text = s;
                item.subItems[2].text = content;
            }
        }
    
        function onBtn2Click(event) {
            // 主要目标：创建本条字幕的结束时间

            if (event == 'clicking' || event == '') {
                // 判断本条字幕的结束时间是否已存在，若存在则新建一条字幕；不存在（默认情况）则给当前字幕赋予结束值
                if (last_time == "") {
                    if (id > 0) {
                        s = app.project.item(INDEX).time;
                        s = timeToCurrentFormat(s, FPS);
                        item = listbox.items[id-1];
                        item.subItems[1].text = s;
                        last_time = item.subItems[1].text;
    
                        // 强制激活“end”列，使时间码被立即显示
                        s = listbox.add('item', '');
                        listbox.remove(s);
                    } else {
                        alert("Please define a start time first", "Warning");
                    }
                } else {
                    content = edt.text;
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
    
                        // Scroll to the latest item (scroll to the bottom)  
                        listbox.revealItem(item);
    
                        // 记得文字上屏后要把编辑框内的文字清空
                        edt.text = "";

                        // 记录此次操作的item和time，以供后续回调
                        last_item = item;
                        last_time = item.subItems[1].text;
                    }
                }
            } else if (event == 'regex') {
                item = listbox.items[id-1];
                item.subItems[1].text = s;
            }
        }
    
        function onBtn3Click(){
            // 删除被选中的字幕
            s = listbox.selection;
            var m = s.text; // 获取待删项的编号，注意一定要在删除之前获取，另外需要注意的是假如它是个位数，那么它的形式是“03”而不是“3”
            var n = id; // 获取删除前的id值（此值也就相当于删除前的字幕总数量）
            
            if (s != null) {
                listbox.remove(s);
            } else {
                alert('Please choose any listItem first', 'Prompt');
            }

            if (m == n) { // 如果`m = n`，则说明删除的是最后一项，所以只需要将id值-1即可
                id -= 1;
            } else {
                for (id = m * 1; m <= id < n; id++) { // 这里之所以定义`id=m*1`，是因为m的形式是“03”，因此我们要对它转成数字“3”
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
                for (i = 0; i < id; i++) {
                    // generate text layers in the video compItem
                    s = listbox.items[i];

                    start_time = s.subItems[0].text;
                    start_time = currentFormatToTime(start_time, FPS);
                    end_time = s.subItems[1].text;
                    end_time = currentFormatToTime(end_time, FPS);
                    content = s.subItems[2].text;

                    txt_layer = app.project.item(INDEX).layers.addText(content);
                    txt_layer.inPoint = start_time;
                    txt_layer.outPoint = end_time;
                }
            } else {
                alert("There are no subtitles in your list!", 'Warning');
            }
        }
    
        function onBtn5Click() {
            // 导入字幕文件（新建一个字幕导入面板）

            SCRIPT_FILE.open('r');
            content = eval(SCRIPT_FILE.read());
            SCRIPT_FILE.close();

            if (content != null) {
                // Obtained the subtitle file content
                // Parse it to be list items
                ParseContent();
            }
        }

        function onColorClick() {
            // Input color value
            last_value = color.text;
            color.text = '';

        }
    
        function onEdtClick() {
            // Catch color value
            if (color.text == '') {
                color.text = last_value;
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
            
            // Output test
            //file = new File($.fileName);
            //file = new File(file.path + "/resources/output.txt");
            //file.open('w');
            //s = 'Output Info:\n';
            //for (i = 0; i < subs.length; i++) { s += subs[i] + '\n'; } // `subs[i]`已含有换行符，这里又添加一个换行符，此时每段之间都有一个空行
            //file.write(s);
            //file.close();
            //$.writeln('Output done');

            // 对每一条数据进行解析，并生成可识别的字幕后上屏
            regex = RegExp('\\d:\\d\\d:\\d\\d\\.\\d*', 'g');
            regex_2 = RegExp('[^,]+$');
            for (i = 0; i < subs.length; i++) {
                // Content
                s = subs[i].slice(50, -1); // 先“大概”剪一下，取字符串的后半截，以适当减轻匹配压力
                s = regex_2.exec(s);
                content = s[0];

                // Start time match
                s = subs[i].slice(12, 22);
                onBtn1Click('regex');

                // End time match
                s = subs[i].slice(23, 33);
                onBtn2Click('regex');

                // The last time exec is a little different
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
    }
    
    LK_GenerateSubtitles(this);
}

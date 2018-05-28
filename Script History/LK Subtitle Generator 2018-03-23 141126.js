{
    // ================ About ================

    // LK Subtitle Generator.jsx
    // LK字幕生成工具

    /*
        How to Read My Code?
        ================

        1. Search "TODO" or "FIXME" to see what had not accompished yet.
        2. Search "TEST" to see which options were under developing mode.
        3. Change "version_env" value to swith between develop-environment and released-environment.
        4. I'd like to keep my code clean, modulary and no grammatical error.
    */

    function LK_SubtitleGenerator(thisObj)
    {
        // ================ Init Environment ================

        var scriptName = "LK Subtitle Generator"; // 脚本标题
        var version_env = 'DEVELOP'; // 切换到“开发者版本”
        //var version_env = 'RELEASE'; // 切换到“发布版本”

        // ================ Create UI ================

        // UI变量初始化
        var btn_1 = null; // 起始按钮
        var btn_2 = null; // 结束按钮
        var btn_3 = null; // 删除按钮
        var btn_4 = null; // 生成按钮
        var btn_5 = null; // 导入按钮
        var btn_aj = null; // 按键精灵按钮
        var color = null; // 颜色输入框
        var edt = null; // 文本输入框
        var listbox = null; // 列表控件
        var panel = null; // 主面板
        var slider = null;
        var slider_text = null;
        var win = null; // 父窗口

        // 下面编写函数功能
        createUI();
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

            // 横向滑动条
            // 第三个参数是共有多少个调节点（从零开始数的）
            // 第四、五个参数分别为最小值和最大值
            slider = panel.add('slider', [402,28,490,40], 8, -4, 4);
            slider.value = 0;
            slider_text = panel.add('statictext', [350,28,400,40], 'offset: 0');

            // 颜色编辑框，位于图中的右上角
            color = panel.add("edittext", [402,5,490,23], "color", {multiline:false, wantReturn:false});

            // 文本编辑框，位于图中的底部，用于输入当前字幕内容
            edt = panel.add("edittext", [5,380,490,430], "", {multiline:true, wantReturn:true});

            // 底部的一排按钮控件
            btn_aj = panel.add("button", [304,440,392,465], "Continue");
            btn_1 = panel.add("button", [10,440,98,465], "Start");
            btn_2 = panel.add("button", [108,440,196,465], "End");
            btn_3 = panel.add("button", [206,440,294,465], "Delete");
            btn_4 = panel.add("button", [304,440,392,465], "Generate");
            btn_5 = panel.add("button", [402,440,490,465], "Import");

            // 最后记得把窗口显示出来
            btn_aj.hide();
            win.show();
        }

        // ================ Initializations ================

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
        var user_slider = 0; // 接收用户调节值，在`ParseContent().TimecodeFromAegToAE().AccurateTime()`函数中被使用
        var CONSOLE_EDT = null; // 静态对象，用于在开发者模式下的信息输出框（EditText）
        var CONSOLE_WIN = null; // 静态对象，用于在开发者模式下的信息输出窗口
        var SCRIPT_FILE = '/LK Subtitle Scripts/LK Subtitle Import.jsxbin'; // 静态值，表示`Import`按钮关联的脚本文件
        //var SCRIPT_FILE = '/LK Subtitle Import.jsxbin';
        var FPS = 0; // 静态值，表示当前工程中的合成视频的帧速率
        var INDEX = 0; // 静态值，表示合成视频位于当前工程中的素材文件的位置
        // ↑ 相关学习：[AE脚本 app.project.item(index) 讲解](https://likianta.coding.me/2018/0130225017/)

        // 下面对静态值进行预处理
        presetStaticValues();
        function presetStaticValues() {
            // 一、INDEX & FPS
            // 首先获取当前工程面板中的素材总数量
            // 相关学习：[AE脚本 app.project.item(index) 讲解](https://likianta.coding.me/2018/0130225017/）
            s = app.project.numItems;
            // 然后遍历素材，找到“合成视频”这个素材，并读取它在素材中的绝对位置（INDEX）以及视频帧速率（FPS）
            for (i = s; i > 0; i--) { // 从倒数第一个向第一个素材遍历，目的是找到一个含有合成视频的素材（也就是我们当前工程中的“视频序列”）
                if (app.project.item(i).hasVideo && app.project.item(i).hasAudio && app.project.item(i).typeName == '合成') {
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
            // ↑ 比如`C:/Program Files/Adobe/Adobe After Effects CC 2017/Support Files/Scripts/ScriptUI Panels/LK Subtitle Scripts/LK Subtitle Generator.jsx`
            if (version_env == 'RELEASE') { // 发布版关联的子脚本的路径
                SCRIPT_FILE = new File(file.path + SCRIPT_FILE);
                // ↑ 其值为`C:/Program Files/Adobe/Adobe After Effects CC 2017/Support Files/Scripts/ScriptUI Panels/LK Subtitle Scripts/LK Subtitle Import.jsx`
                if (!SCRIPT_FILE.exists) {
                    // 如果上述文件不存在，则看看是不是用了中文文件名
                    SCRIPT_FILE = new File(file.path + '/LK Subtitle Scripts/LK字幕导入工具.jsxbin');
                    //SCRIPT_FILE = new File(file.path + '/LK字幕导入工具.jsxbin');
                    if (!SCRIPT_FILE.exists) {
                        // 如果中文文件名也不存在，则会提示找不到子脚本，并提示用户手动查找该脚本
                        alert('Script file missed. You can browse it manually.', 'Tip');

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
            } else if (version_env == 'DEVELOP') { // 开发版关联此脚本
                // 开发模式就比较简单了，直接查找我放好的文件路径即可
                SCRIPT_FILE = new File(file.path + '/LK Subtitle Import.jsx');
                // ↑ 获得`F:/Workspace/LikiantaProjects/LK AE Subtitle Scripts for Fansub/LK Subtitle Scripts/LK Subtitle Import.jsx`

                // 三、在开发者模式中新建一个窗口，作为调试输出窗口
                CONSOLE_WIN = new Window("palette", 'Console (Output Test)', [750,100,1150,575], {resizeable:false});
                CONSOLE_EDT = CONSOLE_WIN.add("edittext", [2,2,398,473], 'Print Log: \n', {multiline:true, wantReturn:true});
                // ↑ 第四个参数：`multiline`表示允许自动换行；`wantReturn`表示允许用户回车换行
                CONSOLE_WIN.show();
            }
        }

        // 从外部载入用户自定义值
        slider.onChange = function () {
            if (slider.value != 0) {
                user_slider = -2 * Math.round(slider.value);
                slider_text.text = 'offset: ' + Math.round(slider.value);

                // 将该值保存到`config.text`文件中。并在启动脚本时导入
                // ...
            }
        }

        // 设置按钮监听器
        addListeners();
        function addListeners() {
            btn_1.onClick = onBtn1Click; // 创建本条字幕开始时间
            btn_2.onClick = onBtn2Click; // 创建本条字幕结束时间
            btn_3.onClick = onBtn3Click; // 删除选定的字幕
            btn_4.onClick = onBtn4Click; // 开始生成AE文字图层
            btn_5.onClick = onBtn5Click; // 导入字幕文件（*.ass）
            color.onClick = onColorClick; // 设置颜色值
            edt.onClick = onEdtClick; // 监听编辑框中的键盘事件
        }

        // ================ Common Utils ================

        function lkLog(msg, cmd) {
            switch (cmd) {
                case 'w':
                    // Output to console
                    $.writeln(msg);
                    break;
                case 'p':
                    // Output to printLog window
                    CONSOLE_EDT.text += '\n' + msg;
                    break;
                case 'o':
                    // Output to output.txt
                    // TODO

                    break;
                case 'shut down lkLog':
                    // Do nothing
                    break;
                default:
                    break;
            }
        }

        function getFilePath(scriptName) {
            var file = new File($.fileName);
            var path = file.path;
            return new File(path + scriptName);
        }

        // ================ Great Functions ================

        // ---------------- 按钮1：创建开始时间 ----------------

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
    
        // ---------------- 按钮2：创建结束时间 ----------------

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
    
        // ---------------- 按钮3：删除选中字幕 ----------------

        function onBtn3Click() {
            // 删除被选中的字幕
            s = listbox.selection; // 获得当前被选中的字幕，如果没有选择任何字幕，则返回一个`null`
            var m = s.text; // 获取待删项的编号，注意一定要在删除之前获取，另外需要注意的是假如它是个位数，那么它的形式是“03”而不是“3”
            var n = id; // 获取删除前的id值（此值也就相当于删除前的字幕总条数）
            
            if (s != null) {
                listbox.remove(s);
            } else {
                alert('Please choose any listItem first', 'Tip');
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

        // ---------------- 按钮4：生成文本图层 ----------------

        var generate_counter = 0;
        var generate_mode = 'semi_automatic'; // TEST
        function onBtn4Click() {
            /*
                开始生成文本图层
            
                Ref:
                - After Effects CS6 Scripting Guide: 
                    - layer - p86
                    - text layer - p98,182,188
                    - time code - p14,94
                    - set text properties - p182
                - [使用正则表达式匹配Aegisub字幕（实战篇）](https://likianta.coding.me/2018/0116-201908/)
            */

            var master = app.project.item(INDEX);
            var text_layer = 'layer_a'; // 定义一个区间变量，用于记录文字图层对象
            // FIXME 使用 getSubtitleNumber() 函数来获取当前列表中的总编号数
            var counter_limit = id;
            //var counter_limit = getSubtitles().getNumber();

            if (generate_mode == 'full_automatic') {
                if (id > 0) {
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
                        text_layer = app.project.item(INDEX).layers.addText(content);
                        text_layer.inPoint = start_time;
                        text_layer.outPoint = end_time;

                        if (app.project.item(INDEX).layers.byName('temp_layer_1') != null) {
                            temp_layer_1.remove();
                            temp_layer_2.remove();
                        }
                    }
                } else {
                    alert("There are no subtitle in your list.", 'Warning');
                }
            } else { // 'semi_automatic'
                var layer_a = text_layer;
                var layer_b = 'layer_b';
                var layer_c = 'layer_c';

                if (generate_counter == 0) {
                    /**
                     * 工作步骤
                     * 1. 计数器为0时，先创建c，再创建b
                     * 2. 启动按键精灵
                     * 3. 精灵初始化保存
                     * 4. 精灵点击生成按钮
                     * 5. 精灵进入等待状态
                     */
                    layer_c = getTempLayers(layer_c, 'layer_c');
                    layer_b = getTempLayers(layer_b, 'layer_b');
                    lkLog('getTempLayers() - first created ok', 'p');
                    
                    // Launch LK AE Genius.exe
                    launchGenius();
                } else if (0 < generate_counter <= id) {
                    /*
                        工作步骤
                        1. 计数器大于0时：
                        2. 先置顶c，再置顶b，最后**创建**a（此时a被创建的同时就被置顶了）
                        3. 获取单行字幕文本（由计数器可以作为索引权据，当然别忘了判断一下是否超出编号范围）
                        4. 解析字幕文本（解析成上大字、下小字数字、下小字汉字三部分）
                        5. 先填充c，再填充b，最后填充a
                        6. 修改配置文件状态
                        7. 精灵开始工作
                    */

                    lkLog('onBtn4Click() - the current generate_counter = ' + generate_counter, 'p');

                    pinToTop('layer_c');
                    pinToTop('layer_b');
                    lkLog('pinToTop() - ok', 'p');
                    layer_a = createTextLayer();

                    // 获取字幕文本
                    var contents = getSubtitleContents(generate_counter);

                    // 解析并填充字幕文本
                    var receipt = parsingSubtitleContents(layer_a, layer_b, layer_c, contents);

                    // 修改配置文件状态
                    changeStatusIni(receipt);
                } else {
                    // All work done
                    alert('Congratulations! Generate done.', 'Tip');
                }

                generate_counter++;

                function getTempLayers(layerName, format) {
                    var layer = master.layers.byName(layerName);

                    if (layer == null) {
                        // Create layers
                        layer = master.layers.addText('');
                        layer.name = layerName;

                        // 字体格式处理
                        // 上大字：字体 =  方正兰亭中黑_GBK，字号 = 90，加粗
                        // 下小字数字：字体 = Arial，字号 = 72，不加粗
                        // 下小字汉字：字体 = 方正兰亭纤黑简体，字号 = 72，加粗
                        /*
                            Ref:
                            - AE Guide:
                                - text box: p182
                                - fill color: p184
                            - Object Model Viewer:
                                - String: search, slice
                            - Web:
                                - [正则表达式的常用元字符](https://likianta.coding.me/2018/0201-171502/)
                                - [JavaScript 正则表达式 | 菜鸟教程](http://www.runoob.com/js/js-regexp.html)
                                - [after effects - AE Extendscript text layer cursor control - Stack Overflow](http://t.cn/RETWqWh)
                        */
                        var s = layer.property("Source Text").value;
                        switch (format) {
                            case 'layer_a':
                                // 上大字
                                // 不在这里处理，详见另一个函数 createTextLayer
                                break;
                            case 'layer_b':
                                // 下小字数字
                                s.text = '123 ';
                                s.font = 'Arial';
                                s.fontSize = 72;
                                s.fillColor = [1, 1, 1];
                                s.applyStroke = false;
                                break;
                            case 'layer_c':
                                // 下小字汉字
                                s.text = '茶匙';
                                s.font = '方正兰亭纤黑简体';
                                s.fontSize = 72;
                                s.fillColor = [1, 1, 1];
                                s.applyStroke = true;
                                break;
                            default:
                                break;
                        }
                        layer.property("Source Text").setValue(s);
                    }

                    return layer;
                }

                function createTextLayer() {
                    var layer = master.layers.addText('');
                    // 字体格式处理
            		// 上大字：字体 =  方正兰亭中黑_GBK，字号 = 90，加粗
                    var s = layer.property("Source Text").value;
                    s.text = '';
                    s.font = '方正兰亭中黑_GBK';
                    s.fontSize = 90;
                    s.fillColor = [1, 1, 1];
                    s.applyStroke = true;
                    layer.property("Source Text").setValue(s);
                    return layer;
                }

                function pinToTop(layerName) {
                    // After Effects CS6 Scripting Guide:
                    // layer: p91
                    var layer = getTempLayers(layerName, 'hahaha gogogo');
                    layer.moveToBeginning();
                }

                function getSubtitleContents(index) {
                    var item = listbox.items[index - 1];
                    var contents = new Array();
                    contents[0] = s.subItems[0].text; // get start time
                    contents[1] = s.subItems[1].text; // get end time
                    contents[0] = currentFormatToTime(contents[0], FPS); // convert to '32.211511154' format
                    contents[1] = currentFormatToTime(contents[1], FPS);
                    contents[2] = s.subItems[2].text; // get subtitle content
                    return contents;
                }

                function parsingSubtitleContents(layer_a, layer_b, layer_c, contents) {
                    // After Effects CS6 Scripting Guide: p14,86,94,98,182,188
                    var c = contents[2];
                    var receipt = 0;

                    // Seperate c into 3 parts: text_a, text_b, text_c
                    // Sample 1: '奶油 1茶匙'
                    // Sample 2: '奶油 少许'
                    // Sample 3: '奶油'
                    // 看看是否存在空格，如果文字都是紧挨着的，那就不解析了（都当做上大字处理了）
                    var p = c.search(/\s/g);
                    if (p != -1) {
                        // Sample 1, 2
                        fillInTheLayers(layer_a, c.slice(0, p + 1), 'text_a'); // '奶油 '，注意末尾有一个空格
                        c = c.slice(p + 1); // '1茶匙' or '少许'
                        p = c.search(/\d/g);
                        if (p != -1) {
                            // Sample 1, '1茶匙'
                            fillInTheLayers(layer_b, c.slice(0, p+1), 'text_b'); // '1'
                            fillInTheLayers(layer_c, c.slice(p + 1), 'text_c'); // '茶匙'
                            // Done
                            receipt = 1;
                        } else {
                            // Sample 2, '少许'
                            fillInTheLayers(layer_c, c, 'text_c'); // '少许'
                            // Done
                            receipt = 3;
                        }
                    } else {
                        // Sample 3, no text_b and text_c
                        fillInTheLayers(layer_a, c, 'text_a');
                        // Done
                        receipt = 4;
                    }

                    function fillInTheLayers(layer, text, format) {
                        switch (format) {
                            case 'text_a':
                                // FIXME
                                // 这里可能会有错误，我不确定来自父函数的参数contents能不能传进去
                                $.writeln('fillInTheLayers() contents length = ' + contents.length);
                                layer.inPoint = contents[0];
                                layer.outPoint = contents[1];
                            default:
                                layer.property("Source Text").setValue(text); // FIXME
                                //layer.property("Source Text").setValue(new TextDocument(text));
                                break;
                        }
                    }

                    /*
                        回执：0, 1, 2, 3, 4
                        0: 初始检测
                        1: 有b，有c
                        2: 有b，无c（不存在此种情况）
                        3: 无b，有c
                        4: 无b，无c

                        为什么要发放回执？
                        1. 接下来我们要启动按键精灵，按键精灵将要阅读此回执
                        2. 比如如果回执是4，表示无需处理两个下小字，则按键精灵无需启动，直接将状态文件改成"exit"了（这样可以有效避免操作冲突）
                        3. 节省了操作时间
                        4. 可以有效避免操作冲突
                    */
                    return receipt;
                }

                function launchGenius() {
                    // Get LK AE Genius.exe
                    if (version_env == 'DEVELOP') {
                        var script = getFilePath('/LK AE Genius.exe');
                    } else {
                        var script = getFilePath('/LK Subtitle Scripts/LK AE Genius.exe');
                    }
                    
                    // Run
                    script.execute();
                }

                function changeStatusIni(receipt) {
                    // 初始化报告
                    /*
                        配置文件格式：
                        current_status.ini
                        ; This is comments.
                        ;
                        ;
                        [Status]
                        layer_a=true|false
                        layer_b=true|false
                        layer_c=true|false
                        status=stop|start|resume|pause|exit|error
                    */
                    var report = new Array();
                    /*
                    var comments = '; 此配置文件用于检定当前AE项目的文字生成状态'
                        + '\n; 它是LK脚本与按键精灵沟通的唯一途径：'
                        + '\n; 1. 【LK字幕生成工具】会定时写入当前AE工程状态'
                        + '\n; 2. 【LK按键精灵工具】会定时读取此文件以配合完成工作'
                        + '\n; 此文件如有遗损请将备份文件改名后放入正确路径：'
                        + '\n; ./LK Subtitle Scripts/resources/current_status.ini'
                        + '\n; '
                        + '\n; ';
                    */
                    report[0] = '[Status]';
                    report[1] = 'layer_a=true';
                    report[2] = 'layer_b=true';
                    report[3] = 'layer_c=true';
                    report[4] = 'status=stop';

                    // 阅读（分析）回执
                    switch (receipt) {
                        case 0:
                            // 所有工作已完成，正常退出运行
                            report[4] = 'status=exit';
                            break;
                        case 1:
                            // 正常流程
                            report[4] = 'status=resume';
                            break;
                        case 2:
                            // 有b无c
                            // PS：这种情况应该不会有
                            report[3] = 'layer_c=false';
                            report[4] = 'status=resume_b';
                            break;
                        case 3:
                            // 有c无b
                            report[2] = 'layer_b=false';
                            report[4] = 'status=resume_c';
                            break;
                        case 4:
                            // 无b无c
                            // PS：如果下小字都没有，只有上大字，其实也没按键精灵什么事了，所以状态改为pause
                            report[2] = 'layer_b=false';
                            report[3] = 'layer_c=false';
                            report[4] = 'status=pause';
                            break;
                        default:
                            // 发生未知错误，立刻退出
                            report[4] = 'status=error';
                            break;
                    }

                    // 生成（整理）报告
                    var final_report = report.join('\n');

                    // 将报告写入配置文件
                    if (version_env == 'DEVELOP') {
                        var file = getFilePath('/resources/current_status.ini');
                    } else {
                        var file = getFilePath('/LK Subtitle Scripts/resources/current_status.ini');
                    }
                    file.open('w');
                    file.write(final_report);
                    file.close();
                }

                // FIXME or DELETE
                function dyeingTexts() {
                    // Check strings (such as '*abc*')
                    // Ref: [使用正则表达式匹配Aegisub字幕（实战篇）](https://likianta.coding.me/2018/0116-201908/)
                    // Sample: '吃遍*天下*美食'
                    var regex_1 = RegExp('\\*[^*]*\\*', 'g'); // FIXME
                    if (regex_1.test(content)) {
                        // If test is 'true', do this
                        s = regex_1.exec(content); // *天下*
                        // TO BE CONTINUE
                    }
                }
            }
        }

        // ---------------- 按钮5：导入字幕文件 ----------------

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
                        alert('Script stopped because of countless matches.\nPlease check the type of source file which you selected.', 'Warning');
                        break;
                    } else {
                        // 匹配完成。正常退出
                        break;
                    }
                }
            } else {
                alert('There are no matches in the content.', 'Tip');
            }
            
            // Dev output test
            if (version_env == 'DEVELOP') {
                file = new File($.fileName);
                file = new File(file.path + "/resources/output.text");
                file.open('w');
                s = 'Output Info:\n';
                for (i = 0; i < subs.length; i++) { s += subs[i] + '\n'; } // `subs[i]`已含有换行符，这里又添加一个换行符，此时每段之间都有一个空行
                file.write(s);
                file.close();
                $.writeln('Output done.');
            }
            
            // 对每一条数据进行解析，并生成可识别的字幕后上屏
            regex = RegExp('\\d:\\d\\d:\\d\\d\\.\\d\\d', 'g'); // 获得当前时间（时分秒毫秒） // FIXME
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
                TimecodeFromAegToAE();
                function TimecodeFromAegToAE() {
                    // Example: source time code: 0:00:06.81
                    start_time = subs[i].slice(12, 22); // = 0:00:06.81
                    end_time = subs[i].slice(23, 33);

                    start_time = AccurateTime(start_time);
                    end_time = AccurateTime(end_time);

                    function AccurateTime(time) {
                        var timecode = time;
                        var t = 0;

                        // 还原真实时间
                        if (timecode != '0:00:00.000') {
                            t = timecode.slice(0, 1) * 3600 +  // = 0 hour
                                timecode.slice(2, 4) * 60 + // = 00 minute
                                timecode.slice(5, 7) * 1 + // = 06 seconds
                                timecode.slice(-2) / 100; // = 810ms/1000 = 0.81s
                            // = 6.81s

                            // 计算偏移
                            // 将真实时间往后推半帧的时间，然后减一帧的时间（相当于一共减了半帧的时间）
                            // 具体原因参考：[Aegisub时间码格式详解](https://likianta.coding.me/2018/0213-224002/)
                            t -= Math.round(500 / FPS) / 1000 * (user_slider + 1);
                            // ↑ [1. half-frame duration] Math.round((1000ms/24fps)/2)/1000 = 21ms/1000 = 0.021s
                            // ↑ [2. user_slider] value from user: -4 ~ +4 (default is 0)
                            // ↑ t = 6.831s
                        } else {
                            // The 0th frame is special
                            // it has no half-frame duration
                            t = 0.0;
                        }

                        timecode = timeToCurrentFormat(t, FPS);
                        return timecode;
                    }

                    // Create current subtitles
                    activateListbox();
                    function activateListbox() {
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
                }

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

        // ---------------- 文字颜色输入框 ----------------

        function onColorClick() {
            // 输入颜色六位十六进制值
            last_value = color.text;
            color.text = '';

        }

        // ---------------- 编辑框监听器 ----------------

        function onEdtClick() {
            // 检查颜色输入框的情况
            if (color.text == '') {
                color.text = last_value;
            }
        }
    }

    LK_SubtitleGenerator(this);
}
{
    // LK SubtitleScript for Fansub.jsx

    function LK_SubtitleScript(thisObj)
    {
        var scriptName = "LK SubtitleScript for Fansub";
    
        function createUI(){
            // 使用P9 UI创建用户交互界面
            
            // 创建窗口和母版
            win = new Window("palette",scriptName,[100,100,600,575],{resizeable:true,});
            panel = win.add("panel",[0,0,500,475]);

            // Create a list box with 4 columns
            listbox = panel.add("listbox", [5,25,490,375], '', {
                numberOfColumns: 4,
                showHeaders: true,
                columnTitles: ['id', 'start', 'end', 'content'],
                columnWidths: [45,100,100,235]});

            // 颜色编辑框
            color = panel.add("edittext",[402,5,490,23] ,"color",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});

            // 文本编辑框
            edt = panel.add("edittext",[5,380,490,430] ,"",{readonly:0,noecho:0,borderless:0,multiline:2,enterKeySignalsOnChange:0});
            edt.graphics.foregroundColor = edt.graphics.newPen (edt.graphics.PenType.SOLID_COLOR,[0,0,0], 1);
            edt.graphics.backgroundColor = edt.graphics.newBrush (edt.graphics.BrushType.SOLID_COLOR,[0.62,0.62,0.62]);

            // 底部的一排按钮控件
            btn_1 = panel.add("button",[10,440,98,465],"start");
            btn_2 = panel.add("button",[108,440,196,465],"end");
            btn_3 = panel.add("button",[206,440,294,465],"delete");
            btn_4 = panel.add("button",[304,440,392,465],"generate");
            btn_5 = panel.add("button",[402,440,490,465],"settings");

            // 窗口展示
            win.show();
        }
        createUI(); // 对以上函数予以执行

        // Initialize
        var content = '';
        var id = 0;
        var item = null;
        var last_item = null;
        var last_time = '';
        var last_value = '';
        var s = '';
        var FPS = 0;
        var INDEX = 0;

        // 下面对静态值（全局不变量）进行预处理
        s = app.project.numItems;
        for (i = s; i > 0; i--){
            if (app.project.item(i).hasVideo && app.project.item(i).typeName == '合成') {
                INDEX = i;
                FPS = app.project.item(INDEX).frameRate; // 获取当前视频的帧速率（是一个整数）
                break;
            } else if (i == 1) {
                alert("There is no video compItem found!", 'warning');
            }
        }

        // 设置按钮监听器
        btn_1.onClick = onBtn1Click; // 创建本条字幕开始时间
        btn_2.onClick = onBtn2Click; // 创建本条字幕结束时间
        btn_3.onClick = onBtn3Click; // 删除选定的字幕
        btn_4.onClick = onBtn4Click; // 开始生成字幕图层
        btn_5.onClick = onBtn5Click; // 设置选项
        color.onClick = onColorClick; // 设置颜色值
        edt.onClick = onEdtClick; // 监听编辑框中的键盘事件
           
        // 以下为具体函数功能实现
    
        function onBtn1Click() {
            // 主要目标：创建本条字幕的开始时间

            // 检查文本内容，当存在时赋予本条字幕内容并增加编号；若不存在则弹出警告并中止后面的操作
            content = edt.text;
            if (content == "") {
                alert("Please input some contents", "warning");
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
                //...

                // 接下来判断上一条字幕的“结束时间”是否为空
                if (id > 1 && last_time == '') {
                    last_item.subItems[1].text = s; // 若为空则将当前开始时间赋给上条字幕的结束时间
                }              

                // 记得文字上屏后要把编辑框内的文字清空
                //edt.text = "";

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
                    s = app.project.item(INDEX).time;
                    s = timeToCurrentFormat(s, FPS);
                    item = listbox.items[id-1];
                    item.subItems[1].text = s;
                } else {
                    alert("Please define a start time first", "warning");
                }
            } else {
                content = edt.text;
                if (content == '') {
                    alert("Please input some contents", "warning");
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
                    item.subItems[0].text = last_time;
                    item.subItems[1].text = s;
                    item.subItems[2].text = content;

                    // Scroll to the latest item (scroll to the bottom)  
                    //...

                    // 记得文字上屏后要把编辑框内的文字清空
                    //edt.text = "";

                    // 记录此次操作的item和time，以供后续回调
                    last_item = item;
                }
            }
            last_time = item.subItems[1].text;
        }
    
        function onBtn3Click(){
            // 删除被选中的字幕
    
    
    
        }
    
        function onBtn4Click() {
            // 开始生成文本图层
        
        
        
        }
    
        function onBtn5Click() {
            // 打开设置面板
        
        
        
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
    
        function setListElements(){
    
        }

    }
    
    LK_SubtitleScript(this);
}

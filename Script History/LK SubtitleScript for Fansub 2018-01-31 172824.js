{
    // LK SubtitleScript for Fansub.jsx

    function LK_SubtitleScript(thisObj)
    {
        var scriptName = "LK SubtitleScript for Fansub";
    
        function createUI(){
            // 使用P9 UI创建用户交互界面
            
            // 1. 创建窗口和母版
            win=new Window("palette",scriptName,[100,100,600,575],{resizeable:true,});
            panel_main=win.add("panel",[0,0,500,475]);

            // 2. 在母版上创建控件(静态文字)
            label_1=panel_main.add("statictext",[5,8,50,23] ,"id",{multiline:true});
            label_2=panel_main.add("statictext",[55,8,170,23] ,"start",{multiline:true});
            label_3=panel_main.add("statictext",[175,8,290,23] ,"end",{multiline:true});
            label_4=panel_main.add("statictext",[295,8,495,23] ,"content",{multiline:true});

            // 3. Create ListBox
            //listbox=panel_main.add("listbox",[5,25,490,375] ,[""]);
            listbox = panel_main.add("listbox", [5,25,490,375], '', {
                numberOfColumns: 4,
                showHeaders: true,
                columnTitles: ['id', 'start', 'end', 'content']});

            // 4. 颜色编辑框
            color=panel_main.add("edittext",[402,5,490,23] ,"color",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});

            // 5. 文本编辑框
            edt=panel_main.add("edittext",[5,380,490,430] ,"",{readonly:0,noecho:0,borderless:0,multiline:1,enterKeySignalsOnChange:0});
            edt.graphics.foregroundColor = edt.graphics.newPen (edt.graphics.PenType.SOLID_COLOR,[0,0,0], 1);
            edt.graphics.backgroundColor = edt.graphics.newBrush (edt.graphics.BrushType.SOLID_COLOR,[0.62,0.62,0.62]);

            // 6. 底部的一排按钮控件
            btn_1=panel_main.add("button",[10,440,98,465],"begin");
            btn_2=panel_main.add("button",[108,440,196,465],"end");
            btn_3=panel_main.add("button",[206,440,294,465],"delete");
            btn_4=panel_main.add("button",[304,440,392,465],"generate");
            btn_5=panel_main.add("button",[402,440,490,465],"settings");

            // 7. 窗口展示
            win.show();
        }

        createUI();

        // Initialize
        var id = 0;
        var last_value = '';
        var s = '';

        // 设置按钮监听器
        btn_1.onClick = onBtn1Click;
        btn_2.onClick = onBtn2Click;
        btn_3.onClick = onBtn3Click;
        btn_4.onClick = onBtn4Click;
        btn_5.onClick = onBtn5Click;
        color.onClick = onColorClick;
        edt.onClick = onEdtClick;
           
        // 以下为具体函数功能实现
    
        function onBtn1Click() {
            // 主要目标：创建本条字幕的开始时间
            
            // 检查文本内容，当存在时赋予本条字幕内容并增加编号
            s = edt.text;
            if (s == "") {
                alert("Please input some contents", "warning");
            } else {
                // 载入该条字幕的编号
                id += 1;
                // Single digits should be filled by left-zero: 01, 02, 03...
                if (id < 10) {
                    listbox.add('item','0' + id);
                } else {
                    listbox.add('item', id);
                    //listbox.Items.Add(id);
                }
    
                // Catch the current time to be the start time
                s = app.project.numItems;
                for (i = s; i > 0; i--){
                    if (app.project.item(i).hasVideo && app.project.item(i).typeName == '合成') {
                        s = app.project.item(i).time; // 获取该合成视频的当前时间（其格式为“30.1134467801134”）
                        i = app.project.item(i).frameRate; // 获取当前视频的帧速率
                        s = timeToCurrentFormat(s, i); // 对时间进行转制并应用该帧速率
                        break;
                    } else if (i == 1) {
                        alert("there is no video compItem found!", 'warning');
                    }
                }
                listbox.items[0].add("item", s);
                listbox.revealItem(items[-1]);
                
                // 记得文字上屏后要把编辑框内的文字清空
                //edt.text = "";
            }
        
        }
    
        function onBtn2Click() {
            // 创建本条字幕的结束时间
        
        
        
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

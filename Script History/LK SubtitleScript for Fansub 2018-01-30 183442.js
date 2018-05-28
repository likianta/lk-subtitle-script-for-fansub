// LK SubtitleScript for Fansub

function LK_SubtitleScript(thisObj)
{
    var scriptName = "LK SubtitleScript for Fansub";

    // 使用P9 UI创建用户交互界面

    // 1. 创建窗口和母版
    //win = new Window("palette", "LK SubtitleScript for Fansub", [100,100,600,575], {resizeable:true});
    //var main_panel = win.add("panel",[0,0,500,475]);
    var main_panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, [100,100,600,575], {resizeable:true});

    // 2. 在母版上创建控件(静态文字)
    main_panel.add("statictext",[5,8,50,23] ,"id",{multiline:true});
    main_panel.add("statictext",[55,8,170,23] ,"start",{multiline:true});
    main_panel.add("statictext",[175,8,290,23] ,"end",{multiline:true});
    main_panel.add("statictext",[295,8,495,23] ,"content",{multiline:true});

    // 3. 列表控件
    
    
    if (main_panel != null) {
        list_panel = main_panel.add("panel", [5, 25, 490, 375]);
        var res = 
            "group { \
                orientation:'column', alignment:['fill','fill'], alignChildren:['left','top'], spacing:10, margin:[0,0,0,0], \
                subtitleRow: Group { \
                    alignment:['fill','top'], \
                    id: StaticText  { text:'01', alignment:['left','center'], preferredSize:[45,15] }, \
                    start: StaticText  { text:'', alignment:['fill','center'], preferredSize:[115,15] }, \
                    end: StaticText  { text:'', alignment:['fill','center'], preferredSize:[115,15] }, \
                    content: EditText { text:'', alignment:['right','center'], preferredSize:[200,15] }, \
                }, \
            }";

        var test_res = 
	        "group { \
		        orientation:'column', alignment:['fill','fill'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], \
		        findRow: Group { \
			        alignment:['fill','top'], \
			        findStr: StaticText { text:'Find Text:', alignment:['left','center'] }, \
			        findEditText: EditText { text:'', characters:20, alignment:['fill','center'] }, \
		        }, \
		        replaceRow: Group { \
			        alignment:['fill','top'], \
			        replaceStr: StaticText { text:'Replacement Text:', alignment:['left','center'] }, \
			        replaceEditText: EditText { text:'', characters:20, alignment:['fill','center'] }, \
		        }, \
		        cmds: Group { \
			        alignment:['fill','top'], \
			        findButton: Button { text:'Find All', alignment:['fill','center'] }, \
			        replaceButton: Button { text:'Replace All', alignment:['fill','center'] }, \
			        helpButton: Button { text:'?', alignment:['right','center'], preferredSize:[25,20] }, \
		        }, \
	        }";

        list_panel.grp = list_panel.add(test_res);
    }

    //listbox = main_panel.add("listbox",[5,25,490,375] ,[""]);

    // 4. 颜色编辑框
    color = main_panel.add("edittext",[402,5,490,23] ,"color",{
        readonly: 0,
        noecho: 0,
        borderless: 0,
        multiline: 0,
        enterKeySignalsOnChange:0});

    // 5. 文本编辑框
    edt = main_panel.add("edittext",[5,380,490,430] ,"",{readonly:0,noecho:0,borderless:0,multiline:1,enterKeySignalsOnChange:0});
    edt.graphics.foregroundColor = edt.graphics.newPen (edt.graphics.PenType.SOLID_COLOR,[0,0,0], 1);
    edt.graphics.backgroundColor = edt.graphics.newBrush (edt.graphics.BrushType.SOLID_COLOR,[0.62,0.62,0.62]);

    // 6. 底部的一排按钮控件
    btn_1 = main_panel.add("button",[10,440,98,465],"begin");
    btn_2 = main_panel.add("button",[108,440,196,465],"end");
    btn_3 = main_panel.add("button",[206,440,294,465],"delete");
    btn_4 = main_panel.add("button",[304,440,392,465],"generate");
    btn_5 = main_panel.add("button",[402,440,490,465],"settings");

    // 7. 窗口展示
    //win.center();
    win.show();

    // 设置按钮监听器
    btn_1.onClick = onBtn1Click;
    btn_2.onClick = onBtn2Click;
    btn_3.onClick = onBtn3Click;
    btn_4.onClick = onBtn4Click;
    btn_5.onClick = onBtn5Click;
    color.onClick = onColorClick;
    edt.onClick = onEdtClick;

    // 初始化各项值
    var id = 0;

    // 以下为具体函数功能实现

    function onBtn1Click() {
        // 创建本条字幕的开始时间
        color.text = 'testing';
        // 检查文本内容，当存在时赋予本条字幕内容并增加编号
        var content = edt.text;
        if (content == "") {
            alert("please input content", "warning");
        } else { // 载入该条字幕的编号
            id += 1;
            if (id < 10) {
                listbox.add('item','0' + id);
            } else {
                listbox.add('item', id);
                //listbox.Items.Add(id);
            }
            listbox.SelectIndex = listbox.Items.Count - 1;
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
        var last_value = color.text;
        color.text = '';

    }

    function onEdtClick() {
        // Catch color value
        if (color.text == '') {
            color.text = 'color';
        }

    }
}

LK_SubtitleScript(this);





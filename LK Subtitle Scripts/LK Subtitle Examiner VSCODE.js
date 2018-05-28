{
	/*
		LK Subtitle Examiner.jsx

		This script helps you exam the project whether comforms to the standard.
		If not, it will give you some advice or auto-correct it.

		---

		# VERSION
		Please enable `var VERSION = 'RELEASE'` and disable `var VERSION = 'DEVELOP'` to ensure you'd released a for-user script.

		# Annotation
		'Guide Book' = 'After Effects CS6 Scripting Guide.pdf'
	*/

	function LK_SubtitleExaminer() 
	{
		var scriptName = "LK Subtitle Examiner"; // 脚本标题
		var VERSION = 'DEVELOP'; // 切换到“开发者版本”
		//var VERSION = 'RELEASE'; // 切换到“发布版本”


        // Create UI Panel
        var btn = null;
        var edt = null;
        var event = '';
        var win = null;
        createUI();
		function createUI() {
            win = new Window("palette", 'Print Log', [200,130,600,605], {resizeable:false});
            edt = win.add("edittext", [2,2,398,443], '', {multiline:true, wantReturn:true});
            btn = win.add("button", [160,450,240,470], 'Continue');

            win.show();
            btn.hide();
		}


        // Inits
        var clean_sub_video = null;
        var hard_sub_video = null;
        var layer = null;
        var message = new Array();
        var module = null;
        var render_item = null;
        var s = '';
        var CLEAN_CLIP = null;
        var INDEX = 0;

        initVariables();
        function initVariables() {
			// 1. Get the video composition item (CLEAN_CLIP)
			// Ref: 
			// 1. [AE脚本 app.project.item(INDEX) 讲解](https://likianta.coding.me/2018/0130225017/）
			// 2. After Effects CS6 Scripting Guide:
			//    - layer: p57,86
        	
            for (var i = app.project.numItems; i > 0; i--) {
                if (app.project.item(i).hasVideo && app.project.item(i).hasAudio && app.project.item(i).typeName == '合成') {
                	INDEX = i;
                    CLEAN_CLIP = app.project.item(INDEX);

                    s = CLEAN_CLIP.numLayers;
                    clean_sub_video = CLEAN_CLIP.layer(s);
                    hard_sub_video = CLEAN_CLIP.layer(s-1);

                    // Check whether they are video layer.
                    if (clean_sub_video.hasVideo && clean_sub_video.hasAudio) {
                    	if (hard_sub_video.hasVideo && hard_sub_video.hasAudio) {
                    		// Do nothing.
                    	} else {
                    		alert('There is no hard-sub video found.', 'Warning');
                    	}
                    } else {
                    	alert('There is no clean-sub video found.', 'Warning');
                    }

                    break;
                } else if (i == 1) { // 如果完全遍历后仍找不到，那么会弹出警告提示框
                    alert("There is no video composition item found!", 'Warning');
                }
            }

			// 2. InitMessages
			message[0] = '一、检查视频\n';
			message[1] = '1. 比较clean与硬字幕视频的时长是否相等：';
			message[2] = '2. 关闭硬字幕视频的视频及音频：';
			message[3] = '\n二、检查文字\n';
			message[4] = '1. 检查普通字幕字体格式是否正确：';
			message[5] = '2. 检查文字中是否有未消除的换行符`\\N`：';
			message[6] = '3. 检查出字二图层相邻图层是否可疑：';
			message[7] = '4. 检查常见错别字、文字修正表：';
			message[8] = '\n三、检查报告\n';
			message[9] = '\n四、添加到渲染队列\n'
			message[10] = '1. 输出模型：';
			message[11] = '\n请手动点击“渲染”按钮开始渲染'
        }


        // STAGE 1
        // Compare the duration between clean-sub video and hard-sub video.
        compareDuration();
        function compareDuration() {
        	// Ref: Guide Book: duration: p31

        	var count = 0;
        	var p = new Array();

        	for (var i = app.project.numItems; i > 0 && count != 2; i--) {
        		if (app.project.item(i).hasVideo && app.project.item(i).hasAudio) {
        			p[count] = app.project.item(i);
        			count += 1;
        		}
        	}

        	switch (count) {
        		case 1:
        			alert('There is only one video item in your project.\nCannot compare.', 'Warning');
        			message[1] += 'error\n';
        			break;
        		case 2:
        			// Compare.
        			if (p[0].duration == p[1].duration) {
        				message[1] += 'true\n';
        			} else {
        				message[1] += 'false\n'
        			}
        			break;
        		default:
        			alert('There are 3 or more videos in your project.\nComparison failed.', 'Warning');
        			message[1] += 'error\n';
        	}
        }

        closeHardSubVideo();
        function closeHardSubVideo() {
        	// Close its eye and muffle the sound.
        	// Ref: Guide Book:
        	// - av layer: p39
        	// - av layer sound: p41

        	hard_sub_video.enabled = false;
        	hard_sub_video.audioEnabled = false;

        	message[2] += 'done\n';
        }


        // STAGE 2


        

        // STAGE 3



        // STAGE 4
        // Add to the render queue.
        addToTheRenderQueue();
        function addToTheRenderQueue(){
        	// Ref: Guide Book:
        	// - add to the render: p169
        	// - render queue: p161,163,164,166
        	// - output module: p110,112
        	
        	// Clear out the existed queue.
        	for (var i = 0; i < app.project.renderQueue.numItems; i++) {
				app.project.renderQueue.item(i+1).remove();
        	}
        	// Create render queue item and get its module object.
        	render_item = app.project.renderQueue.items.add(CLEAN_CLIP);
        	module = render_item.outputModule(1);

        	// Apply a template into the object.
        	if (VERSION == 'DEVELOP') {
        		startRender();
        	} else {
        		// Find inner template name.
        		// Ref: 
        		// - [js数组与字符串的相互转换 - LeoBoy - 博客园](https://www.cnblogs.com/LeoBoy/p/5899734.html)
        		// - [AE脚本使用正则表达式string.search(regex)](https://likianta.coding.me/2018/0205-162035/)
        		s = module.templates.join('');
        		if (s.search('Tastemade AE Output Module') == -1) {
        			s = '如果这是你第一次使用脚本渲染工具，请在渲染队列中手动点击“输出模块”：\n' + 
        				'1. 选择格式 - “QuickTime”\n' + 
        				'2. 视频编解码器 - “H.264”\n' + 
        				'3. 音频编解码器 - “AAC”\n' + 
        				'确保以上三步完成后，点击“继续(Continue)”按钮\n' +
        				'在以后的 Tastemade AE 项目中，脚本将自动应用该模板\n\n' + 
        				'如果你在设置过程中有任何问题，或者想要删除、变更模板，请与我联系：\n' + 
        				'sheerish@qq.com\n\n' + 
        				'或者你想要放弃继续操作，关闭当前脚本窗口即可';
        			alert(s);

        			btn.show();
        		} else {
        			startRender();
        		}
        	}
        }

        btn.onClick = onBtnClick;
        function onBtnClick() {
        	// Guide Book: p112
        	module.saveAsTemplate('Tastemade AE Output Module');
        	startRender();

        	//alert('执行完毕');
        }


        // STAGE 5

        function startRender() {
        	// Guide Book:
        	// - render: p161,166
        	message[10] += 'Tastemade AE Output Module\n';
        	outputMessages();

        	module.applyTemplate('Tastemade AE Output Module');
        	render_item.render = true;

        	// 注意：经过测试，发现使用`render()`方法渲染，会导致AE程序陷入“假死”的状态
        	// 因此请手动点击渲染按钮
        	//app.project.renderQueue.render();
        }
        
        function outputMessages() {
        	// **Verion 1.0**
	        for (var i = 4; i <= 7; i++) {
	        	message[i] += '该版本无此功能\n';
	        }

	        edt.text = '';
	        // Output messages.
	        for (var i = 0; i < message.length; i++) {
	        	//$.write(message[i]);
	        	edt.text += message[i];
	        }
        }
	}

	LK_SubtitleExaminer();
}
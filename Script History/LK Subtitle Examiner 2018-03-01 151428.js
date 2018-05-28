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
        var edt = null;
        var win = null;
        createUI();
		function createUI() {
            win = new Window("palette", 'Print Log', [750,100,1150,575], {resizeable:false});
            edt = win.add("edittext", [2,2,398,473], '', {multiline:true, wantReturn:true});
            win.show();
		}        


        // Inits
        var clean_sub_video = null;
        var content = '';
        var hard_sub_video = null;
        var layer = null;
        var message = new Array();
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
			message[3] = '二、检查文字\n';
			message[4] = '1. 检查普通字幕字体格式是否正确：';
			message[5] = '2. 检查文字中是否有未消除的换行符`\\N`：';
			message[6] = '3. 检查出字二图层相邻图层是否可疑：';
			message[7] = '4. 检查常见错别字、文字修正表：';
			message[8] = '三、检查报告\n';
			message[9] = '四、添加到渲染队列\n';
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
        	// - clear output: p14
        	// - add to the render: p169
        	// - render queue: p163,164
        	
        	clearOutput();
        	var render_item = app.project.renderQueue.items.add(CLEAN_CLIP);

        	alert(render_item.numOutputModules());
        	
        	

            





        }
        



        // STAGE 5

        // **Verion 1.0**
        for (var i = 3; i <= 7; i++) {
        	message[i] += '\n';
        }

        outputMessages();
        function outputMessages() {
        	for (var i = 0; i < message.length; i++) {
        		$.write(message[i]);
        	}
        }
	}

	LK_SubtitleExaminer();
}
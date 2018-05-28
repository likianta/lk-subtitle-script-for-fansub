{
	// LK Subtitle Regex.jsx
	//
	// 该脚本用于集中处理正则匹配

	function LK_SubtitleRegex() 
	{
		var scriptName = 'LK Subtitle Regex';
        var VERSION = 'DEVELOP';
        //var VERSION = 'RELEASE';

        // 初始化值
        var content = '';
        var end_time = '';
        var s = '';
        var start_time = '';
        var subs = new Array();

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
                // AE无法识别ASS的时间码，会解析成混乱的时间值。因此要进行一次换算：
                function timeCodeConversion(event) {
                    if (event == 'start') {
                        // Start time match
                        s = subs[i].slice(12, 22); // 0:00:06.81
                        start_time = s.slice(0,-3); // 0:00:06
                        s = s.slice(-2) * FPS / 100; // 81 x 24 / 100 = 19.44...
                        s = parseInt(s) - 1; // 19.44... -> 18（四舍五入后再减1,因为实际测试发现需要再减一帧才能完美对准）

                        // 为了看起来好看，对个位数进行补零操作：01,02,03...
                        if (s < 10) {
                            start_time = start_time + ':0' + s; // 0:00:06:03
                        } else {
                            start_time = start_time + ':' + s; // 0:00:06:20
                        }

                        onBtn1Click('regex');
                    } else if (event == 'end') {
                        // End time match
                        s = subs[i].slice(23, 33);
                        end_time = s.slice(0,-3);
                        s = s.slice(-2) * FPS / 100;
                        s = parseInt(s) - 1;

                        if (s < 10) {
                            end_time = end_time + ':0' + s; // 0:00:06:03
                        } else {
                            end_time = end_time + ':' + s; // 0:00:06:20
                        }
                        
                        onBtn2Click('regex');
                    } else {
                        alert('Unexpected error, time conversion failed!', 'Warning');
                    }
                }
                timeCodeConversion('start');
                timeCodeConversion('end');

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
        ParseContent();
	}


	LK_SubtitleRegex();
}
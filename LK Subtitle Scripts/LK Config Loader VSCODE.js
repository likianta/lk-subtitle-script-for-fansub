{
    // LK Config Loader.jsx
    // LK配置加载工具
    
    /*
        How to Read My Code?
        ================

        1. Search "TODO" or "FIXME" to see what had not accompished yet.
        2. Search "TEST" to see which options were under developing mode.
        3. Change "version_env" value to swith between develop-environment and released-environment.
        4. I'd like to keep my code clean, modulary and no grammatical error.
    */

    function LK_ConfigLoader(command)
    {
        // ========== Inits ==========

        // 推荐在变量声明时就赋上值
        var mission = command; // 从外部接收的“命令”，化为我们的“使命”
        var file = new File($.fileName);
        var scriptName = 'LK Config Loader';
        //var version_env = 'DEVELOP'; // TEST
        var version_env = 'RELEASE';
        
        file = getConfigFile(file.path);
        if (!file.exists) {
            stopScript();
            return false;
        }

        function getConfigFile(path) {
            if (version_env == 'DEVELOP') {
                return new File(path + '/resources/config.ini');
            } else {
                return new File(path + '/LK Subtitle Scripts/resources/config.ini');
                //var config = null;
                //config = new File(path + '/LK Subtitle Scripts/resources/config.ini');
                //if (config.exists) {
                //    return config;
                //} else {
                //    alert('Configuration file not found. Please check if target file exists:\n' + 
                //        './LK Subtitle Scripts/resources/config.ini');
                //    stopScript();
                //    return null;
                //}
            }
            
        }

        function stopScript() {
            // TODO
            // Totally stop LK scripts and shut down all processes
            alert('Configuration file not found. Please check if target file exists:\n' +
                './LK Subtitle Scripts/resources/config.ini');
        }

        // ========== Read All Info ==========
        
        var str = getConfigInfo(file);

        function getConfigInfo(file) {
            // Ref: Object Module Viewer:
            // - file: open, read, write
            var str = '';
            
            file.open('r');
            str = file.read();
            file.close();

            return str;
        }

        // ========== Parsing Info ==========

        var sections = parsingInfo(str, 'sections');

        function parsingInfo(str, command) {
            var comments = new Array();
            var counter = 0;
            var s = '';
            var sections = new Array();
            var strs = new Array();

            // Seperate str into strs[]

            // Regex tools:
            // 1. Ignore empty lines and ';' lines.
            // 2. Find [section] names into keys
            // 3. Find [key=value] into values[]
            // 注意：除了`\n`以外的特殊字符，都要双写反斜杠
            // （不知道是bug还是什么……在官方说明里是说单斜杠就可以的）
            var regex_1 = RegExp('.+', 'g'); // 排除空行
            var regex_2 = RegExp('^;.*', 'g'); // 匹配注释行
            var regex_3 = RegExp('^\\[End\\]', 'g'); // 匹配 [End]

            // 首先获取“纯净的”一维数组
            // Sample: 
            /* config.ini
                ; This is comments.
                ;
                ;

                [Section_A]
                key_a1=value_a1
                key_a2=value_a2

                [Section_B]
                key_b1=value_b1

                [End]

            */
            for (var i = 0, j = 0; ; counter++) {
                // 该循环使用两种退出机制：
                // 1. 当找到节点名为“[End]”的字符时，正常退出循环
                // 2. 当自动计数器数值过高时，异常退出循环
                s = regex_1.exec(str);
                if (regex_2.test(s)) {
                    // '; This is comments.'
                    comments[j] = s;
                    j++;
                } else if (regex_3.test(s)) {
                    break;
                } else {
                    strs[i] = s;
                    i++;
                }
                if (counter > 200) {
                    alert('Script stopped because of countless matches.');
                    break;
                }
            }

            // 然后将此一维数组变为二维数组（参数1 是节点名， 参数2 是节点下的键值对）
            // 可以在 for 循环中的 语句1 中声明一连串的初始化变量
            // Ref: [JavaScript For 循环](http://www.w3school.com.cn/js/js_loop_for.asp)
            var regex_4 = RegExp('^\\[.+\\]', 'g');
            for (var i = 0, j = -1, k = 0; i < strs.length; i++) {
                if (regex_4.test(strs[i])) {
                    // 如果是新的节点名，则执行以下语句
                    j++; // j = 0, 1, 2, 3...
                    k = 0;
                    sections[j] = new Array();
                } else {
                    // 如果不是新的节点名，则执行以下语句
                    k++; // k = 0, 1, 2, 3...
                }
                sections[j][k] = strs[i];
            }

            // 整体文本解析就到这里，后面会详细处理 sections 数组
            if (command == 'sections') {
                return sections;
            } else {
                return comments;
            }
        }

        // ========== Generate Executable Data ==========

        var executableConfig = returnConfig(sections, mission);

        function returnConfig(sections, mission) {
            var config = new Array();
            var index = 0;
            var s = '';

            for (var i = 0; i < sections.length; i++) {
                s = sections[i][0];
                s = s[0]; // 特别注意，这一步是必须的！不然会报错
                
                if (i == 0 || s.search(mission) != -1) {
                    enumrateArray(sections[i]);
                }
            }

            function enumrateArray(mArray) {
                for (var i = 1; i < mArray.length; i++) {
                    config[index] = mArray[i];
                    index++;
                }
            }

            return config;
        }

        // ========== Submit to Commander ==========

        if (version_env == 'DEVELOP') {
            var file = new File($.fileName);
            file = new File(file.path + '/resources/output.txt');
            file.open('w');
            file.write(executableConfig.join('\n'));
            file.close();
        }

        return executableConfig;
    }

    //LK_ConfigLoader('Import'); // TEST
    LK_ConfigLoader(command);
}
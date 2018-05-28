{
    // LK SubtitleScript Toolbar.jsx
    // LK字幕脚本工具

    /*
        How to Read My Code?
        ================

        1. Search "TODO" and "FIXME" to see what had not accompished yet.
        2. Search "TEST" to see which options were under developing mode.
        3. Change "version_env" value to swith between develop-environment and released-environment.
        4. I'd like to keep my code clean, modulary and no grammatical error.
    */

    function LK_SubtitleScriptToolbar(thisObj)
    {
        var scriptName = 'LK SubtitleScript for Fansub';
        //var version_env = 'DEVELOP'; // TEST
        var version_env = 'RELEASE';

        
        // Initialize
        var btn_1 = null;
        var btn_2 = null;
        var btn_3 = null;
        var event = '';
        var file = new File($.fileName);
        var panel = null;
        var s = thisObj;
        var win = null;
        var SCRIPT_Examiner = '/LK Subtitle Scripts/LK Subtitle Examiner.jsxbin';
        var SCRIPT_Generator = '/LK Subtitle Scripts/LK Subtitle Generator.jsxbin';
        var SCRIPT_Help = '/LK Subtitle Scripts/LK Help.jsxbin';

        checkFiles();
        function checkFiles() {
            if (version_env == 'RELEASE') {
                SCRIPT_Examiner = new File(file.path + SCRIPT_Examiner);
                SCRIPT_Generator = new File(file.path + SCRIPT_Generator);
                SCRIPT_Help = new File(file.path + SCRIPT_Help);

                checkInits('Check Examiner');
                checkInits('Check Generator');
                checkInits('Check Help');
            } else if (version_env == 'DEVELOP') {
                SCRIPT_Examiner = new File(file.path + '/LK Subtitle Scripts/LK Subtitle Examiner.jsx');
                SCRIPT_Generator = new File(file.path + '/LK Subtitle Scripts/LK Subtitle Generator.jsx');
                SCRIPT_Help = new File(file.path + '/LK Subtitle Scripts/LK Help.jsx');
            }
    
            function checkInits(event) {
                switch (event) {
                    case 'Check Examiner':
                        if (!SCRIPT_Examiner.exists) {
                            SCRIPT_Examiner = new File(file.path + '/LK Subtitle Scripts/LK后期检查工具.jsxbin');
                            if (!SCRIPT_Examiner.exists) {
                                alert("Cannot find 'Examiner' script.", "Warning");
                            }
                        }
                        break;
                    case 'Check Generator':
                        if (!SCRIPT_Generator.exists) {
                            SCRIPT_Generator = new File(file.path + '/LK Subtitle Scripts/LK字幕生成工具.jsxbin');
                            if (!SCRIPT_Generator.exists) {
                                alert('Script file missed. You can browse it manually.', 'Prompt');
            
                                SCRIPT_Generator = File.openDialog ("Look for 'LK Subtitle Generator.jsxbin'",
                                    ["Adobe Script File Binary:*.jsxbin", "Adobe Script File:*.jsx", "All Files:*.*"],
                                    false);
            
                                if (SCRIPT_Generator == null) {
                                    alert('Script file missed. LK can not work.', 'Warning');
                                }
                            }
                        }
                        break;
                    case 'Check Help':
                        if (!SCRIPT_Help.exists) {
                            SCRIPT_Help = new File(file.path + '/LK Subtitle Scripts/LK帮助.jsxbin');
                            if (!SCRIPT_Help.exists) {
                                alert("Cannot find 'Help' script.", "Prompt");
                            }
                        }
                        break;
                }
            }
        }        
        

        createUI();
        function createUI() {
            // Dimen values
            var margin = 5;
            var offset_x = 5;
            var offset_y = 1;
            var width = 80;
            var height = 20;

            // Dockable panel or palette
            // 如果要增加新的按钮，别忘了扩大窗口的面积
            win = (s instanceof Panel) ? s : new Window("palette", scriptName, [100,100,370,200], {resizeable:true});
            panel = win.add("panel", [0,0,270,24]);

            // Add buttons
            btn_1 = panel.add('button', [offset_x, offset_y, offset_x + width, offset_y + height], 'Generator');
            btn_1.helpTip = "LK Subtitle Generator";

            offset_x = margin * 3 + width;
            btn_2 = panel.add('button', [offset_x, offset_y, offset_x + width, offset_y + height], 'Examiner');
            btn_2.helpTip = "LK Subtitle Examiner";

            offset_x = margin * 5 + width * 2;
            btn_3 = panel.add('button', [offset_x, offset_y, offset_x + width, offset_y + height], 'Help');
            //btn_3.helpTip="Help";

            if (s instanceof Panel) {
                // It's a dock
            } else {
                win.show();
            }
        }


        // Add listeners
        btn_1.onClick = onBtn1Click;
        btn_2.onClick = onBtn2Click;
        btn_3.onClick = onBtn3Click;


        function onBtn1Click() {
            // Run Generator
            SCRIPT_Generator.open();
            eval(SCRIPT_Generator.read());
            SCRIPT_Generator.close();
        }

        function onBtn2Click() {
            // Run Examiner
            SCRIPT_Examiner.open();
            eval(SCRIPT_Examiner.read());
            SCRIPT_Examiner.close();
        }

        function onBtn3Click() {
            // LK Help
            SCRIPT_Help.open();
            eval(SCRIPT_Help.read());
            SCRIPT_Help.close();
        }
    }


    LK_SubtitleScriptToolbar(this);
}

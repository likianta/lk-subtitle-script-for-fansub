{
    // LK SubtitleScript Toolbar.jsx
    //
    // LK SubtitleScript for Fansub.

    function LK_SubtitleScriptToolbar(thisObj)
    {
        var scriptName = 'LK SubtitleScript for Fansub';
        var VERSION = 'DEVELOP';
        //var VERSION = 'RELEASE';

        
        // Initialize
        var btn_1 = null;
        var btn_2 = null;
        var event = '';
        var file = new File($.fileName);
        var panel = null;
        var s = thisObj;
        var win = null;
        var SCRIPT_About = '/LK_SubtitleScripts/LK About.jsxbin';
        var SCRIPT_Generator = '/LK_SubtitleScripts/LK Subtitle Generator.jsxbin';

        if (VERSION == 'RELEASE') {
            //SCRIPT_About = new File(file.path + SCRIPT_About);
            //checkInits('Check About');
            SCRIPT_Generator = new File(file.path + SCRIPT_Generator);
            checkInits('Check Generator');
        } else if (VERSION == 'DEVELOP') {
            //SCRIPT_About = new File(file.path + '/LK_SubtitleScripts/LK About.jsx');
            SCRIPT_Generator = new File(file.path + '/LK_SubtitleScripts/LK Subtitle Generator.jsx');
        }

        function checkInits(event) {
            if (event == 'Check Generator') {
                if (!SCRIPT_Generator.exists) {
                    SCRIPT_Generator = new File(file.path + '/LK_SubtitleScripts/LK字幕生成工具.jsxbin');
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
            }
            if (!event.exists) {
                event = new File(file.path + '/LK_SubtitleScripts/LK字幕生成工具.jsxbin');
            }
        }
        

        function createUI() {
            // Dimen values
            var offset_x = 5;
            var offset_y = 2;
            var width = 180;
            var height = 25;

            // Dockable panel or palette
            win = (s instanceof Panel) ? s : new Window("palette", scriptName, [100,100,480,145], {resizeable:true});
            panel = win.add("panel", [0,0,380,29]);

            // Add buttons
            btn_1 = panel.add('button', [offset_x, offset_y, offset_x + width, offset_y + height], 'Generator');
            btn_1.helpTip = "LK SubtitleScript Generator";
            offset_x = offset_x * 3 + width;
            btn_2 = panel.add('button', [offset_x, offset_y, offset_x + width, offset_y + height], 'About');
            //btn_2.helpTip="About";

            if (s instanceof Panel) {
                // It's a dock
            } else {
                win.show();
            }
        }
        createUI();


        // Add listeners
        btn_1.onClick = onBtn1Click;
        //btn_2.onClick = onBtn2Click;


        function onBtn1Click() {
            // Run Generator
            SCRIPT_Generator.open();
            eval(SCRIPT_Generator.read());
            SCRIPT_Generator.close();
        }


        function onBtn2Click() {
            // About LK SubtitleScript

        }
    }


    LK_SubtitleScriptToolbar(this);
}

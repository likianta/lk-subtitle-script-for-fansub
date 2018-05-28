{
    // LK Subtitle Import.jsx   LK字幕导入工具.jsx
    //
    // 该脚本用于导入ass/txt字幕文件到AE工程中

    function LK_SubtitleImport()
    {
    	var scriptName = "LK Subtitle Import";

    	// 初始化值
    	var content = '';
    	var file = null;

        // 创建文件对话窗口
        // 第一个参数是窗口标题名
        // 第二个参数是支持的文件类型（可自定义，如需多个则用中括号包裹，每个用逗号隔开）
        // 第三个参数是单选还是多选，填`true`是多选；填`false`或留空是单选
    	file = File.openDialog ("Select an ass/txt file", ["Aegisub Advanced SSA:*.ass", "Text:*.txt"], false);
        
		if (file != null) {
			file.open('r');
			content = file.read();
            file.close();

            return content;	
		} else {
			//alert('No file selected.', 'Prompt');

            return null;
		}   
    }

    LK_SubtitleImport(); // 执行该脚本
}
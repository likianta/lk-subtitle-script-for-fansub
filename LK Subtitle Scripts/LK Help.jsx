{
	// LK Help.jsx
	//
	// Learn how to use LK SubtitleScripts.

	function LK_Help()
	{
		var scriptName = 'LK Help';		
		var win = null;

		createUI();
		function createUI() {
			win = new Window('palette', scriptName, [100,100,500,600],{resizeable:false});
			var txt = win.add('statictext', [10,10,380,560], '', {multiline:true});
			txt.text = "LK Subtitle Script is made for Fansub working with Adobe After Effects (CC series).\n\n" + 
				"[How to use LK Subtitle Scripts]\n\n" + 
				"1. Click 'Generator' button to launch Generator;\n" + 
				"2. You can edit subtitles in the Generator, each subtitle contains 'id', 'start_time', 'end_time' and 'content';\n" + 
				"3. If you finish editing, then click 'Generate' button to create text layers in your current video compItem;\n" + 
				"4. Otherwise you can click 'Import' button to import a '*.ass' (Aegisub file) into your AE project;\n\n" + 
				"[Question]    The subtitles imported from an ass file are not correctly generated. How to adjust its in && out point?\n" + 
				"-- You can adjust subtitles by 'offset' slider before you import it.\n\n" + 
				"[Contact me]\n\n" + 
				"Email 1: sheerish@qq.com\n" + 
				"Email 2: likianta1016@gmail.com\n";
				
			win.center();
			win.show();
		}
	}


	LK_Help();
}
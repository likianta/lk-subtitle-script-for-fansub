{
    // LK Import Subtitle Files.jsx

    function LK_ImportSubtitleFiles()
    {
    	var scriptName = "LK Import Subtitle Files";

    	// Initialize
    	var content = '';
    	var file = null;
    	var msg = '';

    	file = File.openDialog ("Select an ass/txt file",  ["Aegisub Advanced SSA:*.ass", "Text:*.txt"], false);
        
		if (file != null) {
			file.open('r');
			content = file.read(15);
            alert(content);
			
		} else {
			alert("file not found");
		}

		
        
    }


    LK_ImportSubtitleFiles();
}
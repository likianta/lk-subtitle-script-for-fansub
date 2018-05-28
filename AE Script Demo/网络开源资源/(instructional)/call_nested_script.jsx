{
	// call_nested_script.jsx
	// 
	// This script shows how one script can call another.
	
	
	alert("This script shows how one script can call another. The next alert you see, after closing this one, will come from a nested script.");
	
	// Here's all you do. 
	
	// [1] Create file object for the file you want to run.
	var nested_file = new File("nested_script.jsx");
	
	// [2] Open the file for reading.
	nested_file.open("r");
	
	// [3] Read the file and evaluate the results.
	eval(nested_file.read());
	
	// [4] Close the file. That's it!
	nested_file.close();
	
	alert("Test complete!");
}
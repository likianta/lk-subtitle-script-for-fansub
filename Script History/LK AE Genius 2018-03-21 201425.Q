// ================ About ================

// LK Anjian Genius.q
//
// This script is based on LK Subtitle Generator, it helps you create simulated clicks and key-events.

// How to understand my code?
//
// 1. Search "TODO" to see what had not accompished yet.
// 2. Search "TEST" to see what options were under developing mode.
// 3. Change "VERSION" value to swith between develop-environment and released-environment. 
// 4. I like keeping my code clean, modulary and no grammatical error.
// 5. VBScript is not sensitive to characte case, but I'll try to keep it neat.


// ================ Init Variables ================

Dim VERSION
VERSION = "DEVELOP" // TEST
//VERSION = "RELEASE"

Dim path // record the file path
AccessFilePath()
Function AccessFilePath()
	// Find the file in an absolute path.
	If VERSION = "DEVELOP" Then
		// 按键精灵的判断语句比较反人类……
		path = "F:\Workspace\LikiantaProjects\LK-SubtitleScript-for-Fansub\LK Subtitle Scripts\resources\current_status.ini"
		//path = "F:\Workspace\LikiantaProjects\LK-SubtitleScript-for-Fansub\LK Subtitle Scripts\resources\current_status.txt"
	Else
		// TODO
		path = ""
	End If
End function


// ================ Access the Current Status File ================

Dim ax, ay, bx, by

AccessStatusFile(path)

// Access current_status.ini
Function AccessStatusFile(path)
	private isFile
	
	isFile = Plugin.File.IsFileExist(path)
	If isFile = True Then
		TracePrint "asf: file found"
		AccessINI("Inits")
	Else
		// How to insert a new line in vbscript ?
		// https://zhidao.baidu.com/question/332228158.html
		MsgBox "Configuraition file not found. " & vbcrlf & "Please check if this target exists: " & vbcrlf & "./LK Subtitle Scripts/resources/current_status.ini"
		//AccessStatusFile = false
		// Exit running
		EndScript
	End If
End Function

Function AccessINI(section)
	private result
	
	Select case section
	Case "Inits"
		result = Plugin.File.ReadINI(section, "is_first_use", path)
		TracePrint result
		//If result = "false" then // TEST
		If result = "true" then
			// 函数嵌套结构用 `call` 命令
			// https://zhidao.baidu.com/question/38863310.html
			Call RequestCoordinates("plan_a")
		Else
			Call AccessCoordinates()
		End if
	Case "Coordinates"
		ax = Plugin.File.ReadINI(section, "layer_a_pos_x", path)
		ay = Plugin.File.ReadINI(section, "layer_a_pos_y", path)
		bx = Plugin.File.ReadINI(section, "layer_b_pos_x", path)
		by = Plugin.File.ReadINI(section, "layer_b_pos_y", path)
	End Select
End Function


// ================ Request and Revise Coordinates ================

Dim dct, switcher

Function RequestCoordinates(plan)
	MsgBox "这是你第一次使用本自动化脚本，下面将需要你提供初始化操作……"
	// TODO
	For i=1 to 2
		MsgBox "请将鼠标指针放在你的合成面板中的第" & i & "条字幕上（参考图：）"
		// Watch the click event from user
		Delay 2000
		If i=1 then
			GetCursorPos ax, ay
		Else 
			GetCursorPos bx, by
			Call ReviseCoordinates(plan)
			MsgBox "录入完成，录入坐标值为 (" & bx & ", " & by & ")" & vbcrlf & "按键精灵将重复一遍你的鼠标位置，请判断是否正确"
			call RightOrWrong()
		End if
	Next
End Function

Function ReviseCoordinates(plan)
	private factor
	
	Select case plan
	Case "plan_a"
		factor = 1
		TracePrint "rc: plan a"
	case "plan_b"
		// 120%
		factor = 1.2
	Case "error"
		// TODO
	End select
	
	ax = ax * factor
	ay = ay * factor
	bx = bx * factor
	by = by * factor
End Function

Function RightOrWrong()
	private result
	result = "right1" // TEST
	
	MoveTo 1000, 500
	Delay 1000
	MoveTo bx, by
	Delay 500
	
	// TODO
	//MsgBox "RightOrWrong"
	
	// Right1, right2, wrong1, wrong2
	// Right1: nothing wrong, let's go ahead
	// Right2: I was just absent-minded, please repeat it
	// Wrong1: my operation was wrong, I want to do it again
	// Wrong2: my operation was right, but the script was wrong
	
	Select case result
		Case "right1"
			// Go ahead
			Call plugin.file.writeINI("Inits", "is_first_use", "false", path)
			Call plugin.file.writeINI("Coordinates", "layer_a_pos_x", ax, path)
			Call plugin.file.writeINI("Coordinates", "layer_a_pos_y", py, path)
			Call plugin.file.writeINI("Coordinates", "layer_b_pos_x", bx, path)
			Call plugin.file.writeINI("Coordinates", "layer_b_pos_y", by, path)
			MsgBox "录入成功，当前坐标值为 (" & ax & ", " & ay & ")" & vbcrlf & "下面开始自动化运行……"
			Delay 500
			Call AccessCoordinates()
		Case "right2"
			// Repeat
			Call RightOrWrong()
		Case "wrong1"
			// Redo
			Call RequestCoordinates("plan_a")
		Case "wrong2"
			// Change revise plan
			If switcher = 0 then
				Call RequestCoordinates("plan_b")
				switcher = 1
			Else 
				Call RequestCoordinates("error")
				switcher = 0
			End if
		Case else
	
	
	End select
End Function


// ================ Load Coordinates ================

Function AccessCoordinates()
	AccessINI("Coordinates")
	call CreateDictionary(ax, py)
End function

// TODO
Function CreateDictionary(x, y)
	// TODO
	//dct = CreateObject("Attrs.Dictionary")
	//dct.add "coordinate_x", x
	//dct.add "coordinate_y", y
	

End Function


// ================ Copy and Paste Operations ================

Dim counter // time counter or times counter, whichever
Dim s // any temp, in-process and unimportant values (or maybe objects) can be stored into this variable


















/*

If counter = 0 Then
	// Ctrl + C
	KeyDown 17, 1
	KeyPress 67, 1
	KeyUp 17, 1
	
	Delay 150
	LeftClick 1
	counter = 1
	
	// Click "Continue"
	
	EndScript
ElseIf counter = 1 Then
	KeyPress "Right", 1
	// Ctrl + V
	KeyDown 17, 1
	KeyPress 86, 1
	KeyUp 17, 1
	
	Delay 150
	LeftClick 1
	counter = 0
	
	// Click "Continue"
	
	EndScript
End If
	
*/
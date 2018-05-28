[General]
SyntaxVersion=2
BeginHotkey=121
BeginHotkeyMod=0
PauseHotkey=0
PauseHotkeyMod=0
StopHotkey=123
StopHotkeyMod=0
RunOnce=1
EnableWindow=
MacroID=f9110c8c-46a7-4cae-bb21-aa9e8376a1a6
Description=LK Anjian Genius
Enable=1
AutoRun=0
[Repeat]
Type=0
Number=1
[SetupUI]
Type=2
QUI=
[Relative]
SetupOCXFile=
[Comment]

[Script]
// ================ About ================

// LK Anjian Genius.q
//
// This script is based on LK Subtitle Generator, it helps you create simulated clicks and key-events.

// How to read my code?
//
// 1. Search "TODO" to see what had not accompished yet.
// 2. Search "TEST" to see what options were under developing mode.
// 3. Change "version" value to swith between develop-environment and released-environment. 
// 4. I like keeping my code clean, modulary and no grammatical error.
// 5. VBScript is not sensitive to characte case, but I'll try to keep it neat.


// ================ Init Environment ================

// Global variables
Global path, version

version = "DEVELOP" // TEST
//version = "RELEASE"

// Find the file in an absolute path
If version = "DEVELOP" Then
	// 按键精灵的判断语句比较反人类……
	path = "F:\Workspace\LikiantaProjects\LK-SubtitleScript-for-Fansub\LK Subtitle Scripts\resources\current_status.ini"
	//path = "F:\Workspace\LikiantaProjects\LK-SubtitleScript-for-Fansub\LK Subtitle Scripts\resources\current_status.txt"
Else
	// TODO
	path = ""
End If

// ================ Access the Current Status File ================

Dim ax, ay, bx, by, cx, cy, dx, dy

AccessStatusFile(path)

// Access current_status.ini
Function AccessStatusFile(path)
	private isFile
	
	isFile = Plugin.File.IsFileExist(path)
	If isFile = True Then
		AccessINI("Inits")
		TracePrint "asf: file found"
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
		If result = "false" then // TEST
		//If result = "true" then
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
		cx = Plugin.File.ReadINI(section, "layer_c_pos_x", path)
		cy = Plugin.File.ReadINI(section, "layer_c_pos_y", path)
		dx = Plugin.File.ReadINI(section, "btn_pos_x", path)
		dy = Plugin.File.ReadINI(section, "btn_pos_y", path)
	End Select
End Function


// ================ Request and Revise Coordinates ================

Dim dct, switcher

Function RequestCoordinates(plan)
	private x, y
	MsgBox "这是你第一次使用本自动化脚本，下面将需要你提供初始化操作……"
	
	For i=1 to 4
		// Watch the click event from user
		Delay 2000
		Select case i
			Case 1
				MsgBox "首先，请将鼠标指针放在你的合成面板中的第" & i & "条字幕上（参考图：）"
				GetCursorPos ax, ay
				x = ReviseCoordinates(plan, "test_ax")
				y = ReviseCoordinates(plan, "test_ay")
				MsgBox "录入完成，录入坐标值为 (" & x & ", " & y & ")" & vbcrlf & "按键精灵将重复一遍你的鼠标位置，请判断是否正确"
				call RightOrWrong(x, y)
			Case 2
				MsgBox "第二步，请将鼠标指针放在你的合成面板中的第" & i & "条字幕上（参考图：）"
				GetCursorPos bx, by
			Case 3
				MsgBox "第三步，请将鼠标指针放在你的合成面板中的第" & i & "条字幕上（参考图：）"
				GetCursorPos cx, cy
			Case 4
				MsgBox "最后一步，请将鼠标放在LK字幕脚本工具的“Generate”按钮上（参考图：）"
				GetCursorPos dx, dy
				Call ReviseCoordinates(plan, "")
		End select
	Next
End Function

Function ReviseCoordinates(plan, test)
	private factor
	factor = 1
	
	Select case plan
	Case "plan_a"
		factor = 1
		TracePrint "rc: plan a"
	case "plan_b"
		// 120%
		factor = 1.2
	Case "plan_c"
		// 提示把鼠标放在屏幕右下角，通过计算获取值与标准值（1080x1920）的对应比率，作为分辨率缩放依据
		// TODO
		
	Case else
		// Bad error. You'd have to shut down this script and ask the author for help
		MsgBox "您的设备鼠标位置获取失败，脚本将退出运行。" & vbcrlf & "如需反馈此问题，请在QQ上与我联系。" & vbcrlf & "QQ：1016443621" & vbcrlf & "Email：sheerish@qq.com"
		ExitScript
	End select
	
	If test = "test_ax" then
		ReviseCoordinates = ax * factor
	ElseIf test = "test_ay" then
		ReviseCoordinates = ay * factor
	Else 
		ax = ax * factor
		ay = ay * factor
		bx = bx * factor
		by = by * factor
		cx = cx * factor
		cy = cy * factor
		dx = dx * factor
		dy = dy * factor
	End if
End Function

Function RightOrWrong(x, y)
	private result
	result = "right1" // TEST
	
	// 鼠标模拟演示
	MoveTo 1000, 500
	Delay 1000
	MoveTo x, y
	Delay 500
	
	// TODO
	//MsgBox "RightOrWrong"
	
	// Options: right1, right2, wrong1, wrong2
	// Right1: nothing wrong, let's go ahead
	// Right2: I was just absent-minded, please repeat it
	// Wrong1: my operation was wrong, I want to do it again
	// Wrong2: my operation was right, but the script was wrong
	
	Select case result
		Case "right1"
			// Go ahead
			Call plugin.file.writeINI("Inits", "is_first_use", "false", path)
			Call plugin.file.writeINI("Coordinates", "layer_a_pos_x", ax, path)
			Call plugin.file.writeINI("Coordinates", "layer_a_pos_y", ay, path)
			Call plugin.file.writeINI("Coordinates", "layer_b_pos_x", bx, path)
			Call plugin.file.writeINI("Coordinates", "layer_b_pos_y", by, path)
			Call plugin.file.writeINI("Coordinates", "layer_c_pos_x", cx, path)
			Call plugin.file.writeINI("Coordinates", "layer_c_pos_y", cy, path)
			Call plugin.file.writeINI("Coordinates", "btn_pos_x", dx, path)
			Call plugin.file.writeINI("Coordinates", "btn_pos_y", dy, path)
			MsgBox "录入成功，当前坐标值为 (" & ax & ", " & ay & ")" & vbcrlf & "下面开始自动化运行……"
			Delay 500
			Call AccessCoordinates()
		Case "right2"
			// Repeat
			Call RightOrWrong(x, y)
		Case "wrong1"
			// Redo
			Call RequestCoordinates("plan_a")
		Case "wrong2"
			// Change revise plan
			If switcher = 0 then
				Call RequestCoordinates("plan_b")
				switcher = 1
			ElseIf switcher = 1 then
				Call RequestCoordinates("plan_c")
				switcher = 2
			Else
				Call RequestCoordinates("error")
				switcher = 0
			End if
	End select
End Function


// ================ Load Coordinates ================

Function AccessCoordinates()
	AccessINI("Coordinates")
	//call CreateDictionary()
End function

// TODO or delete
Function CreateDictionary()
	//dct = CreateObject("Attrs.Dictionary")
	//dct.add "coordinate_x", x
	//dct.add "coordinate_y", y
	

End Function


// ================ Registe An Observer ================

Dim counter // time counter or times counter, whichever
Dim status

counter = 0

// Registe an Observer
Do
	status = Plugin.File.ReadINI("Status", "status", path)
	If status = "resume" or status = "start" then
		// Do operations
		Call CopyAndPaste()
		Call plugin.file.writeINI("Status", "status", "pause", path)
		// Click the "Generate" button
		MoveTo dx, dy
		LeftClick 1
	ElseIf counter > 20 // TEST timeout > 10s
	//ElseIf counter > 240
		// Timeout (more than 2min)
		MsgBox "Timeout"
		EndScript
	End if
	Delay 500
	counter = counter + 1
Loop


// ================ Copy and Paste Operations ================

Dim s // any temp, in-process and unimportant values (or maybe objects) can be stored into this variable

Function CopyAndPaste()
	// Copy the text layer (type down_num, pos a)
	MoveTo ax, ay
	LeftDoubleClick 1
	Call CtrlC()
	
	// Paste to the text layer (type up_ch, pos c)
	MoveTo cx, cy
	LeftDoubleClick 1
	KeyPress "Right", 1
	Call CtrlV()
	
	// Then copy the text layer (type down_ch, pos b)
	MoveTo bx, by
	LeftDoubleClick 1
	Call CtrlC()

	// Paste to the text layer (type up_ch, pos c)
	MoveTo cx, cy
	LeftDoubleClick 1
	KeyPress "Right", 1
	Call CtrlV()
End Function

Function CtrlC()
	// Ctrl + C
	KeyDown 17, 1
	KeyPress 67, 1
	KeyUp 17, 1
	Delay 250
End Function

Function CtrlV()
	// Ctrl + V
	KeyDown 17, 1
	KeyPress 86, 1
	KeyUp 17, 1
	Delay 250
End Function


// ================ Recycle Bin ================

/*


	
*/
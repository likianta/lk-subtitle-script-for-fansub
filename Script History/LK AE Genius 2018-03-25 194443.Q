// ================ About ================

// LK Anjian Genius.q
//
// This script is based on LK Subtitle Generator, it helps you create simulated clicks and key-events.

// How to read my code?
//
// 1. Search "TODO" or "FIXME" to see what had not accompished yet.
// 2. Search "TEST" to see which options were under developing mode.
// 3. Change "version" value to swith between develop-environment and released-environment. 
// 4. I like keeping my code clean, modulary and no grammatical error.
// 5. VBScript is not sensitive to characte case, but I'll try to keep it neat.

// 【LK按键精灵（以下简称“本产品”）】是为【LK字幕生成工具】配置的模拟人工点击的脚本，旨在解决AE所未提供的文字图层混合字体格式的问题。
// 
// 使用该脚本将自动实现以下操作：
// 
// 1. 自动复制下小字数字并粘贴到目标文字图层的末尾
// 2. 自动复制下小字汉字并粘贴到目标文字图层的末尾
// 3. 自动点击“Generate”按钮以继续
// 4. 定时检测配置文件以判断当前AE运行状态
// 5. 本产品设有超时检测机制，当运行时长超过2分钟时将强制退出
// 
// 首次使用须知：
// 
// 1. 首次使用需自行配置四个屏幕位置（按键精灵会给出相应的提示和辅助），请务必确保鼠标位置配置无误（否则请删除“current_status.ini”中的信息重来）
// 
// 其他注意事项：
// 
// 1. 当前版本为测试版，可能会产生很多未知错误
// 2. 受DOM限制，暂时没有完善的防错机制，按键精灵可能会在AE自动保存峰值发生严重错误
// 3. 按F12键可强制退出脚本
// 4. 当前版本未开放坐标矫正接口，因为UI界面未完成。如果遇到鼠标位置不准确的问题，请暂停使用，下个版本会尽快修复
// 
// 如果你有任何问题或疑问，请在群内联系我或者使用以下方式：
// 
// QQ：1016443621  
// Email：sheerish@qq.com


// ================ Init Environment ================

// Global variables
Global path, status_path, version
Dim tmp // any temp, in-process and unimportant values (or maybe objects) can be stored into this variable

version = "DEVELOP" // TEST
//version = "RELEASE"

If version = "DEVELOP" Then
	// Find the files in an absolute path
	path = "F:\Workspace\LikiantaProjects\LK-SubtitleScript-for-Fansub\LK Subtitle Scripts\resources\config.ini"
	status_path = "F:\Workspace\LikiantaProjects\LK-SubtitleScript-for-Fansub\LK Subtitle Scripts\resources\current_status.ini"
Else
	// Find the files in a relative path
	tmp = Getexedir // "C:\Program Files\Adobe\Adobe After Effects CC 2017\Support Files\Scripts\ScriptUI Panels\LK Subtitle Scripts\"
	path = tmp & "resources\config.ini"
	status_path = tmp & "resources\current_status.ini"
	TracePrint "GlobalPath: " & path
End If


// ================ Init Resources ================

Dim pics

pics = InitResources(pics)

Function InitResources(pics)
	pics = Array(0, 1, 2, 3)
	pics(0) = tmp & "resources\mousemove_tip_1.jpg"
	pics(1) = tmp & "resources\mousemove_tip_2.jpg"
	pics(2) = tmp & "resources\mousemove_tip_3.jpg"
	pics(3) = tmp & "resources\mousemove_tip_4.jpg"
	InitResources = pics
End function


// ================ Access the Configuration Files ================

// Dim mouse positions
Dim ax, ay, bx, by, cx, cy // 图层a、b、c的鼠标位置
Dim gen_x, gen_y // 生成按钮的鼠标位置
Dim mx, my, mcx, mcy, mpx, mpy // 菜单栏、复制命令、粘贴命令的鼠标位置

AccessStatusFile(path)

// Access current_status.ini
Function AccessStatusFile(path)
	private isConfigFile, isStatusFile
	
	isConfigFile = Plugin.File.IsFileExist(path)
	isStatusFile = Plugin.File.IsFileExist(status_path)
	// VBScript 不支持 ＆ 语法，而应该用 and 来表并列
	If isConfigFile = True and isStatusFile = True Then
		AccessINI("Genius_Inits")
		TracePrint "AccessStatusFile: configuraition files found"
	Else
		// How to insert a new line in vbscript ?
		// https://zhidao.baidu.com/question/332228158.html
		MsgBox "Configuraition file not found. " & vbcrlf & "Please check if targets exist: " & vbcrlf & "./LK Subtitle Scripts/resources/config.ini" & vbcrlf & "./LK Subtitle Scripts/resources/current_status.ini"
		MsgBox "Current paths: " & vbcrlf & path & vbcrlf & status_path
		// Exit running
		EndScript
	End If
End Function

Function AccessINI(section)
	private result
	
	Select case section
	Case "Genius_Inits"
		Call plugin.file.writeINI(section, "status_path", status_path, path)
		result = Plugin.File.ReadINI(section, "is_first_use", path)
		TracePrint "AccessINI: " & result
		//If result = "false" then // TEST
		If result = "true" then
			// 函数嵌套结构用 `call` 命令
			// https://zhidao.baidu.com/question/38863310.html
			Call RequestCoordinates("plan_a")
		Else
			Call AccessCoordinates()
		End if
	Case "Genius_Coordinates"
		ax = Plugin.File.ReadINI(section, "layer_a_pos_x", path)
		ay = Plugin.File.ReadINI(section, "layer_a_pos_y", path)
		bx = Plugin.File.ReadINI(section, "layer_b_pos_x", path)
		by = Plugin.File.ReadINI(section, "layer_b_pos_y", path)
		cx = Plugin.File.ReadINI(section, "layer_c_pos_x", path)
		cy = Plugin.File.ReadINI(section, "layer_c_pos_y", path)
		gen_x = Plugin.File.ReadINI(section, "btn_pos_x", path)
		gen_y = Plugin.File.ReadINI(section, "btn_pos_y", path)
	End Select
End Function


// ================ Request and Revise Coordinates ================

Global key // 用于响应用户按键事件
Dim dct, switcher

Function RequestCoordinates(plan)
	private x, y
	MsgBox "这是你第一次使用本自动化脚本，下面将需要你提供一些初始化操作……"
	
	For i=1 to 7
		// Watch the click pos from user
		Select case i
			Case 1
				MsgBox "首先，请将鼠标指针放在你的合成面板中的第" & i & "条字幕上（准备好后，按下Q键以继续）"
				//Delay 2000
				Call WaitForKey("q")
				GetCursorPos ax, ay
				x = ReviseCoordinates(plan, "test_ax")
				y = ReviseCoordinates(plan, "test_ay")
				MsgBox "录入完成，录入坐标值为 (" & x & ", " & y & ")" & vbcrlf & "按键精灵将重复一遍你的鼠标位置，请判断是否正确"
				call RightOrWrong(x, y, "test")
			Case 2
				MsgBox "第二步，请将鼠标指针放在你的合成面板中的第" & i & "条字幕上（准备好后，按下Q键以继续）"
				//Delay 2000
				Call WaitForKey("q")
				GetCursorPos bx, by
			Case 3
				MsgBox "第三步，请将鼠标指针放在你的合成面板中的第" & i & "条字幕上（准备好后，按下Q键以继续）"
				//Delay 2000
				Call WaitForKey("q")
				GetCursorPos cx, cy
			Case 4
				MsgBox "第四步，请将鼠标指针放在AE 菜单栏 - 编辑 上（准备好后，按下Q键以继续）"
				//Delay 2000
				Call WaitForKey("q")
				GetCursorPos mx, my
			Case 5
				MsgBox "第五步，点开 菜单栏 - 编辑，把鼠标放在“复制”命令上（准备好后，按下Q键以继续）"
				//Delay 2000
				Call WaitForKey("q")
				GetCursorPos mcx, mcy
			Case 6
				MsgBox "第六步，点开 菜单栏 - 编辑，把鼠标放在“粘贴”命令上（准备好后，按下Q键以继续）"
				//Delay 2000
				Call WaitForKey("q")
				GetCursorPos mpx, mpy
			Case 7
				MsgBox "最后一步，请将鼠标放在LK字幕脚本工具的“Generate”按钮上（准备好后，按下Q键以继续）"
				//Delay 2000
				Call WaitForKey("q")
				GetCursorPos gen_x, gen_y
				Call ReviseCoordinates(plan, "")
				Call RightOrWrong(x, y, "right1")
		End select
	Next
End Function

Function ReviseCoordinates(plan, test)
	private factor
	factor = 1
	
	Select case plan
	Case "plan_a"
		factor = 1
		TracePrint "ReviseCoordinates: plan a"
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
		gen_x = gen_x * factor
		gen_y = gen_y * factor
	End if
End Function

Function WaitForKey(keyevent)
	private counter
	counter = 0
	
	// 等待用户按下正确的键
	// 如果用户按下的不是正确的键，那么就会锁死在这个循环中，直到超时强制停止
	// 另外留了一个后门，如果用户按下Esc也可以强制退出循环
	Do
		If key = keyevent or key = "Esc" then
			Exit do
		End if
		
		counter = counter + 1
		If counter = 120 then
			MsgBox "Timeout, script shut down"
			EndScript
			Exit do
		End if
		Delay 500
	Loop 

End Function

Function RightOrWrong(x, y, command)
	private result
	result = "test_right"
	
	// Options: test_right, right1, right2, wrong1, wrong2
	// Test_right: do nothing, let it go through
	// Right1: nothing wrong, let's go ahead
	// Right2: I was just absent-minded, please repeat it
	// Wrong1: my operation was wrong, I want to do it again
	// Wrong2: my operation was right, but the script was wrong
	
	Select case command
		Case "test"
			// 鼠标模拟演示
			MoveTo 1000, 500
			Delay 1000
			MoveTo x, y
			Delay 500
			
			// TODO
			// 需要提供一个多向选择的对话框，当点击按钮后返回结果给 result
			MsgBox "请确认是否正确：" & vbcrlf & "按下Q键：没问题，请继续；" & vbcrlf & "按下W键：刚才没看清，请再演示一遍；" & vbcrlf & "按下E键：我的操作有误，我想要重新录入；" & vbcrlf & "按下R键：脚本的操作有误，调用其他算法模拟坐标"
			Key = WaitKey()
			Select case key
				Case "q"
					Call RightOrWrong(x, y, "test_right")
				Case "w"
					Call RightOrWrong(x, y, "right2")
				Case "e"
					Call RightOrWrong(x, y, "wrong1")
				Case "r"
					Call RightOrWrong(x, y, "wrong2")
				Case else
					Call WaitForKey("Esc")
			End select
			call RightOrWrong(x, y, result)
		Case "right1"
			// Go ahead
			Call plugin.file.writeINI("Genius_Inits", "is_first_use", "false", path)
			Call plugin.file.writeINI("Genius_Coordinates", "layer_a_pos_x", ax, path)
			Call plugin.file.writeINI("Genius_Coordinates", "layer_a_pos_y", ay, path)
			Call plugin.file.writeINI("Genius_Coordinates", "layer_b_pos_x", bx, path)
			Call plugin.file.writeINI("Genius_Coordinates", "layer_b_pos_y", by, path)
			Call plugin.file.writeINI("Genius_Coordinates", "layer_c_pos_x", cx, path)
			Call plugin.file.writeINI("Genius_Coordinates", "layer_c_pos_y", cy, path)
			Call plugin.file.writeINI("Genius_Coordinates", "btn_pos_x", gen_x, path)
			Call plugin.file.writeINI("Genius_Coordinates", "btn_pos_y", gen_y, path)
			MsgBox "现在，你的鼠标位置已全部录入完成，按键精灵将在1秒后开始自动工作……"
			Delay 1000
			Call AccessCoordinates()
		Case "right2"
			// Repeat
			Call RightOrWrong(x, y, "test")
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
		Case else
			// Maybe case equals to "test_right", and do nothing
			
	End select
End Function


// ================ Load Coordinates ================

Function AccessCoordinates()
	AccessINI("Genius_Coordinates")
End function


// ================ Init Operations ================

// Ctrl+s, and click the generate button. Then wait for status file changed

call InitOperations()

Function InitOperations()
	Delay 500
	MoveTo gen_x, gen_y
	LeftClick 1
	
	If version = "RELEASE" then 
		// Ctrl+S
		KeyDown 17, 1
		KeyPress 83, 1
		KeyUp 17, 1
	End if
End Function

// ================ Registe An Observer ================

Dim counter // time counter or times counter, whichever
Dim status

counter = 0

// Registe an Observer
Do until counter > 240
	status = Plugin.File.ReadINI("Status", "status", status_path)
	TracePrint "Get into loop, the status is " & status
	Select case status
		Case "reset"
			// Do nothing
			
		case  "resume"
			// Do operations
			Call CopyAndPaste(status)
			// Click the "Generate" button
			MoveTo gen_x, gen_y
			LeftClick 1
			Call plugin.file.writeINI("Status", "status", "pause", path)
		Case "resume_b"
			// Do operations
			Call CopyAndPaste(status)
			// Click the "Generate" button
			MoveTo gen_x, gen_y
			LeftClick 1
			Call plugin.file.writeINI("Status", "status", "pause", path)
		Case "resume_c"
			// Do operations
			Call CopyAndPaste(status)
			// Click the "Generate" button
			MoveTo gen_x, gen_y
			LeftClick 1
			Call plugin.file.writeINI("Status", "status", "pause", path)
		Case "resume_d"
			// Not do operations, just click the "Generate" button
			MoveTo gen_x, gen_y
			LeftClick 1
			Call plugin.file.writeINI("Status", "status", "pause", path)
		Case "stop"
			// Wait
			
		Case "pause"
			// Wait
			
		Case "exit"
			// Exit Genius
			//MsgBox "Congratulations" // LK脚本已经有祝贺词了
			EndScript
		Case "error"
			// Exit Genius
			MsgBox "Unkown error happened. Genius cannot work."
			ExitScript
	End select
	If counter >= 240 then
		// Timeout (more than 2min)
		MsgBox "Timeout"
		EndScript
	End if
	Delay 500
	counter = counter + 1
Loop


// ================ Copy and Paste Operations ================

Dim interval_a, interval_b // 控制节奏（即延时）

// TODO
// 未来会在精灵UI中增加一个控制节奏的按钮，比如读取配置文件，获取延时因子
interval_a = 1000
interval_b = 1800

Function CopyAndPaste(status)
	TracePrint "CopyAndPaste: " & status
	If status = "resume" or status = "resume_b" then
		// Copy the text layer b (layer type = down_num, pos b)
		Call Clicker(bx, by, interval_b)
		Call CtrlC(interval_a)
		
		// Paste to the text layer a (layer type = up_ch, pos a)
		Call Clicker(ax, ay, interval_b)
		Call CtrlV(interval_a)
	End if
	
	If status = "resume" or status = "resume_c" then
		// Copy the text layer c (layer type = down_ch, pos c)
		Call Clicker(cx, cy, interval_b)
		Call CtrlC(interval_a)
		
		// Paste to the text layer (layer type = up_ch, pos a)
		Call Clicker(ax, ay, interval_b)
		Call CtrlV(interval_a)
	End if
End Function

Function Clicker(x, y, interval)
	MoveTo x, y
	LeftClick 1
	Delay interval
	LeftDoubleClick 1
End Function

Function CtrlC(interval)
	// Ctrl + C
	Delay interval
	KeyDown "Ctrl", 1
	KeyPress "C", 1
	KeyUp "Ctrl", 1
	Delay interval
End Function

Function CtrlV(interval)
	// Press right
	KeyPress "Right", 1
	Delay interval
	
	// Ctrl + V
	KeyDown "Ctrl", 1
	KeyPress "V", 1
	KeyUp "Ctrl", 1
	Delay interval
End Function


// ================ Recycle Bin ================

/*


	
*/

// ================ Notice ================

/*
	# VBScript语法注意
	
	1. 末尾不要加分号
	2. VBScript对大小写不敏感
	3. 选择函数只能用`Select`，不能用`Switch`
	4. 选择函数结束选择无需用`End Case`，总之它不会跨串
	5. If函数只能用单等于号，不能用双等于或三等于
	6. 递增操作不能用`num++`，只能用`num = num + 1`
	4. 监听按键（WaitKey()）一定要有一个锁环机制，否则形同虚设
	7. 任何模拟人工的键鼠操作都要考虑到加入延时
	8. 全局变量不要滥用，全局变量不要频繁改变，最好能当成一个“静态值”来用
	9. 函数内不能用`Dim`声明变量，而是用`private`来声明（局部变量）

*/
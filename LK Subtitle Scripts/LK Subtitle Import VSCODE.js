{
    // LK Subtitle Import.jsx
    // 该脚本用于导入 ass/txt 字幕文件到当前 AE 工程中

    /**
     * Popup a dialog window and obtain the the file content
     * 
     * @returns {String} content - the original content from a selected ass/txt subtitle file
     */
    function LK_SubtitleImport() {
        // Init
        var content = ''; // `content` 变量用于读取文件中的文本内容
        var file = null; // `file` 是我们要获得的目标文件（后缀为 `.ass` 或者 `.txt` ）

        // 弹出文件对话窗口
        // 第一个参数是窗口标题名
        // 第二个参数是支持的文件类型（可自定义，如需多个则用中括号包裹，每个用逗号隔开）
        // 第三个参数是表示单选还是多选，填 `true` 是多选；填 `false` 或留空是单选
        file = File.openDialog(
            'Select an ass/txt file...',
            ['Aegisub Advanced SSA:*.ass', 'Text:*.txt'],
            false
        );

        if (file != null) {
            // 打开文件并读取内容
            // 相关学习：[Adobe 脚本之如何读取 txt 文件的文本内容](https://likianta.coding.me/2018/0203-193432/)
            file.open('r');
            content = file.read();
            file.close();

            // 将获得的 `content` 返回
            return content;
        } else {
            //alert('No file selected.', 'Prompt');
            return null;
        }
    }
    LK_SubtitleImport();
}

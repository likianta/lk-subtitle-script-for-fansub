var s = app.project.numItems; 
for (i = s; i > 0; i--) { // 从倒数第一个向第一个素材遍历，目的是找到一个含有合成视频的素材（也就是我们当前工程中的“视频序列”）
                if (app.project.item(i).hasVideo && app.project.item(i).hasAudio && app.project.item(i).typeName == '合成') {
                    // 找到以后记录下它的位置和视频帧率，以后会作为静态值调用
                    INDEX = i;
                   
                    break;
                } else if (i == 1) { // 如果完全遍历后仍找不到，那么会弹出警告提示框
                    alert("There is no video compItem found!", 'Warning');
                }
            }

var master = app.project.item(INDEX);

layer = master.layers.addText('');
layer.name = "layer name";

 s = layer.property("Source Text").value;
         // 下小字数字
                            s.text = '123456 ';
                            s.font = 'Arial';
                            s.fontSize = 95;
                            s.fillColor = [1, 1, 1];
                            s.applyStroke = false;
                    layer.property("Source Text").setValue(s);



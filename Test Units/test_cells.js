// ================ Test Samples ================

// Table of contents

/*
    - Common Utils
    - Regex Tests
    - Text Layer Tests
*/

/* global $ app 
    timeToCurrentFormat 
    currentFormatToTime */


{ // ================ Common Utils ================


    /**
     * Get a target item.
     * @param {Number} index 如果你已经明确知道合成项位于项目面板中的位置（位置是从1开始数的），则填写index；
     * 如果不清楚则填0，它会自动查找**音视频**合成项并返回给你
     * @return {CompItem} item 
     * ![参考图](http://ozurciydg.bkt.clouddn.com/18-3-26/41643898.jpg)
     */
    function getItem(index) {
        if (index == 0) {
            var num = app.project.numItems;
            for (index = 1; index <= num; index++) {
                if (app.project.item(index).hasVideo
                    && app.project.item(index).hasAudio
                    && app.project.item(index).typeName == '合成') {
                    return app.project.item(index);
                } else if (index == num) {
                    alert('AV Item not found.');
                    return null;
                }
            }
        } else {
            return app.project.item(index);
        }
    }

    function getLayerFromAvItem(value, cmd) {
        var avItem = getItem(0);
        return getLayer(value, cmd, avItem);
    }

    function getLayer(value, cmd, item) {
        switch (cmd) {
            case 'byName':
                return item.layers.byName(value);
                
            case 'byId':
                // 详见“byIndex”

            case 'byOrder':
                // 详见“byIndex”
                
            case 'byIndex':
                return item.layer(value);
            default:
                break;
        }
    }


}

{ // ================ Regex Tests ================


    var str_1 = '123 asdf';
    var str_2 = '123 asdf';
    var str_3 = '123 asdf';
    var str_4 = '123 asdf';
    var str_5 = '123 asdf';
    var regex_1 = RegExp('', 'g');
    var regex_2 = RegExp('', 'g');
    var regex_3 = RegExp('', 'g');
    var regex_4 = RegExp('', 'g');
    var regex_5 = RegExp('', 'g');

    testRegex(str_1, regex_1);

    function testRegex(str, regex) {
        var a = regex.test(str);
        var b = regex.exec(str);
        a = a.toString();
        b = b.toString();
        alert('test = ' + a + '\nexec = ' + b);
    }


}


{ // ================ Text Layer Tests ================


    //var item = getAvItem();
    var layer = addTextLayer(getAvItem());

    function addTextLayer(item) {
        var layer = item.layers.addText('abc');
        var s = layer.property("Source Text").value;

        s.text = '123 ';
        s.font = 'Arial';
        s.fontSize = 72;
        s.fillColor = [1, 1, 1];
        s.applyStroke = false;

        layer.property("Source Text").setValue(s);
        return layer;
    }

    function getAvItem() {
        var num = app.project.numItems;
        for (var i = 1; i <= num; i++) {
            if (app.project.item(i).hasVideo
                && app.project.item(i).hasAudio
                && app.project.item(i).typeName == '合成') {
                return app.project.item(i);
            } else if (i == num) {
                alert('AV compItem not found.');
                return null;
            }
        }
    }


}

{ // ================ UI Tests ================


    var win = createWindows('test', 100, 100, 200, 100);
    var rb1 = createElements('radiobutton', 'option 1', 0, 0, 50, 20, win);
    var rb2 = createElements('radiobutton', 'option 2', 0, 20, 50, 20, win);

    function createWindows(winName, x, y, width, height) {
        var win = new Window("palette", winName, [x, y, x + width, y + height], { 
            resizeable: true,
            maximizeButton: false,
            minimizeButton: false,
        });
        //win.center();
        win.show();
        return win;
    }

    function createElements(elementType, label, x, y, width, height, parent) {
        var properties = {};

        switch (elementType) {
            case 'radiobutton':
                // Radio button has no property
                break;
        
            default:
                break;
        }

        // return element;
        return parent.add(elementType, [x, y, x + width, y + height], label, properties);
    }

}

{ // ================ Data ================
    {
        var path = '';
    }

    function getData(key) {
        switch (key) {
            case 'path':
                return path;
        
            default:
                break;
        }
    }

    function setData(key, value) {
        switch (key) {
            case 'path':
                path = value;
                break;
        
            default:
                break;
        }
    }

    {
        setData('path', 'lk');
        var s = getData('path');
        alert(s);
    }
}














































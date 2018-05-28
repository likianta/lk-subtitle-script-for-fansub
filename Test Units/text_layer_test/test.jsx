// text layer test
// target: splice two strings into one and apply it on the single text layer

var layer = addTextLayer(getAvItem());

// ----------------------------------------------------------------
// create text document object

var s = layer.property('Source Text').value;
var s1 = layer.property('Source Text').value;

// ----------------------------------------------------------------

setProperties(s, '111');
setProperties(s1, '222');

function setProperties(textDocument, str) {
    textDocument.text = str;

    textDocument.font = 'Arial';
    textDocument.fontSize = 72;
    textDocument.fillColor = [1, 1, 1];
}

var strArray = new Array();
strArray[0] = 'bing';
strArray[1] = 'wow';

// ----------------------------------------------------------------
// apply settings

layer.property('Source Text').setValue(['bing', 'wryyy']);

// ----------------------------------------------------------------
/* global app */

function getAvItem() {
    var num = app.project.numItems;
    for (var i = 1; i <= num; i++) {
        if (
            app.project.item(i).hasVideo &&
            app.project.item(i).hasAudio &&
            app.project.item(i).typeName == '合成'
        ) {
            return app.project.item(i);
        } else if (i == num) {
            alert('AV compItem not found.');
            return null;
        }
    }
}

function addTextLayer(item) {
    return item.layers.addText('abc');
}

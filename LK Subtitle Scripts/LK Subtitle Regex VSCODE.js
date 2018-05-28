{
    ////////////////////////////////////////////////
    //////////////////   About   ///////////////////
    ////////////////////////////////////////////////

    // LK Subtitle Regex.jsx
    // LK正则匹配工具

    /*
        How to Read My Code?
        ================

        1. Search "TODO" and "FIXME" to see what had not accomplished yet.
        2. Search "TEST" to see which options were under developing mode.
        3. Change "version_env" request to swith between develop-environment and released-environment.
        4. I'd like to keep my code clean, modulary and no grammatical error.
    */

    ////////////////////////////////////////////////
    ///////////////   Data Center   ///////////////
    ///////////////////////////////////////////////

    // ---------------- AEOM Environment ----------------
    /* global $ app timeToCurrentFormat currentFormatToTime */

    var commonFilePath = false;
    var commonVersionEnv = false;

    function DataCenter(request) {
        switch (request) {
            case "commonFilePath":
                return commonFilePath ? commonFilePath : (commonFilePath = initData(request));
            default:
                break;
        }
    }

    function initData(request) {
        switch (request) {
            case "commonFilePath":
                var fileHandle = new File($.fileName);
                return fileHandle.path;
            default:
                break;
        }
    }









}
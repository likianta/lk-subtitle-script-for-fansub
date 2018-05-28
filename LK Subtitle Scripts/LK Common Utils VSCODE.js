{
    // LK Common Utils.jsx

    // ========== LK Log Util ==========
    /* global $ */
    
    /**
     * LK Log Util
     * @param {String} msg what messages you want to print
     * @param {String} cmd where you want to print it
     */
    function lkLog(msg, cmd) {
        
        switch (cmd) {
            case 'c': // execute console.log(msg)
                // FIXME: what's wrong with eslint?
                console.log(msg);
            case 'o': // output.txt
                // TODO:

                break;
            case 'w': // execute writeln(msg)
                $.writeln(msg);
            case 'p': // print log onto LogWindow
                // TODO:

                break;
            default:
                break;
        }

    }
}
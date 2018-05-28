{
    // LK Common Interface Lib.js
    // This Lib is made for handling common models.
    
    // ------------------------- Environment -------------------------
    /* global $ */
    const lang = ['cn', 'en'];
    const versionEnv = ['DEVELOP', 'RELEASE'];
    const localPath = $.filePath;

    // ------------------------- Static -------------------------
    const fileNames = {
        // Toolbar: 'LK SubtitleScript for Fansub' + versionCode,
        Examiner: 'LK Subtitle Examiner.jsx',
        Generator: 'LK Subtitle Generator.jsx',
        Genius: 'LK AE Genius.exe',
        Help: 'LK Help.jsx',
        Import: 'LK Subtitle Import.jsx',
        Loader: 'LK Config Loader.jsx',
        Utils: 'LK Common Utils.jsx'
    };


    function getScript(scriptName) {
        var path = localPath;
        var name = fileNames(scriptName);
        return new File(path + name);
    }
}
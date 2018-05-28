/** 
 @name DecomposeText
 @version 2.0 (05 June 2009)
 @fileoverview
 <h4>Description</h4>  
 <p>This script places each character of the selected text layer on its own layer.</p>
 <h4>Usage</h4>
 <ol>
    <li> In After Effects CS3 or later, run the script 
    <li> Select a text layer  
    <li> Specify the method to use:
        <ul>
            <li> "Preserve characters location" maintains the characters at their current location, but it creates text layers having the same number of characters as the original layer (therefore their anchor point is the same as the original layer's anchor point) 
            <li> "Appropriate anchor point" creates text layers containing only one character (therefore their anchor point is as defined in the Paragraph panel), but it superimposes all text layers at the center of the comp
        </ul>
    <li> Click on "Decompose" to place each character on its own layer
 </ol>
 @author Charles Bordenave
 @location http://www.nabscripts.com/downloads/scripts/DecomposeText.zip
*/


/**
 This class represents the main class of the script;
 it is used to create the user interface which allows to place each character of the selected text layer on its own layer
 @class Main class of the script
*/
function DecomposeText()
{
    // Variable used to keep track of 'this' reference
    var decomposeText = this;
    
    // Create an instance of the utils class to use its functions
    var utils = new DecomposeTextUtils();

    // Script infos
    this.scriptMinSupportVersion = "8.0";
    this.scriptName = "分解文字.jsx";    
    this.scriptVersion = "2.0";
    this.scriptTitle = "分解文字脚本";
    this.scriptCopyright = "展翅鹰汉化 感谢原版作者 Charles Bordenave";
    this.scriptHomepage = "http://blog.sina.com.cn/ykcmgzs";
    this.scriptDescription = {en: "保持字符的位置\" 保持字符在原来的位置, 由于创建的文字层的字符的数量等于原始文字层的字符的数量 (它们的中心点和原始层的中心点是一致的).\\r\\r\"适配中心点\" 创建的文字层只包含一个字符 (它们的中心点被设置在段落的边缘), 因此它创建的文字层在同样的位置.", fr:"Ce script place chaque caractère d\\'un calque texte sur son propre calque.\\r\\rLa méthode \"Préserver la position des caractères\" laisse les caractères à leur position actuelle mais elle crée des calques texte ayant le même nombre de caractères que le calque original (par conséquent leur point d\\'ancrage est le même que celui du calque original).\\r\\rLa méthode \"Point d\\'ancrage approprié\" crée des calques texte contenant un seul caractère (par conséquent leur point d\\'ancrage est comme défini dans le panneau Paragraphe), mais elle superpose tous les calques au centre de la comp."};
    this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), fr:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};        

    // Errors
    this.requirementErr = {en:"This script requires After Effects CS3 or later.", fr:"Ce script nécessite After Effects CS3 ou supérieur."};    
    this.noCompErr = {en:"要有一个合成被激活.", fr:"Une composition doit être active."};
    this.noLayerErr = {en:"只选择一个文字图层.", fr:"Sélectionnez exactement un calque texte."};
    this.badSelLayerErr = {en:"只选择一个文字图层.", fr:"Sélectionnez exactement un calque texte."};

    // UI strings & default settings
    this.aboutBtnName = "关于";
    this.methodStName = {en:"方式:", fr:"Méthode:"};
    this.methodLstChoices = {en:'["保持字符的位置", "适配中心点"]', fr:'["Préserver la position des caractères", "Ancrage approprié"]'};
    this.methodLstSelDflt = 0;
    this.methodLstHlp = {en:"\"保持字符的位置\" 保持字符在原来的位置, 但是创建的文字的层的数量等于原始文字层的字符的数量 (因此它们的中心点和原始层的中心点是一致的).\\r\\r\"适配中心点\" 创建的文字层只包含一个字符 (因此它们的中心点被设置在段落的边缘), 因此它创建的文字层在同样的位置.", fr:"\"Préserver la position des caractères\" maintient les caractères à leur position actuelle, mais cela crée des calques texte ayant le même nombre de caractères que le calque original (par conséquent leur point d\\'ancrage est identique au point d\\'ancrage du calque original).\\r\\r\"Ancrage approprié\" crée des calques texte contenant un seul caractère (par conséquent leur point d\\'ancrage est identique à celui spécifié dans le panneau Paragraphe), mais cela superpose tous les calques texte."};
    this.runBtnName = {en:"分解", fr:"Décompose"};
    /**
     Creates and displays the script interface
     @param {Object} thisObj A Panel object if the script is launched from the Window menu, null otherwise    
    */
    this.buildUI = function (thisObj)
    {
        // dockable panel or palette
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:false});

        // resource specifications
        var res =
        "group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
            gr1: Group { \
                aboutBtn: Button { text:'" + this.aboutBtnName + "', preferredSize:[35,20] } \
            }, \
            gr2: Group { \
                methodSt: StaticText { text:'" + utils.loc(this.methodStName) + "' }, \
                methodLst: DropDownList { properties:{items:" + utils.loc(this.methodLstChoices) + "}, helpTip:'" + utils.loc(this.methodLstHlp) + "' } \
            }, \
            gr3: Group { orientation:'row', alignment:['fill','top'], \
                runBtn: Button { text:'" + utils.loc(this.runBtnName) + "', alignment:['right','center'] } \
            } \
        }"; 
        pal.gr = pal.add(res);
        
        pal.gr.gr2.methodLst.selection = this.methodLstSelDflt;
        
        pal.gr.gr2.methodLst.graphics.foregroundColor = pal.graphics.newPen(pal.graphics.BrushType.SOLID_COLOR, [0,0,0], 1);
        
        // event callbacks
        pal.gr.gr1.aboutBtn.onClick = function () 
        { 
            utils.createAboutDlg(decomposeText.scriptAbout); 
        };

        pal.gr.gr3.runBtn.onClick = function () 
        { 
            decomposeText.decompose(pal); 
        };
                
        // show user interface
        if (pal instanceof Window)
        {
            pal.center();
            pal.show();
        }
        else
        {
            pal.layout.layout(true);
        }       
    };

    /**
     Determines whether the active item is a composition  
     @return True if the active item is not a composition, False otherwise
    */    
    this.checkActiveItem = function () 
    {
        var err = false;
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem))
        {
            err = true;
        }
        return err;
    };   

    /**
     Determines whether a given layer is a text layer  
     @return True if the layer is not a text layer, False otherwise
    */    
    this.checkLayerType = function (layer)
    {
        return !(layer instanceof TextLayer);
    }
    
    /**
     Functional part of the script: places each character of the selected text layer on its own layer 
     @param {Object} pal A palette or a dockable panel containing all user parameters          
    */    
    this.decompose = function (pal)
    {
        try
        {
            var comp = app.project.activeItem;
            var err = this.noCompErr;
            if (this.checkActiveItem(comp)) throw(err);
                    
            var layer = comp.selectedLayers[0];
            var err = this.noLayerErr;
            if (!layer) throw(err);
            
            var err = this.badSelLayerErr;
            if (this.checkLayerType(layer)) throw(err);
            
            var txt = layer.sourceText.value.toString();
        
            app.beginUndoGroup(this.scriptTitle);
            
            for (var i = 0; i < txt.length; i++)
            {
                // "Preserve characters location"        
                if (pal.gr.gr2.methodLst.selection.index == 0)
                {
                    var newLayer = layer.duplicate();
                    newLayer.name = txt.charAt(i);
                    
                    var animator = newLayer.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
                    var opacityProp = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
                    var expressionSelector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
                    opacityProp.setValue(0);
                    expressionSelector.property("ADBE Text Expressible Amount").expression = "selectorValue * (textIndex != " + (i+1) + ");";                    
                }
                // "Appropriate anchor point"
                else 
                {
                    var curChar = txt.charAt(i);
                    if (curChar != ' ')
                    {
                        var newLayer = layer.duplicate();
                        newLayer.sourceText.numKeys ? newLayer.sourceText.setValueAtTime(comp.time,curChar) : newLayer.sourceText.setValue(curChar);
                    }
                }
            }
            
            layer.enabled = false;
            layer.selected = false;                  
                  
            app.endUndoGroup();
        }
        catch(err)
        {
            utils.throwErr(err);
        }                
    };
    
    /**
     Runs the script  
     @param {Object} thisObj A Panel object if the script is launched from the Window menu, null otherwise
    */
    this.run = function (thisObj) 
    {
        if (parseFloat(app.version) < parseFloat(this.scriptMinSupportVersion))
        {
            this.throwErr(this.requirementErr);
        }
        else
        {
            this.buildUI(thisObj);
        }    
    };
}


/**
 This class provides some utility functions used by DecomposeText
 @class Some utility functions grouped in a class
*/
function DecomposeTextUtils()
{
    /**
     String localization function: english and french languages are supported
     @param {Object} str A localization object containing the localized versions of a string    
     @return Appropriate localized version of str
    */    
    this.loc = function (str)
    {
        return app.language == Language.FRENCH ? str.fr : str.en;
    };

    /**
     Displays a window containg a localized error message
     @param {Object} err A localization object containing the localized versions of an error message
    */    
    this.throwErr = function (err)
    {
        var wndTitle = $.fileName.substring($.fileName.lastIndexOf("/")+1, $.fileName.lastIndexOf("."));
        Window.alert("Script error:\r" + this.loc(err), wndTitle, true);
    };            

    /**
     Displays a customized window containg the About text
     @param {String} aboutStr The text to display
    */
    this.createAboutDlg = function (aboutStr)
    {        
        eval(unescape('%20%20%20%20%20%20%20%20/**%20%0D%0A%20%20%20%20%20%20%20%20%20Draw%20some%20random%20rectangles%20%28position%2C%20size%2C%20color%2C%20alpha%29%20on%20the%20window%20background%0D%0A%20%20%20%20%20%20%20%20%20@ignore%20%0D%0A%20%20%20%20%20%20%20%20*/%0D%0A%20%20%20%20%20%20%20%20function%20addNabscriptsBackgroundSignature%28wnd%29%0D%0A%20%20%20%20%20%20%20%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20numRect%20%3D%2024%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20minOpacity%20%3D%200.05%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20maxOpacity%20%3D%200.15%3B%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20leftEdge%20%3D%200%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20topEdge%20%3D%200%3B%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20rightEdge%20%3D%20wnd.windowBounds.width%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20bottomEdge%20%3D%20wnd.windowBounds.height%3B%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20for%20%28var%20i%20%3D%200%20%3B%20i%20%3C%20numRect%3B%20i++%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20xLoc%20%3D%2010%20+%20%28rightEdge%20-%2020%29%20*%20Math.random%28%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20yLoc%20%3D%2010%20+%20%28bottomEdge%20-%2020%29%20*%20Math.random%28%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20width%20%3D%205%20+%2015%20*%20Math.random%28%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20height%20%3D%205%20+%2015%20*%20Math.random%28%29%3B%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20borderWidth%20%3D%201%20+%204%20*%20Math.random%28%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20borderColor%20%3D%20%5BMath.random%28%29%2C%20Math.random%28%29%2C%20Math.random%28%29%2C%20minOpacity%20+%20%28maxOpacity%20-%20minOpacity%29%20*%20Math.random%28%29%5D%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20colorBrush%20%3D%20wnd.graphics.newBrush%28wnd.graphics.BrushType.SOLID_COLOR%2C%20borderColor%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g1%20%3D%20wnd.add%28%22group%22%2C%20%5BxLoc%2C%20yLoc%2C%20xLoc%20+%20width%2C%20yLoc%20+%20borderWidth%5D%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g2%20%3D%20wnd.add%28%22group%22%2C%20%5BxLoc%2C%20yLoc%20+%20height%20-%20borderWidth%2C%20xLoc%20+%20width%2C%20yLoc%20+%20height%5D%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g3%20%3D%20wnd.add%28%22group%22%2C%20%5BxLoc%2C%20yLoc%20+%20borderWidth%2C%20xLoc%20+%20borderWidth%2C%20yLoc%20+%20height%20-%20borderWidth%5D%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g4%20%3D%20wnd.add%28%22group%22%2C%20%5BxLoc%20+%20width%20-%20borderWidth%2C%20yLoc%20+%20borderWidth%2C%20xLoc%20+%20width%2C%20yLoc%20+%20height%20-%20borderWidth%5D%29%3B%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g1.graphics.backgroundColor%20%3D%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g2.graphics.backgroundColor%20%3D%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g3.graphics.backgroundColor%20%3D%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20wnd.g4.graphics.backgroundColor%20%3D%20colorBrush%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%7D%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20var%20dlg%20%3D%20new%20Window%28%22dialog%22%2C%20%22%u5173%u4E8E%22%29%3B%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20//%20panel%20borderStyle%3A%20one%20of%20black%2C%20etched%2C%20gray%2C%20raised%2C%20sunken.%20Default%20is%20etched.%0D%0A%20%20%20%20%20%20%20%20//%20resource%20specifications%0D%0A%20%20%20%20%20%20%20%20var%20res%20%3D%0D%0A%20%20%20%20%20%20%20%20%22group%20%7B%20orientation%3A%27column%27%2C%20alignment%3A%5B%27fill%27%2C%27fill%27%5D%2C%20%5C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20aboutPnl%3A%20Panel%20%7B%20properties%3A%7B%20borderStyle%3A%27sunken%27%20%7D%2C%20%5C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20aboutEt%3A%20EditText%20%7B%20text%3A%27%22%20+%20this.loc%28aboutStr%29%20+%20%22%27%2C%20properties%3A%7Bmultiline%3Atrue%7D%2C%20preferredSize%3A%5B280%2C150%5D%2C%20alignment%3A%5B%27right%27%2C%27center%27%5D%20%7D%20%5C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%5C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20btnsGr%3A%20Group%20%7B%20alignment%3A%5B%27fill%27%2C%27fill%27%5D%2C%20%5C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20visitBtn%3A%20Button%20%7B%20text%3A%27%u6211%u7684%u535A%u5BA2%27%2C%20alignment%3A%5B%27left%27%2C%27center%27%5D%20%7D%2C%20%5C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20okBtn%3A%20Button%20%7B%20text%3A%27Ok%27%2C%20alignment%3A%5B%27right%27%2C%27center%27%5D%20%7D%20%5C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%5C%0D%0A%20%20%20%20%20%20%20%20%7D%22%3B%20%0D%0A%20%20%20%20%20%20%20%20dlg.gr%20%3D%20dlg.add%28res%29%3B%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20//%20on%20Mac%20we%20can%20disable%20edit%20text%20while%20allowing%20scrolling%2C%20on%20Windows%20we%20can%27t%0D%0A%20%20%20%20%20%20%20%20dlg.gr.aboutPnl.aboutEt.enabled%20%3D%20%28%24.os.indexOf%28%22Win%22%29%20%21%3D%20-1%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20//%20draw%20random%20background%20color%20%28grayscale%29%0D%0A%20%20%20%20%20%20%20%20if%20%28parseFloat%28app.version%29%20%3E%3D%209.0%29%20//%20CS4%20or%20later%0D%0A%20%20%20%20%20%20%20%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20whiteBrush%20%3D%20dlg.graphics.newBrush%28dlg.graphics.BrushType.SOLID_COLOR%2C%20%5B1%2C%201%2C%201%2C%201%5D%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20rand%20%3D%20Math.random%28%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20bgBrush%20%3D%20dlg.graphics.newBrush%28dlg.graphics.BrushType.SOLID_COLOR%2C%20%5Brand%2C%20rand%2C%20rand%2C%201%5D%29%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20dlg.graphics.backgroundColor%20%3D%20bgBrush%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20dlg.gr.aboutPnl.graphics.backgroundColor%20%3D%20whiteBrush%3B%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20dlg.layout.layout%28true%29%3B%20//%20to%20get%20window%20bounds%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20addNabscriptsBackgroundSignature%28dlg%29%3B%0D%0A%20%20%20%20%20%20%20%20%7D%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20dlg.gr.btnsGr.okBtn.onClick%20%3D%20function%20%28%29%20%7B%20dlg.close%28%29%3B%20%7D%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20//%20open%20homepage%20url%0D%0A%20%20%20%20%20%20%20%20dlg.gr.btnsGr.visitBtn.onClick%20%3D%20function%20%28%29%20%0D%0A%20%20%20%20%20%20%20%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20cmd%20%3D%20%22%22%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20url%20%3D%20%22http%3A//blog.sina.com.cn/ykcmgzs/%22%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20%28%24.os.indexOf%28%22Win%22%29%20%21%3D%20-1%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20%28File%28%22C%3A/Program%20Files/Mozilla%20Firefox/firefox.exe%22%29.exists%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0D%0A%09%09%09%09%09cmd%20+%3D%20%22C%3A/Program%20Files/Mozilla%20Firefox/firefox.exe%20%22%20+%20url%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20else%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%09cmd%20+%3D%20%22C%3A/Program%20Files/Internet%20Explorer/iexplore.exe%20%22%20+%20url%3B%0D%0A%09%09%09%09%7D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20else%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%09cmd%20+%3D%20%22open%20%5C%22%22%20+%20url%20+%20%22%5C%22%22%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20try%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0D%0A%09%09%09%09system.callSystem%28cmd%29%3B%0D%0A%09%09%09%7D%0D%0A%09%09%09catch%28e%29%0D%0A%09%09%09%7B%0D%0A%09%09%09%09alert%28e%29%3B%0D%0A%09%09%09%7D%0D%0A%20%20%20%20%20%20%20%20%7D%0D%0A%20%20%20%20%20%20%20%20%0D%0A%20%20%20%20%20%20%20%20dlg.center%28%29%3B%0D%0A%20%20%20%20%20%20%20%20dlg.show%28%29%3B'));
    };
}


/**
 Creates an instance of the main class and run it
*/
new DecomposeText().run(this);

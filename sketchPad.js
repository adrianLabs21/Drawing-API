/**
 * sketch pad literal
 * @author Adrian Labastida
 */
var oSketchPad = (function(){
    /**
     * canvas element
     * @type Object
     */
    var oSketchPad = {};
    
    /**
     * div element
     * @type Object
     */
    var oSketchContainer = {};
    
    /**
     * canvas constext
     * @type Object
     */
    var oContext = {};
    
    /**
     * context type
     * @type String
     */
    var sContext = '';
    
    /**
     * clear button
     * @type Object
     */
    var oClearRectBtn = {};
    
    /**
     * current Width
     * @type Number
     */
    var iCurWidth = 0;
    
    /**
     * current height
     * @type Number
     */
    var iCurHeight = 0;
    
    /**
     * brush
     * @type Object
     */
    var oBrush = {};
    
    /**
     * sketch surface
     * @type Object
     */
    var oSketchSurface = {};
    
    /**
     * stroke set
     * @type Array
     */
    var aStroke = [];
    
    /**
     * current stroke
     * @type Object
     */
    var oCurrentStroke = null;
    
    /**
     * undo button
     * @type Object
     */
    var oUndoBtn = {};
    
    /**
     * redo button
     * @type Object
     */
    var oRedoBtn = {};
    
    /**
     * history set
     * @type Array
     */
    var aHistory = [];
    
    /**
     * initialize this literal
     * @param {String} sCont
     * @returns {void}
     */
    initSketch = function (sCont)
    {
        sContext = sCont;
        cacheSketchDom();
        applyDimension();
        createContext();
        bindSketchEvents();
        
        oBrush['x'] = 0;
        oBrush['y'] = 0;
        oBrush['color'] = '#000000';
        oBrush['iSize'] = 1;
        oBrush['bIsMouseDown'] = false;
    };
    
    /**
     * caches objects
     * @returns {void}
     */
    cacheSketchDom = function ()
    {
        oSketchContainer = $('#canvasDiv');
        oSketchPad = document.getElementById('sketchPad');
        oClearRectBtn = $('#clearRect');
        oSketchSurface = $('#sketchPad');
        oUndoBtn = $('#undo');
        oRedoBtn = $('#redo');
    };
    
    /**
     * binds events 
     * @returns {void}
     */
    bindSketchEvents = function ()
    {
        oClearRectBtn.click(doClearRect);
        oUndoBtn.click(undoDrawing);
        oRedoBtn.click(redoDrawing);
        oSketchSurface.mousedown(onBrushDown).mouseup(onBrushUp).mousemove(onBrushMove);
    };
    
    /**
     * brush touches down
     * @param {listener} e
     * @returns {void}
     */
    onBrushDown = function (e)
    {
        oBrush.bIsMouseDown = true;
        oCurrentStroke = {
            color: oBrush.color,
            size: oBrush.iSize,
            points: []
        };
        aStroke.push(oCurrentStroke);
        draw(e);
    };
    
    /**
     * brush touch up
     * @param {listener} e
     * @returns {void}
     */
    onBrushUp = function (e)
    {
        oBrush.bIsMouseDown = false;        
        draw(e);
        oCurrentStroke = null;
    };
    
    /**
     * brush is on move
     * @param {listener} e
     * @returns {void}
     */
    onBrushMove = function (e)
    {
        if (oBrush.bIsMouseDown === true) {
            draw(e);
        }
    };
    
    /**
     * creates context for canvas element
     * @returns {void}
     */
    createContext = function ()
    {
        oContext = oSketchPad.getContext(sContext);
    };
    
    /**
     * add dimension
     * @returns {void}
     */
    applyDimension = function ()
    {
        iCurWidth = window.innerWidth;
        iCurHeight = window.innerHeight;
        oSketchPad.width = iCurWidth;
        oSketchPad.height = iCurHeight;        
    };
    
    /**
     * clears canvas
     * @returns {void}
     */
    doClearRect = function ()
    {
        oContext.clearRect(0, 0, iCurWidth, iCurHeight);
        aStroke = [];
    };
    
    /**
     * checks if there is drawing
     * @returns {Boolean}
     */
    hasDrawing = function()
    {
        if (aStroke.length === 0) {
            alert('draw something first!');
            return false;
        }
        return true;
    };
    
    /**
     * checks if there is in history
     * @returns {Boolean}
     */
    hasHistory = function()
    {
        if (aHistory.length === 0) {
            alert('Nothing on clipboard');
            return false;
        }
        return true;        
    };
    
    /**
     * undo recent drawing
     * @returns {void}
     */
    undoDrawing = function ()
    {
        if (hasDrawing() === false) {
            return false;
        }
        var iLastIndex = aStroke.length - 1;
        aHistory.push(aStroke[iLastIndex]);
        aStroke.splice(iLastIndex, 1);
        renderDrawing();
    };
    
    /**
     * redo recent drawing
     * @returns {void}
     */
    redoDrawing = function ()
    {
        if (hasHistory() === false) {
            return false;
        }
        var oFirstHist = aHistory[0];
        aStroke.push(oFirstHist);
        aHistory.splice(0, 1);
        renderDrawing();
    };
    
    /**
     * creates points
     * @param {Object} eventContent
     * @returns {void}
     */
    draw = function (eventContent)
    {
        oBrush.x = eventContent.pageX;
        oBrush.y = eventContent.pageY;

        oCurrentStroke.points.push({
            x: oBrush.x,
            y: oBrush.y
        });
        
        renderDrawing();        
    };
    
    /**
     * present drawing
     * @param {Array} aHist history to render
     * @returns {void}
     */
    renderDrawing = function (aHist)
    {
        oContext.clearRect(0, 0, iCurWidth, iCurHeight);
        oContext.lineCap = 'round';
        var aStrokeList = (typeof aHist === 'undefined') ? aStroke : aHist;
        for (var iCounter = 0; iCounter < aStrokeList.length; iCounter++) {
            var oStroke = aStrokeList[iCounter];
            oContext.strokeStyle = oStroke.color;
            oContext.lineWidth = oStroke.size;
            oContext.beginPath();
            oContext.moveTo(oStroke.points[0]['x'], oStroke.points[0]['y']);
            for (var iPointCounter = 0; iPointCounter < oStroke.points.length; iPointCounter++) {
                var aPoint = oStroke.points[iPointCounter];
                oContext.lineTo(aPoint['x'], aPoint['y']);
            }
            oContext.stroke();
        }
    };
    
    /**
     * revealer
     */
    return {
        'initSketch': initSketch
    };
})();
oSketchPad.initSketch('2d');

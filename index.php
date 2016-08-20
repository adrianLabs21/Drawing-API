<?php
//echo '<pre>';
//print_r(getimagesize('newj.ico'));
//exit;
?>
<!DOCTYPE>
<html>
    <head>
        <title>Sample</title>
    </head>
    <body>
        <div id="iconsLinks">
            <link rel="shortcut icon" type="image/jpeg" href="newj.ico">
        </div>
        <div id='controls'>
            <button type="button" id='save'>Save</button>
            <button type="button" id='undo'>Undo</button>
            <button type="button" id='redo'>Redo</button>
            <button type="button" id='clearRect'>Clear</button>
        </div>
        <div id='canvasDiv'>
            <canvas id='sketchPad'></canvas>
        </div>
    </body>
    <script src="jquery.js"></script>
    <script src="linking.js"></script>
    <script src="sketchPad.js"></script>
</html>

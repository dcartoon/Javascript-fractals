var Fractal = function (canvasSelector) {
    var that = this;

    that.palette = [ "rgb(12,2,27)",
                                     "rgb(20,3,40)",
                                     "rgb(27,5,54)",
                                     "rgb(44,9,87)", 
                                     "rgb(74,13,148)",
                                     "rgb(23,13,227)",
                                     "rgb(111,23,227)",
                                     "rgb(23,60,227)",
                                     "rgb(23,145,227)",
                                     "rgb(23,227,118)",
                                     "rgb(23,227,26)",
                                     "rgb(255,251,5)", 
                                     "rgb(12,242,16)", 
                                     "rgb(163,219,9)",
                                     "rgb(9,219,12)",
                                     "rgb(105,140,10)",
                                     "rgb(140,116,10)",
                                     "rgb(140,79,10)",
                                     "rgb(140,10,10)"];
    
    var execTimes = [];
    var execCounter = 1;
    var maxExecs = 1;

    var startDt = null;
    var endDt = null;

    that.ctx = document.getElementById('canvas').getContext('2d');
    that.canvasWidth = document.getElementById('canvas').width;
    that.canvasHeight = document.getElementById('canvas').height;

    that.renderer = null;

    var xMin = -2.5;
    var xMax = 1;
    var yMin = -1;
    var yMax = 1;
    var zoom = 8.0;

    jQuery(canvasSelector).click(function (event) {
        var clickX = event.pageX - this.offsetLeft;
        var clickY = event.pageY - this.offsetTop;

        var deltaX = Math.abs(xMax - xMin);
        var deltaY = Math.abs(yMax - yMin);

        var y0 = (clickY / that.canvasHeight) * deltaY - Math.abs(yMin);
        var x0 = (clickX / that.canvasWidth) * deltaX - Math.abs(xMin);

        deltaX /= zoom;
        deltaY /= zoom;

        xMin = x0 - Math.abs(deltaX) / 2.0;
        xMax = x0 + Math.abs(deltaX) / 2.0;
        yMin = y0 - Math.abs(deltaY) / 2.0;
        yMax = y0 + Math.abs(deltaY) / 2.0;

        reset();
        that.render();
    });

    var reset = function () {
        that.ctx.fillStyle = "rgb(255,255,255)";
        that.ctx.fillRect(0, 0, that.canvasWidth, that.canvasHeight);
    }

    var onRenderComplete = function () {
        endDt = new Date();
        var diff = endDt - startDt;
        execTimes.push(diff);

        if(execCounter < maxExecs) {
            execCounter++;
            reset();
            that.render();
        }
        else {
            console.log(execTimes);
        }
    };

    that.render = function () {
        if(!that.renderer) {
            alert('Renderer not defined');
            return;
        }

        startDt = new Date();
        that.renderer.draw(xMin, xMax, yMin, yMax, onRenderComplete);
    }
};

var MandelbrotRenderer = function (context) {
    var that = this;

    that.draw = function (xMin, xMax, yMin, yMax, onRenderComplete) {
        drawIteration(0, xMin, xMax, yMin, yMax, context.canvasWidth, context.canvasHeight, 
                                    onRenderComplete);
    };

    //Zn+1 = Zn^2 + C
    var drawIteration = function (row, xMin, xMax, yMin, yMax, canvasWidth, canvasHeight,
                                                                onRenderComplete) {
        var deltaX = Math.abs(xMax - xMin);
        var deltaY = Math.abs(yMax - yMin);
        var width = canvasWidth;
        var height = canvasHeight;

        var y0 = (row / height) * deltaY - Math.abs(yMin);
        var maxIter = 100;
        var color;
        var x0, x, iter, xSquared, ySquared;
        for (var col = 0; col < width; col++) {
            x0 = (col / width) * deltaX - Math.abs(xMin);
            x = 0, y = 0, iter = 0, xSquared = 0, ySquared = 0;

            while((iter < maxIter) && ((xSquared + ySquared) <= 4)) {
                var xtemp = xSquared - ySquared + x0;
                y = 2*x*y + y0;
                x = xtemp;
                iter = iter + 1;
                xSquared = x * x;
                ySquared = y * y;
            }
            
            if(iter < maxIter) {
                var paletteIndex = iter % context.palette.length;
                color = context.palette[paletteIndex];
            }
            else {
                color = "rgb(0,0,0)";
            }

            context.ctx.fillStyle = color;
            context.ctx.fillRect(col, row, 1, 1);
        }
        
        if(row < height) {
            setTimeout(function() { 
                drawIteration(row + 1, xMin, xMax, yMin, yMax, canvasWidth, canvasHeight,
                                            onRenderComplete);
            },0);
            return;
        }
        else {
            onRenderComplete();
        }
    }
    return that;
};

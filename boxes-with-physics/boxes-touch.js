(function ($) {
    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                
                //Check if the object is hitting a wall and reposition it accordingly
                touch.target.leftPosOld = touch.target.leftPos;
                touch.target.topPosOld = touch.target.topPos;              
                
                touch.target.leftPos = touch.pageX - touch.target.deltaX
                touch.target.topPos = touch.pageY - touch.target.deltaY
                
                if (touch.target.leftPos >= windowWidth-20 ){ touch.target.leftPos = windowWidth-20;}
                if (touch.target.leftPos < 0){touch.target.leftPos = 0;}
                if (touch.target.topPos >= windowHeight-20 ){ touch.target.topPos = windowHeight-20;}
                if (touch.target.topPos < 0){touch.target.topPos = 0;}
                
                document.getElementById("console").innerHTML = "";
                document.getElementById("console").appendChild(document.createTextNode( "("+touch.target.leftPos+", "+touch.target.topPos+") "+"("+windowWidth+", "+windowHeight+")"));
                
                touch.target.movingBox.offset({ 
                    left: touch.target.leftPos,
                    top: touch.target.topPos
                });
            }
        });

        // Don't do any touch scrolling.
        event.preventDefault();
    };

    /**
     * Concludes a drawing or moving sequence.
     */
    var endDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                touch.target.movingBox.flick = true;
                xVelocity=touch.target.leftPos-touch.target.leftPosOld;
                yVelocity=touch.target.topPos-touch.target.topPosOld;
                
                oldTimestamp = 0;
                window.requestAnimationFrame(flickBoxes);
            }
        });
    };
    
    
    
    var flickBoxes = function(timestamp){
        $("div.box").each(function (index) {
            
            var delta = timestamp - oldTimestamp;  

            if($(this).context.movingBox !== undefined && $(this).context.movingBox.flick ==true){
                var target = $(this).context.movingBox;     
                //console.log(delta);
                if(delta>10){                     
                    

                    if(xVelocity !== 0){
                        xVelocity = (xVelocity>0) ? xVelocity-1 : xVelocity+1;
                    }
                    if(yVelocity !== 0){
                        yVelocity = (yVelocity>0) ? yVelocity-1 : yVelocity+1;
                    }
                    if(xVelocity === 0 && yVelocity === 0){
                        target.flick = false;
                    }

                    
                    if (target.offset().left >= windowWidth-20){
                        xVelocity = Math.abs(xVelocity)*-1;
                    }else if (target.offset().left < 0){
                        xVelocity = Math.abs(xVelocity);
                    }if (target.offset().top >= windowHeight-20){
                        yVelocity = Math.abs(yVelocity)*-1;
                    }else if (target.offset().top < 0){ 
                        yVelocity = Math.abs(yVelocity);
                    }
                    
                    
                    target.offset({
                        left:target.offset().left + xVelocity,
                        top:target.offset().top + yVelocity
                    });
                    
         
                }
                
                oldTimestamp = timestamp;
            }
        });
        
        window.requestAnimationFrame(flickBoxes);
    }

    /**
     * Indicates that an element is unhighlighted.
     */
    var unhighlight = function () {
        $(this).removeClass("box-highlight");
    };

    /**
     * Begins a box move sequence.
     */
    var startMove = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    };

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    var setDrawingArea = function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior and the bounding box.
 
        windowHeight = (window.innerHeight > 0) ? window.innerHeight-35 : screen.height-35;
        windowWidth = (window.innerWidth > 0) ? window.innerWidth-15 : screen.width-15;    
        document.getElementById("windowBorder").style.width = windowWidth+ "px"; 
        document.getElementById("windowBorder").style.height = windowHeight + "px";
        document.getElementById("windowBorder").style.border = "thin solid black";

        
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchmove", trackDrag, false);
                element.addEventListener("touchend", endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", startMove, false);
                element.addEventListener("touchend", unhighlight, false);
            });
    };

    $.fn.boxesTouch = function () {
        setDrawingArea(this);
    };
}(jQuery));

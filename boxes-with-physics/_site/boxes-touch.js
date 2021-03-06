(function($) {
    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function(event) {
        $.each(event.changedTouches, function(index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {

                //Check if the object is hitting a wall and reposition it accordingly
                touch.target.leftPosOld = touch.target.leftPos;
                touch.target.topPosOld = touch.target.topPos;

                touch.target.leftPos = touch.pageX - touch.target.deltaX
                touch.target.topPos = touch.pageY - touch.target.deltaY

                if (touch.target.leftPos >= window.windowWidth - 20) {
                    touch.target.leftPos = window.windowWidth - 20;
                }
                if (touch.target.leftPos < 0) {
                    touch.target.leftPos = 0;
                }
                if (touch.target.topPos >= window.windowHeight - 20) {
                    touch.target.topPos = window.windowHeight - 20;
                }
                if (touch.target.topPos < 0) {
                    touch.target.topPos = 0;
                }

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
    var endDrag = function(event) {
        $.each(event.changedTouches, function(index, touch) {
            if (touch.target.movingBox) {

                touch.target.movingBox.flick = true;
                touch.target.movingBox.xVelocity = touch.target.leftPos - touch.target.leftPosOld;
                touch.target.movingBox.yVelocity = touch.target.topPos - touch.target.topPosOld;

            }
        });
    };


    var moveBoxes = function(box) {
        if (box.context.movingBox !== undefined) {
            var target = box.context.movingBox;

            target.offset({
                left: target.offset().left + target.xVelocity - target.gravityX,
                top: target.offset().top + target.yVelocity + target.gravityY
            });
        }
    };


    var animateBoxes = function(timestamp) {
        var delta = timestamp - window.oldTimestamp;

        if (delta > 10) {
            $("div.box").each(function(index) {
                flickBoxes($(this));
                moveBoxes($(this))
            });
        }

        window.oldTimestamp = timestamp;
        window.requestAnimationFrame(animateBoxes);
    };

    window.ondevicemotion = function(event) {
        $("div.box").each(function(index) {
            if ($(this).context.movingBox !== undefined) {
                var target = $(this).context.movingBox;

                if (target.offset().left < window.windowWidth - 20 && event.accelerationIncludingGravity.x < 0) {
                    target.gravityX = event.accelerationIncludingGravity.x;
                } else if (target.offset().left > 0 && event.accelerationIncludingGravity.x > 0) {
                    target.gravityX = event.accelerationIncludingGravity.x;
                } else {
                    target.gravityX = 0;
                }
                if (target.offset().top < window.windowHeight - 20 && event.accelerationIncludingGravity.y > 0) {
                    target.gravityY = event.accelerationIncludingGravity.y;
                } else if (target.offset().top > 0 && event.accelerationIncludingGravity.y < 0) {
                    target.gravityY = event.accelerationIncludingGravity.y;
                } else {
                    target.gravityY = 0;
                }


            }
        });

    };

    var flickBoxes = function(box) {
        if (box.context.movingBox !== undefined && box.context.movingBox.flick === true) {
            var target = box.context.movingBox;

            if (target.xVelocity !== 0) {
                target.xVelocity = (target.xVelocity > 0) ? target.xVelocity - 1 : target.xVelocity + 1;
            }
            if (target.yVelocity !== 0) {
                target.yVelocity = (target.yVelocity > 0) ? target.yVelocity - 1 : target.yVelocity + 1;
            }
            if (target.xVelocity === 0 && target.yVelocity === 0) {
                target.flick = false;
            }

            if (target.offset().left >= window.windowWidth - 20) {
                target.xVelocity = Math.abs(target.xVelocity) * -1;
            } else if (target.offset().left < 0) {
                target.xVelocity = Math.abs(target.xVelocity);
            }
            if (target.offset().top >= window.windowHeight - 20) {
                target.yVelocity = Math.abs(target.yVelocity) * -1;
            } else if (target.offset().top < 0) {
                target.yVelocity = Math.abs(target.yVelocity);
            }

        }
    };

    /**
     * Indicates that an element is unhighlighted.
     */
    var unhighlight = function() {
        $(this).removeClass("box-highlight");
    };

    /**
     * Begins a box move sequence.
     */
    var startMove = function(event) {
        $.each(event.changedTouches, function(index, touch) {
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
            touch.target.movingBox.gravityX = 0;
            touch.target.movingBox.gravityY = 0;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    };

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    var setDrawingArea = function(jQueryElements) {


        // Set up any pre-existing box elements for touch behavior and the bounding box.
        window.oldTimestamp = 0;
        window.requestAnimationFrame(animateBoxes);

        window.windowHeight = (window.innerHeight > 0) ? window.innerHeight - 35 : screen.height - 35;
        window.windowWidth = (window.innerWidth > 0) ? window.innerWidth - 15 : screen.width - 15;
        document.getElementById("windowBorder").style.width = window.windowWidth + "px";
        document.getElementById("windowBorder").style.height = window.windowHeight + "px";
        document.getElementById("windowBorder").style.border = "thin solid black";


        jQueryElements
            .addClass("drawing-area")

        // Event handler setup must be low-level because jQuery
        // doesn't relay touch-specific event properties.
        .each(function(index, element) {
            element.addEventListener("touchmove", trackDrag, false);
            element.addEventListener("touchend", endDrag, false);
        })

        .find("div.box").each(function(index, element) {
            element.addEventListener("touchstart", startMove, false);
            element.addEventListener("touchend", unhighlight, false);
        });
    };

    $.fn.boxesTouch = function() {
        setDrawingArea(this);
    };
}(jQuery));
(function ($) {
    
    var dragImage;
    
    var moveObject = function (event) {
        dragImage.offset({left: event.pageX, top: event.pageY });
    };
    
    var unbindObject = function (event) {
        dragImage.remove();
        $("body").unbind("mousemove", moveObject);
    };
    
    $.fn.dragAndDrop = function () {
        
        this.mousedown(function (event) {
            
            makeUnselectable($(this));
            
            dragImage = $(event.target).clone();
            dragImage.addClass("dragClone");
            dragImage.offset({left: event.pageX, top: event.pageY });
            
            $("body").append(dragImage);
            $("body").mousemove(moveObject);
            
        });
        
        $("body").mouseup(unbindObject);
    };
    
    var makeUnselectable = function( $target ) {
    $target
        .addClass( 'unselectable' ) // All these attributes are inheritable
        .attr( 'unselectable', 'on' ) // For IE9 - This property is not inherited, needs to be placed onto everything
        .attr( 'draggable', 'false' ) // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set, it's like these properties are mutually exclusive, seems to be a bug.
        .attr('style', "-moz-user-select: none;")
        .on( 'dragstart', function() { return false; } );  // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none' is applied to the CSS 
        
    };
    
}(jQuery));
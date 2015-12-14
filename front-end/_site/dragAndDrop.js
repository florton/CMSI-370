(function ($) {
    
    var dragImage;
    var target;
    var callback;
    var selectedBox;
    
    var moveObject = function (event) {
        dragImage.offset({
            left: event.pageX-dragImage[0].width/2,
            top: event.pageY-dragImage[0].height/2 
        });
    };
    
    var unbindObject = function (event) {
        dragImage.remove();
        $("body").unbind("mousemove", moveObject);
        selectedBox = null;
    };
    
    var createImage = function (event) {
        selectedBox = $(event.target);
        dragImage = $(event.target).clone();
        dragImage[0].width = $(event.target)[0].width;
        dragImage[0].height = $(event.target)[0].height;
   
        $("body").append(dragImage);
        dragImage.offset({
            left: event.pageX-dragImage[0].width/2,
            top: event.pageY-dragImage[0].height/2 
        });     
        $("body").mousemove(moveObject);
    };
    
    var dropImage = function (event) {
        var dropZone = $("#"+target)[0];
        if(event.pageX>dropZone.x && event.pageX<dropZone.x+dropZone.width){
            if(event.pageY>dropZone.y && event.pageY<dropZone.y+dropZone.height){
                if(selectedBox !== null){
                    callback(selectedBox);
                }
            }
        }        
        unbindObject(event);
    }
    
    $.fn.dragAndDrop = function (targ, func) {
        callback=func;
        target = targ;
        selectedBox = $(this);
        
        makeUnselectable($(this));
        this.mousedown(createImage);
        $("body").mouseup(dropImage);
    };
    
    var makeUnselectable = function( $target ) {
    $target
        .addClass( 'unselectable' )
        .attr( 'unselectable', 'on' ) 
        .attr( 'draggable', 'false' ) 
        .attr('style', "-moz-user-select: none;")
        .on( 'dragstart', function() { return false; } );  
        
    };
    
}(jQuery));
(function ($) {
    
    var dragImage;
    
    var moveObject = function (event) {
        dragImage.offset({
            left: event.pageX-dragImage[0].width/2,
            top: event.pageY-dragImage[0].height/2 
        });
    };
    
    var unbindObject = function (event) {
        dragImage.remove();
        $("body").unbind("mousemove", moveObject);
    };
    
    $.fn.dragAndDrop = function (height, width, target) {
        
        makeUnselectable($(this));
        
        this.mousedown(function (event) {
            
            dragImage = $(event.target).clone();
            console.log(dragImage)
            //dragImage.addClass("dragClone");
            dragImage[0].width = $(event.target)[0].width;
            dragImage[0].height = $(event.target)[0].height;
            console.log(dragImage[0].width/2 + " " +dragImage[0].height/2)
       
            $("body").append(dragImage);
            dragImage.offset({
                left: event.pageX-dragImage[0].width/2,
                top: event.pageY-dragImage[0].height/2 
            });     
            $("body").mousemove(moveObject);
            
        });
        
        $("body").mouseup(unbindObject);
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
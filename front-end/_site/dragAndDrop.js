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
            dragImage = $(event.target).clone();
            dragImage.addClass("dragClone");
            dragImage.offset({left: event.pageX, top: event.pageY });
            
            $("body").append(dragImage);
            $("bosy").mousemove(moveObject);
            
            dragImage.mouseup(unbindObject);
        });
    };
    
}(jQuery));
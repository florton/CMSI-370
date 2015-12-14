(function($) {

    var dragImage;
    var targets;
    var callback;
    var selectedBox;

    var moveObject = function(event) {
        dragImage.offset({
            left: event.pageX - dragImage.width()/2,
            top: event.pageY - dragImage.height()/2
        });
    };

    var unbindObject = function(event) {
        dragImage.remove();
        $("body").unbind("mousemove", moveObject);
        selectedBox = null;
    };

    var createImage = function(event) {
        selectedBox = $(event.target);
        dragImage = $(event.target).clone();
        dragImage.width($(event.target).width());
        dragImage.height($(event.target).height());
        
        $("body").append(dragImage);
        dragImage.offset({
            left: event.pageX - dragImage.width() / 2,
            top: event.pageY - dragImage.height() / 2
        });
        $("body").mousemove(moveObject);
    };

    var dropImage = function(event) {
        for (var i = 0; i < targets.length; i++) {
            var dropZone = targets[i];
            if (event.pageX > dropZone.offset().left && event.pageX < dropZone.offset().left + dropZone.width()) {
                if (event.pageY > dropZone.offset().top && event.pageY < dropZone.offset().top + dropZone.height()) {
                    if (selectedBox !== null) {
                        callback(selectedBox);
                        break;
                    }
                }
            }
        }
        unbindObject(event);
    }

    $.fn.dragAndDrop = function() {
        targets = Array.prototype.slice.call(arguments, 0);
        callback = targets.pop();
        //makeUnselectable($(this));
        this.mousedown(createImage);
        $("body").mouseup(dropImage);
    };

    var makeUnselectable = function($target) {
        $target
            .addClass('unselectable')
            .attr('unselectable', 'on')
            .attr('draggable', 'false')
            .attr('style', "-moz-user-select: none;")
            .on('dragstart', function() {
                return false;
            });

    };

}(jQuery));
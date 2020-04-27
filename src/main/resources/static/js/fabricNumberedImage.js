fabric.NumberedImage = fabric.util.createClass(fabric.Image, {
    type: 'numbered-image',
    initialize: function(element, options) {
        this.callSuper('initialize', element, options);
        options && this.set('name', options.name);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), { id: this.id });
    }
});

fabric.NumberedImage.fromObject = function(object, callback) {
    fabric.util.loadImage(object.src, function(img) {
        callback && callback(new fabric.NumberedImage(img, object));
    });
};

fabric.NumberedImage.async = true;
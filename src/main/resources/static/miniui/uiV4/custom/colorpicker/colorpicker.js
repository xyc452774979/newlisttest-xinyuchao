ColorPicker = function () {

    ColorPicker.superclass.constructor.call(this);


}

mini.extend(ColorPicker, mini.Control, {

    uiCls: "uc-colorpicker",
    _create: function () {
        this.el = document.createElement('div');
        this.el.innerHTML = '<input/>';
                
        $(this.el.firstChild).spectrum({
            color: "#f00",
            change: function (color) {
                alert(color);
            }
        });
    },
    setValue: function (value) {
        $(this.el.firstChild).spectrum("set", value);
    },
    getValue: function () {
        var value = $(this.el.firstChild).spectrum("get");
        return value;
    }

});
mini.regClass(ColorPicker, "colorpicker");
ColorPicker = function () {

	ColorPicker.superclass.constructor.call(this);
	
}

mini.extend(ColorPicker, mini.Control, {
	aa: "123",
	uiCls: "uc-colorpicker",

	firstSet: false,

	set: function (kv) {

		ColorPicker.superclass.set.call(this, kv);

		if (!this.firstSet) {
			this.firstSet = true;
			this.initComponents();
		}

		return this;
	},
	
	_create: function () {
		var sf = this;
		sf.el = document.createElement('div');
		sf.el.innerHTML = '<input/>';

	},

	initComponents: function () {
		var sf = this;
	//	alert(sf.aa)
		$(sf.el.firstChild).spectrum({
			color: "#f00",
			change: function (color) {
				alert(color);
			}
		});
	},

	//	setAa: function (value) {
	//		this.aa = value;
	//		

	//	},
	//	getAa: function () {
	//		return this.aa;
	//	},
	setValue: function (value) {
		$(this.el.firstChild).spectrum("set", value);
	},
	getValue: function () {
		var value = $(this.el.firstChild).spectrum("get");
		return value;
	},
	getAttrs: function (el) {
		var attrs = ColorPicker.superclass.getAttrs.call(this, el);
		mini._ParseString(el, attrs,
            ["aa"]
        );

		return attrs;
	}

});
mini.regClass(ColorPicker, "colorpicker");
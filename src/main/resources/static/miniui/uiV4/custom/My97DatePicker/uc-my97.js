﻿DatePicker = function () {
    DatePicker.superclass.constructor.call(this);
}

mini.extend(DatePicker, mini.Control, {
    format: undefined,
    formField:true,
    value: undefined,
    set: function (kv) {
        DatePicker.superclass.set.call(this, kv);
        if (kv.value) {
            this.value = kv.value;
            delete kv.value;
        }
        this.initComponents();
        return this;
    },
    uiCls: "uc-datepicker",
    _create: function () {
        var sf = this;
        sf.el = document.createElement('div');
        sf.el.innerHTML = '<input style="width:95%" class="Wdate"/>';
        sf.el.firstChild.onfocus = function (e) {6
        	if(sf.my97param){
        		WdatePicker(eval("("+sf.my97param+")"));
        	} else {
        		WdatePicker();
        	}
        	
        }
    },
    initComponents: function () {
        this.setValue(this.value);
    },
    setValue: function (value) {
    	var date;
    	if(value instanceof Date){
    		date = value;
    	} else {
    		date = mini.parseDate(value);
    	}
    	this.value = date;
    	
    	var formatDate;
    	if(this.format){
    		formatDate = mini.formatDate(date, this.format);
    	}else{
    		formatDate = mini.formatDate(date, "yyyy-MM-dd");
    	}
    	$(this.el.firstChild).val(formatDate);
    },
    getValue: function () {
    	var value = $(this.el.firstChild).val();
   		var date = mini.parseDate(value);
   		return date;
    },
    getFormValue: function () {
    	return this.getValue();
    },
    getAttrs: function (el) {
        var attrs = DatePicker.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            ["format", "value", "my97param"]
        );
        return attrs;
    }

});
mini.regClass(DatePicker, "uc-datepicker");
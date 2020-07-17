/**
* jQuery MiniUI v3.0
* 
* Web Site : http://www.miniui.com
*
* Commercial License : http://www.miniui.com/license
*
* Copyright(c) 2012 All Rights Reserved. Shanghai PusSoft Co., Ltd (上海普加软件有限公司) [ services@plusoft.com.cn ]. 
* 
*/

var MyPager = function () {
    MyPager.superclass.constructor.apply(this, arguments);
}
mini.extend(MyPager, mini.Container, {
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    totalPage: 0,
    sizeList: [10, 20, 50, 100],
    set: function (kv) {
        if (typeof kv == 'string') {
            return this;
        }

        var pageIndex = kv.pageIndex;
        delete kv.pageIndex;

        MyPager.superclass.set.call(this, kv);

        if (!mini.isNull(pageIndex)) {
            this.setPageIndex(pageIndex);
        }
        return this;
    },

    uiCls: "mypager",
    _create: function () {
        var sf = this;
        sf.el = document.createElement("div");
        sf.el.className = "mypager";
        this._updatePager();

    },
    _updatePagerButtons: function () {
        var sf = this;
        var pageSize = parseInt(sf.pageSize);
        var pageIndex = parseInt(sf.pageIndex);
        var totalIndex = parseInt(sf.totalCount);
        var buttonCounts = Math.ceil(totalIndex / pageSize);

        var sb = [];
        sb.push('<div class="mypager-buttons">');
        var cls = "";
        if (pageIndex == 0) {
            cls = "disabled";
        }
        var firstButton = '<span class="mypager-button mypager-first ' + cls + '" action="first"></span>';
        sb.push(firstButton);
        var prevButton = '<span class="mypager-button mypager-prev ' + cls + '" action="prev"></span>';
        sb.push(prevButton);

        if (buttonCounts < 8) {
            // debugger
            for (var i = 0; i < buttonCounts; i++) {
                var cls = "";
                if (pageIndex == i) {
                    cls = "mypager-current";
                }
                var item = '<span action="number" class="mypager-button ' + cls + '">' + (i + 1) + '</span>';

                sb.push(item);
            }
        } else {
            if (pageIndex < 6) {
                for (var i = 0; i < 6; i++) {
                    var cls = "";
                    if (pageIndex == i) {
                        cls = "mypager-current";
                    }
                    var item = '<span action="number" class="mypager-button ' + cls + '">' + (i + 1) + '</span>';

                    sb.push(item);
                }
                sb.push('<span class="mypager-button mypager-button-ellipsis" action="none">...</span>');
                sb.push('<span class="mypager-button" action="number">' + buttonCounts + '</span>');
            } else if (pageIndex > buttonCounts - 6) {
                sb.push('<span class="mypager-button mypager-button-ellipsis" action="none">...</span>');
                for (var i = 7; i > 0; i--) {
                    var cls = "";
                    if (pageIndex == buttonCounts - i) {
                        cls = "mypager-current";
                    }
                    sb.push('<span action="number" class="mypager-button ' + cls + '">' + (buttonCounts - i + 1) + '</span>');
                }


            } else {
                for (var i = 0; i < 5; i++) {
                    var item = '<span class="mypager-button" action="number">' + (pageIndex - (4 - i)) + '</span>';
                    sb.push(item);
                }
                sb.push('<span class="mypager-button mypager-current" action="number">' + (pageIndex + 1) + '</span>');
                sb.push('<span class="mypager-button mypager-button-ellipsis" action="none">...</span>');
                sb.push('<span class="mypager-button" action="number">' + buttonCounts + '</span>');
            }
        }

        var cls = "";
        if (pageIndex == buttonCounts - 1) {
            cls = "disabled";
        }
        var nextButton = '<span class="mypager-button mypager-next ' + cls + '" action="next"></span>';

        sb.push(nextButton);

        var lastButton = '<span class="mypager-button mypager-last ' + cls + '" action="last"></span>';
        sb.push(lastButton);



        var pagerChange = '<span class="mypager-number-wrap"><input class="mypager-number"  /></span>';
        sb.push(pagerChange);

        var skipButton = '<span class="mypager-button mypager-action" action="skip">跳转</span>';
        sb.push(skipButton);
        var reloadButton = '<span class="mypager-button mypager-action" action="reload">刷新</span>';
        sb.push(reloadButton);
        sb.push('</div>');
        //        sb.push('<div class="mypager-count">每页' + pageSize + '条 共' + totalIndex + '条</div>')
        var pageButtonsStr = sb.join(" ");
        sf.el.innerHTML = pageButtonsStr;



    },
    _updatePagerInfo: function () {
        var sf = this;

        var pageSize = parseInt(sf.pageSize);
        var pageIndex = parseInt(sf.pageIndex);
        var totalIndex = parseInt(sf.totalCount);
        var firstIndex = sf.totalCount == 0 ? 0 : (pageSize * pageIndex + 1);
        var lastIndex = Math.min(pageSize * (pageIndex + 1), totalIndex);
        var pagerInfo = document.createElement("div");
        pagerInfo.className = "mypager-count";
        var pagerInfoText1 = document.createElement("span");
        pagerInfoText1.className = "mypegr-info-text";
        pagerInfoText1.innerHTML = "每页";
        pagerInfo.appendChild(pagerInfoText1);


        var sizeList = sf.sizeList;
        var flag = false;
       
        for (var i = 0, l = sizeList.length; i < l; i++) {
            if (sizeList[i] == pageSize) {
                flag = true;
            }
        }
        if (!flag) {
            sizeList.push(pageSize);
        }

        function sortNumber(a, b) {
            return a - b
        }

        sizeList.sort(sortNumber);
        var sizeData = [];
        for (var i = 0, l = sizeList.length; i < l; i++) {
            sizeData.push({ id: sizeList[i], text: sizeList[i] });
        }

        sf.sizeCombo = new mini.ComboBox();
        sf.sizeCombo.setData(sizeData);
        sf.sizeCombo.setWidth(60);
        sf.sizeCombo.setValue(pageSize);
        sf.sizeCombo.on("valuechanged", function (e) {
            var value = parseInt(e.value)
            sf._OnPageChanged(0, value)
        })
        sf.sizeCombo.render(pagerInfo);

        var pagerInfoText2 = document.createElement("span");
        pagerInfoText2.className = "mypegr-info-text";
        pagerInfoText2.innerHTML = ' 条 共' + totalIndex + '条';
        pagerInfo.appendChild(pagerInfoText2);
        sf.el.appendChild(pagerInfo);


    },
    _updatePager: function () {
        var sf = this;
        this._updatePagerButtons();
        this._updatePagerInfo();

    },
    _initEvents: function () {
        MyPager.superclass._initEvents.call(this);
        var sf = this;
        //        sf.sizeCombo.on("valuechanged", function (e) {
        //            
        //        })
        setTimeout(function () {
            $(sf.el).bind("click", ".mypager-button", function (e) {

                var pageSize = sf.pageSize;
                var pageIndex = sf.pageIndex;
                var totalIndex = sf.totalCount;
                var buttonCounts = Math.ceil(totalIndex / pageSize);
                var action = $(e.target).attr("action");

                if (action == "prev") {
                    if (pageIndex != 0) {
                        sf._OnPageChanged(pageIndex - 1)
                    }
                } else if (action == "next") {
                    if (pageIndex < buttonCounts - 1) {
                        sf._OnPageChanged(sf.pageIndex + 1)
                    }
                } else if (action == "first") {
                    if (pageIndex != 0) {
                        sf._OnPageChanged(0)
                    }
                } else if (action == "last") {
                    if (pageIndex < buttonCounts - 1) {
                        sf._OnPageChanged(buttonCounts)
                    }
                } else if (action == "reload") {
                    sf._OnPageChanged()
                } else if (action == "skip") {
                    var val = $(".mypager-number", sf.el).val();
                    if (isNaN(val)) {
                        $(".mypager-number", sf.el).val("");
                        return
                    }
                    sf._OnPageChanged(val - 1)
                } else if (action == "none") {

                } else if (action == "number") {
                    if (!$(e.target).hasClass("current")) {
                        var val = parseInt($(e.target).text());
                        if (val > 0) {
                            sf._OnPageChanged(val - 1);

                        }
                    }
                }
                else {


                }

            })
            $(sf.el).bind("keydown", ".mypager-number", function (e) {
                if (e.keyCode == 13) {

                    var pageSize = sf.pageSize;
                    var pageIndex = sf.pageIndex;
                    var totalIndex = sf.totalCount;
                    var buttonCounts = Math.ceil(totalIndex / pageSize);

                    var value = parseInt($(e.target).val());

                    if (isNaN(value)) {
                        $(e.target).val("");
                    } else {
                        if (value > buttonCounts) {
                            value = buttonCounts;
                            $(e.target).val(value);
                        }
                        sf._OnPageChanged(value - 1);
                    }
                }
            })
            $(sf.el).bind("keyup", ".mypager-number", function (e) {
                // debugger
                if (isNaN($(e.target).val()) || $(e.target).val().charAt(0) == '0') {
                    $(e.target).val('');
                }
            })


        }, 100)

    },

    _OnPageChanged: function (index, size) {

        var e = {
            pageIndex: mini.isNumber(index) ? index : this.pageIndex,
            pageSize: mini.isNumber(size) ? size : this.pageSize,
            cancel: false
        };
        if (e.pageIndex > this.totalPage - 1) {
            e.pageIndex = this.totalPage - 1;
        }
        if (e.pageIndex < 0) e.pageIndex = 0;

        this.fire("beforepagechanged", e);
        if (e.cancel == true) {
            return;
        }

        this.fire("pagechanged", e);
        this.update(e.pageIndex, e.pageSize);


    },

    //分页信息变更时激发，用户在此方法内调整分页信息展现
    update: function (index, size, total) {
        var sf = this;
        if (mini.isNumber(index)) sf.pageIndex = parseInt(index);
        if (mini.isNumber(size)) sf.pageSize = parseInt(size);
        if (mini.isNumber(total)) sf.totalCount = parseInt(total);

        sf.totalPage = parseInt(sf.totalCount / sf.pageSize) + 1;
        if ((sf.totalPage - 1) * sf.pageSize == sf.totalCount) {
            sf.totalPage -= 1;
        }
        if (sf.totalCount == 0) sf.totalPage = 0;

        if (sf.pageIndex > sf.totalPage - 1) {
            sf.pageIndex = sf.totalPage - 1;
        }
        if (sf.pageIndex <= 0) sf.pageIndex = 0;
        if (sf.totalPage <= 0) sf.totalPage = 0;

        this._updatePager();
    }

});

mini.regClass(MyPager, "mypager");
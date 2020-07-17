if (!window.UserControl) window.UserControl = {};

UserControl.MultiUpload = function () {

    UserControl.MultiUpload.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();

}

function MultiUpload_RemoveRow(id) {
    if(!id||id.indexOf(",")==-1) return
    var cmpId = id.split(",")[1];
    var rowId = id.split(",")[0];
    var multiUpload = mini.get(cmpId);
    var row = multiUpload.findRow(function (row) {
        if (rowId == row.id) return true;
    })
    if(row.filePk){
	    mini.confirm("确定删除文件吗？", "确定？",
	        function (action) {
	            if (action == "ok") {
	            	var json = mini.encode({"id" : row.filePk});
            		$.ajax({
            			url: multiUpload.deleteUrl,
            			type: "POST",
            			contentType : 'application/json;charset=utf-8',
            			dataType:"json",
            			data: json,
            			success: function (text) {
            				mini.alert(text.message);
            				if (row) multiUpload.removeRow(row);
            			},
            			error: function (jqXHR, textStatus, errorThrown) {
            				mini.alert(textStatus);
            			}
            		}); 
	            }
	        }
	    );
    } else {
    	if (row) multiUpload.removeRow(row);
    }
    
}

function MultiUpload_Download(id) {
    if(!id||id.indexOf(",")==-1) return
    var cmpId = id.split(",")[1];
    var rowId = id.split(",")[0];
    var multiUpload = mini.get(cmpId);
    var row = multiUpload.findRow(function (row) {
        if (rowId == row.id) return true;
    })
    if(row.filePk){
    	window.location.href=multiUpload.downloadUrl+"?id="+row.filePk; 
    } 
    
}
mini.extend(UserControl.MultiUpload, mini.DataGrid, {

    uiCls: 'uc-multiupload',
    uploadUrl: ctx + "/sys/sysUploadfile/fileUpload",
    downloadUrl: ctx + "/sys/sysUploadfile/fileDownload",
    deleteUrl: ctx + "/sys/sysUploadfile/fileDelete",
    url: ctx + "/sys/sysUploadfile/fileList",
    flashUrl: ctxStatic + "/miniui/uiV4/custom/multiUpload/swfupload/swfupload.swf",
    limitType: "*.*",
    limitSize: "",
    modelName:"",
    getUploadUrl: function () {
        return this.uploadUrl;
    },
    setUploadUrl: function (url) {
        this.uploadUrl = url;
    },
    getDownloadUrl: function () {
        return this.downloadUrl;
    },
    setDownloadUrl: function (url) {
        this.downloadUrl = url;
    },
    getDeleteUrl: function () {
        return this.deleteUrl;
    },
    setDeleteUrl: function (url) {
        this.deleteUrl = url;
    },
    getUrl: function () {
        return this.url;
    },
    setUrl: function (url) {
        this.url = url;
    },
    getFlashUrl: function () {
        return this.flashUrl;
    },
    setFlashUrl: function (url) {
        this.flashUrl = url;
    },
    getLimitType: function () {
        return this.limitType;
    },
    setLimitType: function (type) {
        this.limitType = type;
    },
    getLimitSize: function () {
        return this.limitSize;
    },
    setLimitSize: function (size) {
        this.limitSize = size;
    },
    getModelName: function () {
        return this.modelName;
    },
    setModelName: function (name) {
        this.modelName = name;
    },
    initComponents: function () {
    	var _state = mini.get("_state").getValue();
        var sf = this;
        var toolbar = '<div style="padding:2px;" align="right">'
        	+ '<span style="float:left;font-weight: bold; font-size: 15px; color: #1E90FF; line-height:33px">文件上传</span>'
            + '<a name="check" class="mini-button" iconCls="icon-clip" plain="true"><span id="selectButtonHide"></span></a>'
            + '<a name="start" class="mini-button" iconCls="icon-upload" plain="true">开始上传</a>' //itemId
            + '<a name="stop" class="mini-button" iconCls="icon-cancel" plain="true">停止上传</a>'
            + '<a name="remove" class="mini-button" iconCls="icon-remove" plain="true">全部删除</a>'
            + '<a name="downAll" class="mini-button" iconCls="icon-download" plain="true">全部下载</a>'
        + '</div>';
        if(_state == "readOnly" || _state == "workFlow") {
        	toolbar = '<div style="padding:2px;" align="right">'
        		+ '<a name="check" class="mini-button" iconCls="icon-clip" plain="true" style="display:none"><span id="selectButtonHide"></span></a>'
                + '<a name="downAll" class="mini-button" iconCls="icon-download" plain="true">全部下载</a>'
            + '</div>';
        }

        sf.set({
            idField: "id",
            columns: sf.createColumns(),
            showToolbar: true,
            toolbar: toolbar,
            showPager: false
        });
        sf.on("drawcell", function (e) {

            var field = e.field,
            uid = e.record.id;

            function formatBytes(bytes) {
                if (isNaN(bytes)) { return (''); }
                var unit, val;
                if (bytes < 999) {
                    unit = 'B';
                    val = (!bytes && sf.progressRequestCount >= 1) ? '~' : bytes;
                } else if (bytes < 999999) {
                    unit = 'kB';
                    val = Math.round(bytes / 1000);
                } else if (bytes < 999999999) {
                    unit = 'MB';
                    val = Math.round(bytes / 100000) / 10;
                } else if (bytes < 999999999999) {
                    unit = 'GB';
                    val = Math.round(bytes / 100000000) / 10;
                } else {
                    unit = 'TB';
                    val = Math.round(bytes / 100000000000) / 10;
                }

                return (val + ' ' + unit);
            }
            if (field == "size") {
                e.cellHtml = formatBytes(e.value);
            }
            if (field == "action") {
                var cmpId = sf.id;
                e.cellHtml = ' <a  href="javascript:MultiUpload_RemoveRow(\'' + uid + '\,' + cmpId + '\')" >删除</a> <a  href="javascript:MultiUpload_Download(\'' + uid + '\,' + cmpId + '\')" >下载</a>'
                if(_state == "readOnly")
                	e.cellHtml = '<a  href="javascript:MultiUpload_Download(\'' + uid + '\,' + cmpId + '\')" >下载</a>'
            }
            if (field == "progress") {
                e.cellHtml = '<div class="progressbar">'
                                + '<div class="progressbar-percent" style="width:' + e.value * 100 + '%;"></div>'
                                + '<div class="progressbar-label">' + e.value * 100 + '%</div>'
                            + '</div>';
            }

        })
    },
    bindEvents: function () {
        var sf = this;
        sf.starttBtn = mini.getbyName('start', sf);
        sf.StopBtn = mini.getbyName('stop', sf);
        sf.removeBtn = mini.getbyName('remove', sf);
        sf.downAllBtn = mini.getbyName('downAll', sf);
        var modelId = mini.get("id").getValue();
/*        alert("modelName："+sf.modelName);
        alert("sf.limitSize：wewew"+sf.uploadUrl);
        alert($("#uploader").attr("modelName"));
*/       
        var modelname = $("#uploader").attr("modelName");
        if(modelname == "undefined" || modelname == undefined){
        	modelname = "";
        }
        setTimeout(function () {
            sf.swfu = new SWFUpload({
                // upload_url: "upload.aspx", 		//处理上传文件的地址
                // flash_url: "swfupload/swfupload.swf", 	//核心功能swf的地址
                upload_url: sf.uploadUrl,
                flash_url: sf.flashUrl,

                //设置post_parame是否以get方式发送，如果是false,那么就用post
                use_query_string: true,
                post_params: {"ModelID":modelId,"ModelName":modelname},
                // flash9_url: "swfupload/swfupload_fp9.swf",
                file_size_limit: sf.limitSize, 								//文件大小限制          
                //   file_post_name: "Fdata",
                file_types: sf.limitType,    //这是全部文件都可以上传，如果要限制只有某些文件上传，则可以这么写 file_types : "*.jpg;*.gif;*.png",
                file_types_description: "All Files",
                file_upload_limit: "0",
                // file_queue_limit: "5",       //队列大小限制
                file_queued_handler: mini.createDelegate(sf.File_Queued_Handler, sf),
                file_dialog_complete_handler: mini.createDelegate(sf.File_Dialog_Complete_Handler, sf),
                upload_error_handler: mini.createDelegate(sf.Upload_Error_Handler, sf),
                upload_success_handler: mini.createDelegate(sf.Upload_Success_Handler, sf),
                upload_complete_handler: mini.createDelegate(sf.Upload_Complete_Handler, sf),
                file_queue_error_handler: mini.createDelegate(sf.File_Queque_Errroe_Handler, sf),
                //上传过程中定时回发
                upload_progress_handler: mini.createDelegate(sf.Upload_Progress_Handler, sf),
                //占位元素
                button_placeholder_id: "selectButtonHide",
                button_width: 55,
                button_height: 22,
                button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                button_text: "<span class='redText'>浏览文件</span>",
                button_text_style: ".redText { 	font-size: 13px;  font-family: 微软雅黑;}",
                button_text_left_padding: 0,
                button_text_top_padding: 0,
                //button_image_url: "./header.png",
                button_cursor: SWFUpload.CURSOR.HAND
            });

            if(sf.starttBtn)
	            sf.starttBtn.on("click", function (e) {
	                if (sf.swfu) {
	                    sf.swfu.startUpload();
	                }
	            });
            
            if(sf.StopBtn)
	            sf.StopBtn.on("click", function (e) {
	                if (sf.swfu) {
	                    sf.swfu.stopUpload();
	                }
	            });
            
            if(sf.removeBtn)
	            sf.removeBtn.on("click", function (e) {
	        	    mini.confirm("确定删除全部文件吗？", "确定？",
	        		        function (action) {
	        		            if (action == "ok") {
	        		            	var json = mini.encode({"modelid" : modelId});
	        	            		$.ajax({
	        	            			url: sf.deleteUrl,
	        	            			type: "POST",
	        	            			contentType : 'application/json;charset=utf-8',
	        	            			dataType:"json",
	        	            			data: json,
	        	            			success: function (text) {
	        	            				mini.alert(text.message);
	
	        	            				sf.setData([]);
	        	            				if (sf.swfu) {
	        	            					sf.swfu.cancelUpload()
	        	            				}
	        	            			},
	        	            			error: function (jqXHR, textStatus, errorThrown) {
	        	            				mini.alert(textStatus);
	        	            			}
	        	            		}); 
	        		            }
	        	    		}
	        	    );
	            });
            
            if(sf.downAllBtn)
	            sf.downAllBtn.on("click", function (e) {
	            	window.location.href=sf.downloadUrl+"?modelid="+modelId; 
	            });
        }, 100)




    },
    createColumns: function () {
        var columns = [
            { type: "indexcolumn" },
            { field: "name", header: "文件名", width: 100 },
            { field: "size", header: "大小", width: 50 },
            { field: "type", header: "类型", width: 50 },
            { field: "progress", header: "进度", width: 100 },
            { field: "action", header: "操作", width: 50 },
            { field: "note", header: "提示", width: 50 }
        ];
        return columns;
    },

    File_Queued_Handler: function (file) {

        var sf = this;
        sf.addReadyFileInfo(file.id, file.type, file.name, file.size, "未开始上传");
    },
    //选择框结束触发，可以做自动上传
    File_Dialog_Complete_Handler: function (numFilesSelected, numFilesQueued) {
        try {
            if (numFilesQueued > 0) {

                //swfu.startUpload();
            }
        } catch (ex) {

        }
    },
    Upload_Error_Handler: function (file, errorCode, message) {

        var nodeInfo = "";
        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                noteInfo = "<font color='red'>http_error</font>";
                break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                noteInfo = "<font color='red'>io_error</font>";
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
            default:

                break;
        }
        var row = this.getRow(file.id);
        this.updateRow(row, { status: "文件上传出错!!", note: noteInfo, progress: "" });

    },
    Upload_Success_Handler: function (file, serverData) {

    	var returnData = mini.decode ( serverData );
        // this.updateRow(row, { status: "成功上传！！" });
        this.updateFileInfo(file.id, { status: "成功上传！", note: returnData.errorInfo, filePk: returnData.id });
    },
    //上传完一个文件后触发，可以做多文件上传
    Upload_Complete_Handler: function (file) {
        try {
            if (this.swfu.getStats().files_queued > 0) {
                this.swfu.startUpload();
            } else {

            }
        } catch (ex) {

        }
    },
    //加入上传队列错误提示
    File_Queque_Errroe_Handler: function (file, errorCode, message) {

        try {

            var noteInfo = "<font color='red'>文件上传错误</font>";
            var errorName = "";
            if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                errorName = "选择了太多文件，超过了" + message + "个!";
            }

            if (errorName !== "") {
                alert(errorName);
                return;
            }

            switch (errorCode) {
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                    noteInfo = "<font color='red'>文件大小为0</font>";
                    break;
                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    noteInfo = "<font color='red'>文件大小超过限制</font>";
                    break;
                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                default:
                    alert(message);
                    break;
            }
            this.addReadyFileInfo(file.id, file.type, file.name, file.size, "无法上传", noteInfo);

        } catch (ex) {

        }

    },

    Upload_Progress_Handler: function (file, complete, complete) {
        var sf = this;
        var percent = Math.ceil(complete / complete);
        sf.updateFileInfo(file.id, { progress: percent });
    },

    addReadyFileInfo: function (fileId, type, fileName, size, status, note) {
        var row = {};
        row.id = fileId;
        row.name = fileName;
        row.type = type;
        row.size = size;
        row.progress = 0;
        if (status != null && status != "") {
            row.status = status;
        } else {
            row.status = "";
        }
        if (note != null && note != "") {
            row.note = note;
        } else {
            row.note = "";
        }
        var length = this.getData().length;
        this.addRow(row, length);
    },
    updateFileInfo: function (id, info) {
        var row = this.findRow(function (row) {
            if (id == row.id) return true;
        })
        if (row) this.updateRow(row, info);
    },
    getAttrs: function (el) {
        var attrs = UserControl.MultiUpload.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            ["uploadUrl", "flashUrl","limitType","limitSize","deleteUrl","downloadUrl","url","modelName"]
        );
        return attrs;
    },
    load: function (json) {
    	var grid = this;
    	$.ajax({
			url: grid.url,
			type: "POST",
			contentType : 'application/json;charset=utf-8',
			dataType:"json",
			data: json,
			success: function (text) {
				grid.addRows(text);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				mini.alert(textStatus);
			}
		}); 
    }

});

mini.regClass(UserControl.MultiUpload, "multiupload");
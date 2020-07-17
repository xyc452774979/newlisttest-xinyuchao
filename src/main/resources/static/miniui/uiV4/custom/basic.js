/********************************************************************************
 *
 *      文件名： basic.js
 *
 *      作  用：  系统基础的调用方法。
 *
 *		修改时间：2016-12-13
 *
 ********************************************************************************/

/*****************************************************\
*              		去掉左边控格				       	  *
\*****************************************************/
function LTrim(str){
	if ((typeof(str) != "string") || !str) return "";
	return str.replace(/(^\s*)/g, ""); 
}

/*****************************************************\
*              		去掉右边控格				       	  *
\*****************************************************/
function RTrim(str){
	if ((typeof(str) != "string") || !str) return "";
	return str.replace(/(\s*$)/g, ""); 
}

/*****************************************************\
*              	去掉左右两边控格				       	  *
\*****************************************************/
function trimStr(str){
	if ((typeof(str) != "string") || !str) return "";
	return str.replace(/(^\s*)|(\s*$)/g, ""); 
}

/*****************************************************\
*              		获取绝对位置				       	  *
\*****************************************************/
function getAbsPosition(obj, offsetObj){
	var _offsetObj=(offsetObj)?offsetObj:document.body;
	var x=obj.offsetLeft;
	var y=obj.offsetTop;

	var tmpObj=obj.offsetParent;

	while ((tmpObj!=_offsetObj) && tmpObj){
		x+=tmpObj.offsetLeft+tmpObj.clientLeft-tmpObj.scrollLeft;
		y+=tmpObj.offsetTop+tmpObj.clientTop-tmpObj.scrollTop;
		tmpObj=tmpObj.offsetParent;
	}
	return ([x, y]);
}

/*****************************************************\
*          		将回车转为单击事件	     			  	  *
\*****************************************************/
function enterToClick(){
	var nKey = window.event.keyCode;

	if (nKey == 13) {
	    try {
		  if ( window.event.srcElement.onenterdown == "true" ) {
			 eval(window.event.srcElement.onclick());
		  }
	   } catch ( Exception ) {
	   }
	}

}

/*****************************************************\
*      				从enter转向tab	 	  			  *
\*****************************************************/
function enterToTab(){

	var nKey = window.event.keyCode;
	var element = window.event.srcElement;
	if(element.type=="textarea")
		return;
	if (nKey == 13){
		body_Click();
		 if(element.buttonid == undefined)
			 window.event.keyCode = 9;
		 else {
			 document.all(element.buttonid).focus();
		}
	}
}

/*****************************************************\
*      			执行一个方法			 			 	  *
\*****************************************************/
function fireUserEvent(function_name, param){

	var result;

    var paramstr="";
    if (arguments.length == 2)
          for(i=0; i<param.length; i++){
               if (i==0)
                    paramstr="param["+i+"]";
                else
                    paramstr=paramstr+",param["+i+"]";
          }

     if (isfireuserEvent(function_name)){
		if(typeof(function_name) == "function")
			result = function_name(param);
		else
     		result=eval(function_name+"("+paramstr+");");
//     	eval("result="+function_name+"("+paramstr+");");
     }

	return result;

}

/*****************************************************\
*      			检查是否存在某个方法	 			 	  *
\*****************************************************/
function isfireuserEvent(function_name){

     var result;
     //eval("result=(typeof("+function_name+")!=\"undefined\");");
	
	try{
		if(typeof(function_name) == "function")
			result = true;
		else
			result = (typeof(eval(function_name)) != "undefined");
	} catch(e){
		result = false;
	}
    return result;
}

/*****************************************************\
*      		判断输入字符串是否为空格或者TAB 			 	  *
\*****************************************************/
function isSpace(strValue){
  var re = /^\s+$/;
  if(re.exec(strValue)) {
   return true;
  }

  return false;
}

/*****************************************************\
*      			提供精确的浮点数加法运算 			 	  *
\*****************************************************/
function addFloat(n1,n2){
  var r1,r2,m;
  try{r1=trimStr(n1.toString()).split(".")[1].length}catch(e){r1=0}
  try{r2=trimStr(n2.toString()).split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2))
  return (n1*m+n2*m)/m
}

/*****************************************************\
*      	提供精确的浮点数加法运算, 参数是数组 			 	  *
\*****************************************************/
function addFloatArr(n1){
  var temp = 0;
  for (var i=0; i< n1.length; i++){
    temp = addFloat(temp, n1[i]);
  }
  return temp;
}

/*****************************************************\
*      			提供精确的浮点数减法运算 			 	  *
\*****************************************************/
function subFloat(n1,n2){
  return addFloat(n1, mulFloat(n2, -1));
}

/*****************************************************\
*      			提供精确的浮点数乘法运算 			 	  *
\*****************************************************/
function mulFloat(n1,n2){
	var m=0,s1=trimStr(n1.toString()),s2=trimStr(n2.toString());
	try{m+=s1.split(".")[1].length}catch(e){}
	try{m+=s2.split(".")[1].length}catch(e){}
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}

/*****************************************************\
*      			提供精确的浮点数除法运算 			 	  *
\*****************************************************/
function divFloat(arg1, arg2) {
	var t1 = 0, t2 = 0, r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length
	} catch (e) {
	}
	try {
		t2 = arg2.toString().split(".")[1].length
	} catch (e) {
	}
	with (Math) {
		r1 = Number(arg1.toString().replace(".", ""))
		r2 = Number(arg2.toString().replace(".", ""))
		return (r1 / r2) * pow(10, t2 - t1);
	}
}

/*****************************************************\
*      				四舍五入 						 	  *
\*****************************************************/
function round(num,n)  {
	var  dd=1;  
	var  tempnum;  
	for(i=0;i<n;i++)  {  
		dd*=10;  
	}  
	tempnum=num*dd;  
	tempnum=Math.round(tempnum);
	return tempnum/dd;
}  

/*****************************************************\
*      			当前日期YYYY-MM-DD			 	  	  *
\*****************************************************/
function CurrentDate()
{
	var date=new Date();
	var years = date.getFullYear();
	var months = date.getMonth()+1;
	var days = date.getDate();

	if (months < 10) months = "0" + months;
	if (days < 10) days = "0" + days;

	return years+ "-" + months + "-" + days;
}

/*****************************************************\
*      			当前时间HH:MM:SS:MS			 	  	  *
\*****************************************************/
function CurrentTime()
{
	var date=new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var Milliseconds = date.getMilliseconds();

	if (hours < 10) hours = "0" + hours;
	if (minutes < 10) minutes = "0" + minutes;
	if (seconds < 10) seconds = "0" + seconds;
	if (Milliseconds<10) Milliseconds = "00" + Milliseconds;
	else if (Milliseconds<100) Milliseconds = "0" + Milliseconds;

	return hours + ":" + minutes + ":" + seconds + ":" + Milliseconds;
}

/*****************************************************\
*      	计算一个字符串的hashCode值，与Java计算的值一样	  	  *
\*****************************************************/
function hashCode( sVal )
{
	var MAX_INT_POSITIVE = 4294967296; // 2^32
	var MAX_INT = 2147483648;  // 2^31
	var hash=0;
	var nCount=sVal.length;
	for( var i=0; i<nCount; i++)
	{
		hash = 31*hash + sVal.charCodeAt(i);
		while (Math.abs(hash)>MAX_INT && hash>0)
		{
			hash=hash-MAX_INT_POSITIVE;
		}
		while (Math.abs(hash)>MAX_INT && hash<0)
		{
			hash=hash + MAX_INT_POSITIVE;
		}
	}
	return hash;
}

/*****************************************************\
*      	输入为中文判断（只要包含一个中文字符就是中文）	  	  *
\*****************************************************/
function isChinese( str )
{
	var pattern=/[^\x00-\xff]/g;
	if(pattern.test(str))
		return true;	//包含中文
	else
		return false;	//不包含中文
}

/*****************************************************\
* "请输入合法日期类型比如2009年3月，输入：0903"       *
\*****************************************************/
function checkDate2(obj){
	var indate=obj.value;
	if(indate.length!=4&&indate.length!=7&&indate.length!=0){
		alert("请输入合法日期类型比如2009年3月，输入：0903或者03/2009");
		return false;
	}
	if(indate.length==7){
		for(var i=0;i<indate.length;i++){
			if(i==2){
				if(indate.charAt(i)=="/") continue; 
				if(indate.charAt(i)!="/"){
					alert("请输正确的箱龄格式，为7位数字，例如：01/2009");
		 			return false; 
				}
		 	}
			if(isNaN(indate.charAt(i))){
				alert("请输正确的箱龄格式，为7位数字，例如：01/2009");
				return false ;
			}
		}
	}
	if(indate.length==4){
		for(var i=0;i<indate.length;i++){
			if(isNaN(indate.charAt(i))){
				alert("请输入数字");
				return false ;
			}
		}
		var inputyear=indate.substring(0,2);
		var inputmoth=indate.substring(2);
		if(inputyear>=80&&inputyear<=99){
			inputyear="19"+inputyear;
		}else{
			inputyear="20"+inputyear;
		}
		if(inputmoth>12||inputmoth==0){
			alert("月份输入不合法，请输入01-12之间数字");
			return false;
		}
		obj.value=inputmoth+"/"+inputyear;
	}
	return true;
}

/*****************************************************\
* 鼠标位置获得 *
\*****************************************************/

function mouseMove(ev){
	var mousePos;
	ev = ev || window.event;
	if(mousePos){
		mousePos = null;
	}
	if(ev.pageX || ev.pageY){
		mousePos = {
			x:ev.pageX,
			y:ev.pageY
		};
	}else{
		mousePos = {
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:ev.clientY + document.body.scrollTop - document.body.clientTop
		}
	}
	return mousePos;
}
	//数字小数点之前用千分位显示，之后有多少显示多少。
	function specialNumberFormat(num){
		if (!num){
			num = "0";
		}
		var k1 = "";
		var k2 = "";
		
		var numZ = num.toString().split(".");
		k1= mini.formatNumber(addFloat(numZ[0],"0"), "#,0");
		if(numZ.length == 2){
			k1= mini.formatNumber(addFloat(numZ[0],"0"), "#,0");
			k2 = numZ[1];
		}
		var rv = "";
		if (k2 == ""){
			rv = k1;
		} else {
			rv = k1+"."+k2;
		}
		return rv;
}
	function utf16to8(str) {
  		var out, i, len, c;

  		var out = [];
  		len = str.length;
  		for (i = 0; i < len; i++) {
  			c = str.charCodeAt(i);
  			if ((c >= 0x0001) && (c <= 0x007F)) {
  				out.push(str.charAt(i));
  			} else if (c > 0x07FF) {
  				out.push(String.fromCharCode(0xE0 | ((c >> 12) & 0x0F)));
  				out.push(String.fromCharCode(0x80 | ((c >> 6) & 0x3F)));
  				out.push(String.fromCharCode(0x80 | ((c >> 0) & 0x3F)));
  			} else {
  				out.push(String.fromCharCode(0xC0 | ((c >> 6) & 0x1F)));
  				out.push(String.fromCharCode(0x80 | ((c >> 0) & 0x3F)));
  			}
  		}
  		return out.join('');
  	}
  	

  	function utf8to16(str) {
  		var out, i, len, c;
  		var char2, char3;

  		out = [];
  		len = str.length;
  		i = 0;
  		while (i < len) {
  			c = str.charCodeAt(i++);
  			switch (c >> 4) {
  				case 0 :
  				case 1 :
  				case 2 :
  				case 3 :
  				case 4 :
  				case 5 :
  				case 6 :
  				case 7 :
  					// 0xxxxxxx
  					out.push(str.charAt(i - 1));
  					break;
  				case 12 :
  				case 13 :
  					// 110x xxxx 10xx xxxx
  					char2 = str.charCodeAt(i++);
  					out.push(String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F)));
  					break;
  				case 14 :
  					// 1110 xxxx 10xx xxxx 10xx xxxx
  					char2 = str.charCodeAt(i++);
  					char3 = str.charCodeAt(i++);
  					out.push(String.fromCharCode(((c & 0x0F) << 12)
  							| ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0)));
  					break;
  			}
  		}

  		return out.join('');
  	}

  	var charCode = {///字符串加码
  			encode : function (strIn){
  				var strOut = BASE64.encode(utf16to8(strIn+""));
  				// 将+替换成%2B
  				strOut = strOut.replace(/\+/g,"%2B");
  				return (strOut);
  			},
  			
  			/////字符串解码
  			decode : function (strIn){
  				// 将%2B替换成+
  				strIn = strIn.replace(/\%2B/g,"+");
  				alert
  				var strOut = utf8to16(BASE64.decode(strIn));
  				return (strOut);
  			}
  		}
  	var BASE64 = {
  			/**
  			 * 此变量为编码的key，每个字符的下标相对应于它所代表的编码。
  			 */
  			enKey : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  			/**
  			 * 此变量为解码的key，是一个数组，BASE64的字符的ASCII值做下标，所对应的就是该字符所代表的编码值。
  			 */
  			deKey : new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  					-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  					-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  					52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
  					0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  					19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29,
  					30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
  					47, 48, 49, 50, 51, -1, -1, -1, -1, -1),
  			/**
  			 * 编码
  			 */
  			encode : function(src) {
  				// 用一个数组来存放编码后的字符，效率比用字符串相加高很多。
  				var str = new Array();
  				var ch1, ch2, ch3;
  				var pos = 0;
  				// 每三个字符进行编码。
  				while (pos + 3 <= src.length) {
  					ch1 = src.charCodeAt(pos++);
  					ch2 = src.charCodeAt(pos++);
  					ch3 = src.charCodeAt(pos++);
  					str.push(this.enKey.charAt(ch1 >> 2), this.enKey
  									.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
  					str.push(this.enKey.charAt(((ch2 << 2) + (ch3 >> 6)) & 0x3f),
  							this.enKey.charAt(ch3 & 0x3f));
  				}
  				// 给剩下的字符进行编码。
  				if (pos < src.length) {
  					ch1 = src.charCodeAt(pos++);
  					str.push(this.enKey.charAt(ch1 >> 2));
  					if (pos < src.length) {
  						ch2 = src.charCodeAt(pos);
  						str.push(this.enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
  						str.push(this.enKey.charAt(ch2 << 2 & 0x3f), '=');
  					} else {
  						str.push(this.enKey.charAt(ch1 << 4 & 0x3f), '==');
  					}
  				}
  				// 组合各编码后的字符，连成一个字符串。
  				return str.join('');
  			},
  			/**
  			 * 解码。
  			 */
  			decode : function(src) {
  				// 用一个数组来存放解码后的字符。
  				var str = new Array();
  				var ch1, ch2, ch3, ch4;
  				var pos = 0;
  				// 过滤非法字符，并去掉'='。
  				src = src.replace(/[^A-Za-z0-9\+\/]/g, '');
  				// decode the source string in partition of per four characters.
  				while (pos + 4 <= src.length) {
  					ch1 = this.deKey[src.charCodeAt(pos++)];
  					ch2 = this.deKey[src.charCodeAt(pos++)];
  					ch3 = this.deKey[src.charCodeAt(pos++)];
  					ch4 = this.deKey[src.charCodeAt(pos++)];
  					str.push(String.fromCharCode((ch1 << 2 & 0xff) + (ch2 >> 4),
  							(ch2 << 4 & 0xff) + (ch3 >> 2), (ch3 << 6 & 0xff) + ch4));
  				}
  				// 给剩下的字符进行解码。
  				if (pos + 1 < src.length) {
  					ch1 = this.deKey[src.charCodeAt(pos++)];
  					ch2 = this.deKey[src.charCodeAt(pos++)];
  					if (pos < src.length) {
  						ch3 = this.deKey[src.charCodeAt(pos)];
  						str.push(String.fromCharCode((ch1 << 2 & 0xff) + (ch2 >> 4),
  								(ch2 << 4 & 0xff) + (ch3 >> 2)));
  					} else {
  						str.push(String.fromCharCode((ch1 << 2 & 0xff) + (ch2 >> 4)));
  					}
  				}
  				// 组合各解码后的字符，连成一个字符串。
  				return str.join('');
  			}
  		};

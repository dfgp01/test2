/**
*	工具类
*/

Util = {
		
	/**
	 * 对象非空检测
	 */
	checkNotNull : function(field, isShow){
		//因为js的0和""是一样的(""==0 为true)，所以要分开判断
		if(field == 0){
			return true;
		}
		if(field == undefined || field == null || field == ""){
			if(isShow){
				cc.log("["+field+"] is undefined or null");
			}
			return false;
		}
		return true;
	},
	
	/**
	 * 检测对象是否为字符串
	 */
	checkIsString : function(field, isShow){
		if(!this.checkNotNull(field, isShow)){
			return false;
		}
		if(typeof(field) != "string"){
			if(isShow){
				cc.log("["+field+"] is not string");
			}
			return false;
		}
		return true;
	},
	
	/**
	 * 检测对象是否为数组
	 */
	checkIsArray : function(field, isShow){
		if(!this.checkNotNull(field, isShow)){
			return false;
		}
		if(field instanceof Array){
			return true;
		}else{
			if(isShow){
				cc.log("["+name+"] is not array");
			}
			return false;
		}
	},
	
	/**
	 * 检测数组是否为空
	 */
	checkArrayNull : function(field, isShow){
		if(this.checkIsArray(field, isShow)){
			if(field.length > 0){
				return false;
			}else{
				if(isShow){
					cc.log("[array:"+field+"] is null");
				}
				return true;
			}
		}
		return true;
	},
	
	/**
	 * 检查对象是否数字（整数）
	 */
	checkIsInt : function(field, isShow){
		if(!this.checkNotNull(field, isShow)){
			return false;
		}
		if(typeof(field) == "number" && parseInt(field) == field){
			return true;
		}else{
			if(isShow){
				cc.log("["+name+"] is not number");
			}
		}
	}
};
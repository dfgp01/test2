/**
 *	工具类（修改过）
 */

Util = {

		/**
		 * 	取得对象数据值
		 */
		getValue : function(data, fieldName){
			var field = 0;
			if(fieldName){
				field = data[fieldName];
			}else{
				field = data;
			}
			return field;
		},

		/**
		 * 对象非空检测
		 */
		checkNotNull : function(data, fieldName, isShowLog){
			var field = this.getValue(data, fieldName);

			//因为js的0和""是一样的(""==0 为true)，所以要分开判断
			if(field == 0){
				return true;
			}
			if(field == undefined || field == null || field == ""){
				if(isShowLog){
					cc.log("data is undefined or null	field: " + fieldName);
				}
				return false;
			}
			return true;
		},

		/**
		 * 检测对象是否为字符串
		 */
		checkIsString : function(data, fieldName, isShowLog){
			if(!this.checkNotNull(data, fieldName, isShowLog)){
				return false;
			}
			var field =this.getValue(data, fieldName);
			if(typeof(field) != "string"){
				if(isShowLog){
					cc.log("data is not string	field: " + fieldName + " value: " + field);
				}
				return false;
			}
			return true;
		},

		/**
		 * 检查对象是否数字（整数）
		 */
		checkIsInt : function(data, fieldName, isShowLog){
			if(!this.checkNotNull(data, fieldName, isShowLog)){
				return false;
			}
			var field =this.getValue(data, fieldName);
			if(typeof(field) == "number" && parseInt(field) == field){
				return true;
			}else{
				if(isShowLog){
					cc.log("data is not number	field: " + fieldName + " value: " + field);
				}
				return false;
			}
		},

		/**
		 * 检测对象是否为数组
		 */
		checkIsArray : function(data, fieldName, isShowLog){
			if(!this.checkNotNull(data, fieldName, isShowLog)){
				return false;
			}
			var field =this.getValue(data, fieldName);
			if(field instanceof Array){
				return true;
			}else{
				if(isShowLog){
					cc.log("data is not array	field: " + fieldName + " value: " + field);
				}
				return false;
			}
		},

		/**
		 * 检测数组是否为空
		 */
		checkArrayNull : function(data, fieldName, isShowLog){
			if(this.checkIsArray(data, fieldName, isShowLog)){
				var field =this.getValue(data, fieldName);
				if(field.length > 0){
					return false;
				}else{
					if(isShowLog){
						cc.log("[array is null	field: " + fieldName + " size: " + field.length);
					}
					return true;
				}
			}
			return true;
		},

		iterObj : function(obj){
			var str = "";
			for(var key in obj){
				str += "key : " + key + ", value : " + obj[key] + "\n";
			}
			return str;
		}
};
/**
 *	工具类（修改过的）
 */

DataUtil = {

		/**
		 * 	取得对象数据值
		 */
		getValue : function(data, fieldName){
			var field = null;
			//如果参数fieldName没有输入，则直接返回data
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
		checkNotNull : function(data){
			//因为js的0和""是一样的(""==0 为true)，所以要分开判断
			if(data == 0){
				return true;
			}
			if(data == undefined || data == null || data == ""){
				return false;
			}
			return true;
		},
		
		checkNotNullForLog : function(data, fieldMsg){
			if(!checkNotNull(data)){
				cc.log(fieldMsg + " is null or undefined.");
			}
		},

		/**
		 * 检测对象是否为字符串
		 */
		checkIsString : function(data){
			if(!this.checkNotNull(data)){
				return false;
			}
			return typeof(data) == "string";
		},
		
		checkIsStringForLog : function(data, fieldMsg){
			if(!checkIsString(data)){
				cc.log(fieldMsg + " is not a string. value:"+data+".");
			}
		},

		/**
		 * 检查对象是否整数
		 */
		checkIsInt : function(data){
			if(!this.checkNotNull(data)){
				return false;
			}
			return typeof(data) == "number" && parseInt(data) == data;
		},
		
		checkIsIntForLog : function(data, fieldMsg){
			if(!checkIsInt(data)){
				cc.log(fieldMsg + " is not a int. value:"+data+".");
			}
		},
		
		/**
		 * 检查对象是否数字
		 */
		checkIsNumber : function(data){
			if(!this.checkNotNull(data)){
				return false;
			}
			return typeof(data) == "number";
		},
		
		checkIsNumberForLog : function(data, fieldMsg){
			if(!checkIsNumber(data)){
				cc.log(fieldMsg + " is not a number. value:"+data+".");
			}
		},

		/**
		 * 检测对象是否为数组
		 */
		checkIsArray : function(data){
			if(!this.checkNotNull(data)){
				return false;
			}
			return data instanceof Array;
		},
		
		checkIsArrayForLog : function(data, fieldMsg){
			if(!checkIsArray(data)){
				cc.log(fieldMsg + " is not a array. value:"+data+".");
			}
		},

		/**
		 * 检测数组是否非空
		 */
		checkArrayNotNull : function(data){
			if(this.checkIsArray(data)){
				return data.length > 0;
			}
			return false;
		},
		
		checkArrayNotNullForLog : function(data, fieldMsg){
			if(!this.checkArrayNotNull(data)){
				cc.log(fieldMsg + " is empty.");
			}
		},
		
		/**
		 * 检查数组内容情况
		 * 空，返回0，否则返回size
		 */
		checkArraySize : function(data, fieldName, isShowLog){
			if(this.checkIsArray(data, fieldName, isShowLog)){
				var field =this.getValue(data, fieldName);
				return field.length;
			}
			return 0;
		},
		
		/**
		 * 检测对象是否为Object
		 */
		checkIsObject : function(data){
			if(!this.checkNotNull(data)){
				return false;
			}
			return data instanceof Object;
		},
		
		/**
		 * 用于检查的
		 * @param action
		 */
		showArray : function(array){
			cc.log("### showArray");
			for(var i in array){
				cc.log(array[i].name);
			}
		}
};
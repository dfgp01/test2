/**
 * 数据验证类
 */
Validator = {
	/**
	 * 建立一个验证器
	 */
	create : function(json){
		if(!this.validateObject(json, this._getSelfCheck())){
			return null;
		}
		var v = new Validate();
		v.field = json.field;
		v.type = json.type;
		v.required = v.required || !!json.required;	//简易写法
		v.range = json.range ? json.range : v.range;
		v.defaultValue = json.defaultValue;
		return v;
	},
	
	/**
	 * 自我审查-_-0
	 */
	_selfChk : null,
	_getSelfCheck : function(){
		if(!this._selfChk){
			var fieldCheck = new Validate();
			fieldCheck.field = "field";
			fieldCheck.type = "string";
			var typeCheck = new Validate();
			typeCheck.field = "type";
			typeCheck.type = "string";
			var requiredCheck = new Validate();
			requiredCheck.field = "required";
			requiredCheck.type = "boolean";
			var rangeCheck = new Validate();
			rangeCheck.field = "range";
			rangeCheck.type = "array";
			rangeCheck.range = [2,2];
			var rangeValueCheck = new Validate();
			rangeValueCheck.field = "range";
			rangeCheck.type = "array-number";
			rangeCheck.range = [-9999,9999];
			this._selfChk = [fieldCheck, typeCheck, requiredCheck, rangeCheck, rangeValueCheck];
		}
		return this._selfChk;
	},
	
	_selfCheck : function(json){
		var msg = null;
		if(!DataUtil.checkNotNull(json)){
			return " json data is null.";
		}
		if(!DataUtil.checkIsString(json.field)){
			return "field is necessary.";
		}
		if(!DataUtil.checkIsString(json.type)){
			return "type is necessary.";
		}
		if(DataUtil.checkNotNull(json.range) && (
				!DataUtil.checkArrayNotNull(json.range) || json.range.length != 2 || !DataUtil.checkIsNumber(json.range[0]) || !DataUtil.checkIsNumber(json.range[1]))){
			return "range error.";
		}
		return null;
	},
	
	validate : function(val, validateObj){
		var type = validate.type;
		var isNotNull = DataUtil.checkNotNull(val);
		if(validate.required && !isNotNull){
			return " must not null.";
		}
		if(isNotNull){
			return this._assertType(val, type);
		}
		return null;
	},
	
	/**
	 * 校验对象数据
	 * 若没有校验器，则只做对象的非空检测。
	 */
	validateObject : function(data, validates){
		if(!this.checkNotNull(data)){
			cc.log("data-object is null.");
			return false;
		}
		if(!validates){
			return true;
		}
		if(!this.checkArrayNotNull(validates)){
			cc.log("validates error.");
			return false;
		}
		var field = null;
		var msg = null;
		for(var i in validates){
			field = validates[i].field;
			msg = this.validate(data[field], validates[i]);
			if(msg){
				cc.log("field:"+field+" "+msg);
				return false;
			}
		}
		return true;
	},
	
	/**
	 * 断言判断，加上提示语句。
	 */
	_assertType : function(val, type){
		if(!type || type==null){
			return " type error.";
		}
		var msg = null;
		//基础类型判断
		if((type=='number'||type=='string'||type=='object'||type=='array') && typeof(val) != type){
			msg = " value:"+val+" is not "+type+".");
		}
		//整型判断
		else if(type=='int' && !(typeof(val) == "number" && parseInt(val) == val)){
			msg = " value:"+val+" is not "+type+".");
		}
		//多类型递归判断
		else if(type.indexOf(",") > -1){
			var types = type.split(",");
			for(var i in types){
				msg = this._assertType(val, types[i]);
				if(!msg){//验证通过
					return null;
				}
			}
		}
		//数组内类型判断
		else if(type.indexOf("array-") > -1){
			if(!DataUtil.checkArrayNotNull(val)){
				return " not an array or array is null.";
			}
			type = type.substring(type.indexOf("array-"));
			for(var i in val){
				msg = this._assertType(val[i], type);
				if(!msg){//验证通过
					return null;
				}
			}
		}
		//自定义类型判断
		else{
			var t = this.types[type];
			if(!t){
				return " type:"+type + " not exists.";
			}
			msg = t(val);
		}
		return msg;
	},
	
	/**
	 * 自定义类型验证
	 */
	addType : function(type, func){
		var t = this.types[type];
		if(t){
			cc.log("Validator.addType error. type:"+type+" exists.");
			return;
		}
		this.types[type] = func;
	}
};
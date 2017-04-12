/**
 * 数据验证类
 */
Validator = {
	
	/**
	 * 初始化
	 * 一些公共的自定义类型数据验证写在这里
	 */
	init : function(){
		//矩形数据校验
		this.addType("rect",function(val){
			return DataUtil.checkArrayNotNull(val) && val.length==4 &&
				DataUtil.checkIsNumber(val[0]) && DataUtil.checkIsNumber(val[1]) &&
				DataUtil.checkIsNumber(val[2]) && val[2] > 0 &&
				DataUtil.checkIsNumber(val[3]) && val[3] > 0 ? null : " not a rect data.";
		});
		
		//帧数据校验
		/*var _valFr = Validator.creates([{
			field : "name",
			type : "string",
			range : [1,99],
			required : true
		},{
			field : "time",
			type : "number",
			required : true
		},{
			field : "position",
			type : "array",
			range : [2,2]
		},{
			field : "position",
			type : "array-number"
		},{
			field : "rect",
			type : "rect"
		},{
			field : "type",
			type : "int",
			range : [Constant.ANIMATE_STATIC,Constant.ANIMATE_SCROLL]
		}]);
		this.addType("frame",function(val){
			return Validator.validateObject(val, _valFr);
		});*/
	},
	
	/**
	 * 建立一个验证器
	 */
	create : function(json){
		var msg = this._selfCheck(json);
		if(msg){
			cc.log(msg);
			return null;
		}
		var v = new Validate();
		v.field = json.field;
		v.type = json.type;
		v.required = v.required || !!json.required;	//简易写法
		v.range = json.range ? json.range : v.range;
		return v;
	},
	
	creates : function(jsonArr){
		if(!DataUtil.checkArrayNotNull(jsonArr)){
			cc.log("create validates error.");
			return null;
		}
		var validate = null;
		var validates = [];
		for(var i in jsonArr){
			validate = this.create(jsonArr[i]);
			if(!validate){
				return null;
			}
			validates.push(validate);
		}
		return validates;
	},
	
	/**
	 * 自我审查-_-0
	 */
	_selfCheck : function(json){
		var msg = null;
		if(!DataUtil.checkNotNull(json)){
			return "json data is null.";
		}
		/*if(!DataUtil.checkIsString(json.field)){
			return "field is necessary.";
		}*/
		if(!DataUtil.checkIsString(json.type)){
			return "type is necessary.";
		}
		if(DataUtil.checkNotNull(json.range) && (
				!DataUtil.checkArrayNotNull(json.range) || json.range.length != 2 || !DataUtil.checkIsNumber(json.range[0]) || !DataUtil.checkIsNumber(json.range[1]))){
			return "range error.";
		}
		return null;
	},
	
	/**
	 * 校验object类型数据
	 */
	validateObject : function(data, validates){
		if(!this.checkNotNull(data)){
			return "data-object is null.";
		}
		if(!this.checkArrayNotNull(validates)){
			return "validates error.";
		}
		var field = null;
		var msg = null;
		for(var i in validates){
			field = validates[i].field;
			msg = this.validate(data[field], validates[i]);
			if(msg){
				return "field:"+field+" "+msg;
			}
		}
		return null;
	},
	
	/**
	 * 数据校验
	 */
	validate : function(val, validate){
		if(!validate){
			return "validate is undefind or null.";
		}
		
		//非空校验
		var isNotNull = DataUtil.checkNotNull(val);
		if(validate.required && !isNotNull){
			return " must not null.";
		}
		//如果允许为空，但又填了数据的，也要进行合法校验
		if(isNotNull){
			//类型检测是必须的，否则无法往下进行校验
			return this._assertType(val, validate.type) ||
				validate.range ? this._assertRange(val, type, validate.range) : null;	//范围检测
		}
		return null;
	},
	
	/**
	 * 类型判断，返回错误提示语句，如通过，则返回空
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
	 * 范围判断，返回错误提示语句，如通过，则返回空
	 */
	_assertRange : function(val, type, range){
		//目前只有 string,number,array支持range判断
		val = type=='number' ? val : type=='string'||type=='array' ? val.length : null;
		return val==null ? null : val >= range[0] && val <= range[1] ? null : "val:"+val+ " out of range.";
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
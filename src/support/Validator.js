/**
* 数据校验实体
*/
Validate = cc.Class.extend({
	field : null,	//字段名称,string类型
	type : null,	//数据类型,string类型
	required : false,	//是否必填，默认否
	range : [0,99]		//数值范围，数值类型为区间值，string类型为字符串长度，array为数组长度
});

/**
 * 验证返回结果
 */
ValidateResult = cc.Class.extend({
	isSuccess : true,
	message : null
});

/**
 * 数据验证器
 */
Validator = {
	
	/**
	 * 初始化
	 * 一些公共的自定义类型数据验证写在这里
	 */
	init : function(){
		this._addBasicType();
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
	
	_addBasicType : function(){
		this.addType(Constant.DATA_TYPE_INT, function(val){
			return typeof(val) == "number" && parseInt(val) == val;
		});
		this.addType(Constant.DATA_TYPE_NUMBER, function(val){
			return typeof(val) == "number";
		});
		this.addType(Constant.DATA_TYPE_STRING, function(val){
			return typeof(val) == "string";
		});
		this.addType(Constant.DATA_TYPE_OBJECT, function(val){
			return typeof(val) == "object";
		});
		this.addType(Constant.DATA_TYPE_ARRAY, function(val){
			return typeof(val) == "array";
		});
	},
	
	_addBasicRange : function(){
		this.addRange(Constant.DATA_TYPE_INT, function(val, min, max){
			return val >= min && val <= max;
		});
		this.addRange(Constant.DATA_TYPE_NUMBER, function(val, min, max){
			return val >= min && val <= max;
		});
	}
	
	/**
	 * 类型判断，返回错误提示语句，如通过，则返回空
	 */
	_assertType : function(val, type){
		//多类型递归判断
		if(type.indexOf(",") > -1){
			var types = type.split(",");
			for(var i in types){
				msg = this._assertType(val, types[i]);
				if(!msg){//验证通过
					return null;
				}
			}
			return " value:"+val+" is not in("+types+").");"
		}
		//数组内类型判断
		else if(type.indexOf(Constant.DATA_TYPE_ARRAY + "-") > -1){
			var msg = this._assertType(val, Constant.DATA_TYPE_ARRAY);
			if(!msg || val.length==0){
				return " not an array or array is null.";
			}
			type = type.substring(type.indexOf("array-"));
			for(var i in val){
				msg = this._assertType(val[i], type);
				if(msg){//验证不通过
					return " value:"+val+" is not array-"+type+".");"
				}
			}
			return null;
		}
		
		//自定义类型或基础类型判断
		var func = this._types[type];
		if(!func){
			return "type:"+type+" has not validator.";
		}
		return func(val) ? null : " value:"+val+" is not "+type+".");
	},
	
	/**
	 * 范围判断，返回错误提示语句，如通过，则返回空
	 */
	_assertRange : function(val, type, range){
		//目前只有 string,number,array支持range判断
		val = type=='number' ? val : type=='string'||type=='array' ? val.length : null;
		return val==null ? null : val >= range[0] && val <= range[1] ? null : "val:"+val+ " out of range.";
	},
	
	_types : {},
	_ranges : {},
	
	/**
	 * 自定义类型验证
	 */
	addType : function(type, func){
		var t = this._types[type];
		if(t){
			cc.log("Validator.addType error. type:"+type+" exists.");
			return;
		}
		this._types[type] = func;
	},
	
	/**
	 * 自定义范围验证
	 */
	addRange : function(type, func){
		var t = this._ranges[type];
		if(t){
			cc.log("Validator.addRange error. type:"+type+" exists.");
			return;
		}
		this._ranges[type] = func;
	}
};
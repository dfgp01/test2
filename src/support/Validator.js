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
		this._initRectCheck();
		
		
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
 	* 	非空校验
 	*/
	assertNotNull : function(val, label){
		//因为js的0和""是一样的(""==0 为true)，所以要分开判断
		if(val == 0){
			return true;
		}
		if(val == undefined || val == null || val == ""){
			cc.log(label + " must not null.");
			return false;
		}
		return true;
	},

	assertArrayNotNull : function(val, label){
		if(this.assertNotNull(val, label)){
			if(typeof(val) != "array"){
				cc.log(label + " is not array.");
				return false;
			}
			if(val.length <= 0){
				cc.log("array:"+label+" is empty.");
				return false;
			}
			return true;
		}
		return false;
	},

	assertObject : function(val, label){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		if(typeof(val) == 'object'){
			return true;
		}
		cc.log(label + " is not object.");
		return false;
	},

	assertNumber : function(val, label){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		if(typeof(val) == 'number'){
			return true;
		}
		cc.log(label + " is not number.");
		return false;
	},

	assertInt : function(val, label){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		if(typeof(val) == 'number' && parseInt(val) == val){
			return true;
		}
		cc.log(label + " is not int.");
		return false;
	},

	assertString : function(){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		if(typeof(val) == 'string'){
			return true;
		}
		cc.log(label + " is not string");
		return false;
	},

	/**
	 * 数值范围判断，如果超出许可范围，则在控制台输出信息
	 */
	assertNumberRange : function(val, min, max, label){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		if(val < min){
			cc.log(label + " value:" + val + " could not less then " + min + ".");
			return false;
		}
		if(val < max){
			cc.log(label + " value:" + val + " could not bigger then " + max + ".");
			return false;
		}
		return true;
	},

	assertArrayContentType : function(arr, type, label){
		if(!this.assertArrayNotNull(val, label)){
			return false;
		}
		for(var i=0; i<arr.length; i++){
			if(!this._assertType(arr[i], type, label+"["+i+"]")){
				return false;
			}
		}
		return true;
	},

	/**
	 * 类型判断，返回错误提示语句，如通过，则返回空
	 */
	assertType : function(val, type, label){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		//数组内类型判断
		if(type.indexOf("array-") > -1){
			type = type.substring(type.indexOf("array-"));
			return this.assertArrayContentType(val, type, label);
		}
		if(this._isBasicType(type)){
			return this._checkBasicType(val, type, label);
		}
		//自定义类型或基础类型判断
		var func = this._types[type];
		if(!func){
			cc.log("type:"+type+" has not validator.");
			return false;
		}
		return func(val, label, param);
	},



	_addRectCheck : function () {
		//矩形数据一定是一个长度为4的数组，数组内只能是数字，且宽高必须大于0.
		this.addType("rect",function(val, label, param){
			if(!this.assertArrayNotNull(val, label)){
				return false;
			}
			var widthMin = 0;
			var widthMax = 0;
			var heightMin = 0;
			var heightMax = 0;
			if(param){
				widthMin = param.widthMin && this._assertType(param.widthMin, "number", "widthMin") ? param.widthMin : 1;
				widthMax = param.widthMax && this._assertType(param.widthMax, "number", "widthMax") ? param.widthMax : 1;
				heightMin = param.heightMin && this._assertType(param.heightMin, "number", "heightMin") ? param.heightMin : 1;
				heightMax = param.heightMax && this._assertType(param.heightMax, "number", "heightMax") ? param.heightMax : 1;
			}
			return this.assertNumberRange(val.length, 4, 4, label+"-length") &&
				this.assertArrayContentType(val, "number", label) &&
				this.assertNumberRange(val[2], widthMin, widthMax) &&
				this.assertNumberRange(val[3], heightMin, heightMax);
		});
	},
	
	/**
	 * 建立一个验证器
	 */
	create : function(field, type, isRequired, rangeMin, rangeMax){
		var v = new Validate();
		v.field = field;
		v.type = type;
		v.required = isRequired;
		v.range = [rangeMin, rangeMax];
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
	},
	
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
			return " value:"+val+" is not in("+types+").";
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
					return " value:"+val+" is not array-"+type+".";
				}
			}
			return null;
		}
		
		//自定义类型或基础类型判断
		var func = this._types[type];
		if(!func){
			return "type:"+type+" has not validator.";
		}
		return func(val) ? null : " value:"+val+" is not "+type+".";
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
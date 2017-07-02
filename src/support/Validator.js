/**
* 数据校验实体
*/
ValidateParam = cc.Class.extend({
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
		//矩形数据校验
		this._initRectCheck();
		//坐标数据校验
		this._initPositionCheck();
		//人物角色数据校验
		this._initCharacterCheck();
	},
	
	/**
	 * 自定义类型验证函数
	 */
	_types : {},
	addType : function(type, func){
		var t = this._types[type];
		if(t){
			cc.log("Validator.addType error. type:"+type+" exists.");
			return;
		}
		this._types[type] = func;
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
			cc.log(label + " is null.");
			return false;
		}
		return true;
	},
	
	/**
	 * 是否数组
	 */
	assertArray : function(val, label){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		if(typeof(val) == 'array'){
			return true;
		}
		cc.log(label + " is not array.");
		return false;
	},

	/**
	 * 是否object
	 */
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

	/**
	 * 是否数值，含整数和浮点数
	 */
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

	/**
	 * 是否整数
	 */
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

	/**
	 * 是否字符串
	 */
	assertString : function(val, label){
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
	 * 数值范围检验
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
	
	/**
	 * 字符串长度范围检验
	 */
	assertStringRange : function(val, min, max, label){
		return this.assertString(val, label) && this.assertNumberRange(val.length, min, max, label+"-length");
	},
	
	/**
	 * 数组长度范围检验
	 */
	assertArrayRange : function(val, min, max, label){
		return this.assertArray(val, label) && this.assertNumberRange(val.length, min, max, label+"-length");
	},
	
	/**
	 * 数组非空检验
	 */
	assertArrayNotNull : function(val, label){
		if(!this.assertArray(val, label)){
			return false;
		}
		if(val.length == 0){
			cc.log("array:"+label+" is empty.");
			return false;
		}
		return true;
	},

	/**
	 * 数组内类型检验
	 */
	assertArrayContentType : function(arr, type, label){
		if(!this.assertArrayNotNull(val, label)){
			return false;
		}
		for(var i=0; i<arr.length; i++){
			if(!this.assertType(arr[i], type, label+"["+i+"]")){
				return false;
			}
		}
		return true;
	},
	
	/**
	 * 类型检查，包括基础类型和自定义类型
	 */
	assertType : function(val, type, label){
		if(!this.assertNotNull(val, label)){
			return false;
		}
		//基础类型检查
		if(this._isBasicType(type)){
			return this._checkBasicType(val, type);
		}
		//自定义类型则交给自定义的检查方法
		var func = this._types[type];
		if(!func){
			cc.log("type:"+type+" has not validator.");
			return false;
		}
		return func(val, label);
	},
	
	_isBasicType : function(type){
		return type=='number'||type=='int'||type=='string'||type=='object'||type=='array';
	},
	
	_checkBasicType(val, type){
		if(type=='number'||type=='string'||type=='object'||type=='array'){
			return typeof(val)==type;
		}
		else if(type=='int'){
			return typeof(val)=='number' && parseInt(val) == val;
		}
		else{
			return false;
		}
	},
	
	/**
	 * 入口函数
	 */
	validate : function(val, validate, label){
		if(!validate){
			cc.log(label + " validate is undefind or null.");
			return false;
		}
		
		//非空校验
		var isNotNull = (val == undefined || val == null);
		if(validate.required && !isNotNull){
			cc.log(label + " must not null.");
			return false;
		}
		//如果允许为空，但又填了数据的，也要进行合法校验
		if(isNotNull){
			return this.assertType(val, validate.type, label) && this._checkBasicRange(val, validate.type, validate.rangeMin, validate.rangeMax, label);
		}
		return true;
	},
	
	/**
	 * 检验基础类型的数据范围
	 */
	_checkBasicRange(val, type, min, max, label){
		if(type=='number'||type=='int'){
			return this.assertNumberRange(val, min, max, label);
		}
		else if(type=='string'){
			return this.assertStringRange(val, min, max, label);
		}
		else if(type=='array'){
			return this.assertArrayRange(val, min, max, label);
		}else if(type=='object'){
			return true;
		}else{
			return true;
		}
	},
	
	/**
	 * 建立一个验证器
	 * 如果不是基础类型，则不需要填rangeMin, rangeMax参数
	 * 如果field为空，则默认校验当前整体对象。
	 */
	create : function(field, type, isRequired, rangeMin, rangeMax){
		if(!this.assertString(type, "type")){
			cc.log("Validator.create error. type must not null.");
			return null;
		}
		if(this._isBasicType(type)){
			if(!(rangeMin && this.assertNumber(rangeMin, "rangeMin"))){
				rangeMin = 1;	//常量以后再定，先占位
			}
			if(!(rangeMin && this.assertNumber(rangeMax, "rangeMax"))){
				rangeMax = 1;	//常量以后再定，先占位
			}
		}
		var v = new ValidateParam();
		v.field = field;
		v.type = type;
		v.required = isRequired;
		v.range = [rangeMin, rangeMax];
		return v;
	},
	
	/**
	 * 校验对象数据
	 */
	validateObject : function(val, validateParams, label){
		if(!(this.assertNotNull(val, label) && this.assertArrayNotNull(validateParams, label+"-validateParams"))){
			return false;
		}
		for(var i in validateParams){
			var param = validateParams[i];
			if(!this.validate(
					val[param.field], param, param.field)){
				return false;
			}
		}
		return true;
	},
	
	/**
	 * 类型判断，返回错误提示语句，如通过，则返回空
	 */
	/*_assertType : function(val, type){
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
	},*/
	
	_initRectCheck : function(){
		//矩形数据一定是一个长度为4的数组，数组内只能是数字，且宽高必须大于0.
		this.addType("rect",function(val, label){
			if(!this.assertArrayNotNull(val, label)){
				return false;
			}
			/*if(param){
				widthMin = param.widthMin && this._assertType(param.widthMin, "number", "widthMin") ? param.widthMin : 1;
				widthMax = param.widthMax && this._assertType(param.widthMax, "number", "widthMax") ? param.widthMax : 1;
				heightMin = param.heightMin && this._assertType(param.heightMin, "number", "heightMin") ? param.heightMin : 1;
				heightMax = param.heightMax && this._assertType(param.heightMax, "number", "heightMax") ? param.heightMax : 1;
			}*/
			return this.assertArrayRange(val, 4, 4, label) &&
				this.assertArrayContentType(val, "number", label) &&
				this.assertNumberRange(val[2], 0.1, 99999, label+"-width") &&
				this.assertNumberRange(val[3], 0.1, 99999, label+"-height");
		});
	},
	
	_initPositionCheck : function(){
		this.addType("position2D", function(val, label){
			return this.assertArrayNotNull(val, label) &&
				this.assertArrayRange(val, 2, 2, label) &&
				this.assertArrayContentType(val, "number", label);
		});
	},
	
	_initCharacterCheck : function(){
		var chrcVldts = [
		      this.create("stand","action",true),
		      this.create("walk","action",false),
		      this.create("hit","action",false)];
		Validator.addType("character",function(val, label){
			return Validator.validateObject(val, chrcVldts, label);
		});
	}
};
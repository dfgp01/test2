/**
 * 动作组件验证器
 */
ComponentValidator = {
	
	_valMv : null,
	validateMove : function(data){
		if(!this._valMv){
			this._valMv = Validator.creates([{
				field : "dx",
				type : "number"
			},{
				field : "dy",
				type : "number"
			},{
				field : "dz",
				type : "number"
			},{
				field : "type",
				type : "int",
				range : [Constant.MOVE_NORMAL,Constant.MOVE_NORMAL];
			}]);
		}
		if(!(data.dx||data.dy||data.dz)){
			return " dx,dy,dz must has one at lease.";
		}
		return Validator.validateObject(data, this._valMv);
	},
	
	_valVw : null,
	validateView : function(data){
		if(!this._valVw){
			this._valVw = Validator.creates([{
				field : "animates",
				type : "array",
				required : true,
				range : [1,10]
			},{
				field : "shader",
				type : "object"
			}]);
		}
		return Validator.validateObject(data, this._valVw);
	},
	
	_valAnmt : null,
	validateAnimate : function(data){
		if(!this._valAnmt){
			this._valAnmt = Validator.create([{
				field : "type"
				type : "int",
				range : [Constant.ANIMATE_STATIC,Constant.ANIMATE_SCROLL]
			},{
				field : "frames",
				type : "array",
				range : [1,99],
				required : true
			}]);
		}
		return Validator.validate(data, this._valAnmt);
	},
	
	_valFr : null,
	validateFrame : function(data){
		if(!this._valFr){
			this._valFr = Validator.creates([{
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
			}]);
		}
		return Validator.validateObject(data, this._valFr);
	}
};
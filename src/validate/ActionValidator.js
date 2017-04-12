/**
 * 验证动作数据
 */
ActionValidator = {
	/**
	 * 验证一般action
	 */
	_valAct : null,
	validateAct : function(data){
		if(!this._valAct){
			this._valAct = [Validator.create({
				field : "name",
				type : "string",
				required : true
			})];
		}
		return (data.view||data.repeat||data.sequence) &&
		Validator.validateObject(data, this._valAct);
	},
	
	/**
	 * 验证动作序列
	 */
	_valSeq : null,
	validateSeq : function(data){
		if(!this._valSeq){
			this._valSeq = [Validator.create({
				field : "actions",
				type : "array",
				required : true,
				range : [1,99]
			}),Validator.create({
				field : "actions",
				type : "array-action,string",
				required : true
			})];
		}
		return Validator.validateObject(data, this._valSeq);
	},
	
	/**
	 * 验证重复动作
	 */
	_valRept : null,
	validateRept : function(){
		if(!this._valRept){
			this._valRept = [Validator.create({
				field : "action",
				type : "string,object",
				required : true
			}),Validator.create({
				field : "count",
				type : "int",
				required : true,
				range : [1,99]
			})];
		}
		return Validator.validateObject(data, this._valSeq);
	}
};
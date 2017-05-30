/**
 * 用于建造组件的工厂类
 */
ComponentFactory = {
	
	/**
	 * 动作指令组件
	 */
	createCommand : function(data){
		data.type = DataUtil.checkIsInt(data.type) ? data.type : Constant.COMMAND_DEFAULT;
		var command = null;
		switch(data.type){
		case Constant.COMMAND_DEFAULT:
			command = new CommandComponent();
			break;
		case Constant.COMMAND_STAND:
			command = new StandCommandComponent();
			break;
		case Constant.COMMAND_WALK:
			command = new WalkCommandComponent();
			break;
		case Constant.COMMAND_ATTACK:
			command = new AttackCommandComponent();
			break;
		}
		command.init(data);
		return command;
	},
	
	/**
	 * 创建攻击组件
	 */
	createHit : function(data){
		if(!DataUtil.checkArrayNotNull(data.hitDatas)){
			cc.log("createHit error. hitDatas error.");
			return null;
		}
		var hit = new HitComponent();
		
		var list = [];
		for(var i in data.hitDatas){
			var _hitData = data.hitDatas[i];
			var htDt = this.createHitData(_hitData);
			list.push(htDt);
		}
		hit.init({hitDatas:list});
		return hit;
	},
	
	/**
	 * 创建攻击判定数据
	 */
	createHitData : function(data){
		if(!DataUtil.validate(data,{
			startFrame 	:'int',
			endFrame	:'int',
			damage		:'number',
			rect		:'rect',
			max			:'int'
		})){
			cc.log("createHitData error. please check data.");
			return null;
		}
		var htDt = new HitDataComponent();
		htDt.init({
			startFrame 	:data.startFrame,
			endFrame	:data.endFrame,
			damage		:data.damage,
			rect		:data.rect,
			max			:data.max
		});
		return htDt;
	}
}
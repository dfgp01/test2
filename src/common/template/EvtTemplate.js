/**
 * 	事件数据模板，封装对象用
 */
EvtTemplate = {
	
	/**
	 * 攻击发起事件
	 */
	hitEvent : function(source, hitCom, targets){
		var evt = {};
		evt.type = Constant.MsgType.Unit.HIT;
		evt.content = {};
		evt.content.targets = targets;
		evt.content.source = source;
		evt.content.hitCom = hitCom;
		return evt;
	},
	
	hurtEvent : function(target, hitMap){
		var evt = {};
		evt.type = Constant.MsgType.Unit.HURT;
		evt.content = {};
		evt.content.target = target;
		evt.hitMap = hitMap;
		return evt;
	},

	/**
	 * 用于传到每个被击的unit中计算的
	 */
	hitMap : function(content){
		var source = content.source;
		var hitCom = content.hitCom;
		var map = {};
		map.source = source;
		var sourceObj = source;
		//对象是子弹类的话，是没有基础力量的，要取它的宿主
		if(source.type == Constant.Unit.Type.BULLET){
			sourceObj = source.coms.master.parent;
		}
		//目前伤害计算公式（不算BUFF）：单位基础力量 * 技能伤害系数， 例：基础力量23，技能攻击力280%， 23 * (280/100) = 64.4
		map.damage = sourceObj.coms.hit.strength * (hitCom.damage / 100);
		map.type = hitCom.type;
		var buffIds = sourceObj.coms.buff.hit;
		for(var i in buffIds){
			//buff叠加逻辑
		}
	}
};
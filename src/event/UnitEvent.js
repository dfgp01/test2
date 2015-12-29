
UnitEventScheduler = EventScheduler.extend({
	name : "unit",
	hitCallBack : null,
	hurtCallBack : null,

	ctor : function(){
		this._super();
		this.hitCallBack = new UnitHitCallback();
		this.addListener(this.hitCallBack);
		this.hurtCallBack = new UnitHurtCallback();
		this.addListener(this.hurtCallBack);
	},
});

UnitHitCallback = EventCallback.extend({
	name : "hit",

	/**
	 * unit击中目标后会触发这个事件
	 */
	response : function(content){
		var hitMap = EvtTemplate.hitMap(content);
		var targets = content.targets;
		for(var i in targets){
			Service.dispatchEvent(EvtTemplate.hurtEvent(targets[i], hitMap));
		}
	}
});

UnitHurtCallback = EventCallback.extend({
	name : "hurt",

	/**
	 * unit被击中后会触发这个事件
	 */
	response : function(content){
		var target = content.target;
		if(source.active && target.active){
			//详细计算
		}
	}
});
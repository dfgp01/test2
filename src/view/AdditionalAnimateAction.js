/**
 * 独立/附加的动画类
 * 执行时会获取一个新的view组件
 * 只运行在action中，结束时会回收
 */
AdditionalAnimateAction = AnimateAction.extend({

	start : function(unit){
		//获取一个普通独立单位，用于执行动画
		var cache = this.getCacheValue(unit);
		cache.unit = GameObjectFactory.getNewEntity(
						GameObjectConstant.templateId.PUBLIC);
		this._super(cache.unit);
	},

	update : function(dt, unit){
		//取出关联的普通独立单位继续执行
		this._super(dt, this.getCacheValue(unit).unit);
	},
	
	exit : function(unit){
		GameObjectFactory.recycle(
			this.getCacheValue(unit).unit);
	}
});

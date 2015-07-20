/**
 * 玩家控制器图层
 */
ControllerLayer = cc.Layer.extend({
	winSize : 0,
	ctor : function(){
		this._super();
		this.winSize = cc.winSize;
	}
});
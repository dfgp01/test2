/**
 * 渲染主系统
 */
RenderUpdateSystem = System.extend({
	name : "view",
	tick : Constant.TICK_FPS24,
	
	list : null,
	
	start : function(){
		this.list = ObjectManager.getViewComList();
	},
	
	update : function(dt){
		//this._curr = ObjectManager.propertys.getFirstViewNode();
		//this._super(dt);
		this.list.iterator(this._callback);
	},
	
	_callback : function(viewComponent){
		this._renderOrientation(viewComponent);
		this._renderFrame(viewComponent);
		this._renderPosition(viewComponent);
	},
	
	execute : function(dt, unitViewNode){
		this._renderOrientation(unitViewNode);
		this._renderFrame(unitViewNode);
		this._renderPosition(unitViewNode);
	},
	
	/**
	 * 更新面向
	 */
	_renderOrientation : function(viewProperty){
		if(viewProperty.nextVx != null){
			viewProperty.vx = viewProperty.nextVx;
			viewProperty.nextVx = null;
			//unit.viewCom.sprite._scaleX = viewProperty.vx;
			//unit.viewCom.sprite.setFlippedX(false);	//不知道哪个生效
		}
	},
	
	/**
	 * 更新帧
	 */
	_renderFrame : function(viewProperty){
		for(var i in viewProperty.frameStates){
			if(viewProperty.frameStates[i].next != null){
				EngineUtil.setFrame(viewProperty.frameStates[i].sprite, viewProperty.frameStates[i].next);
				viewProperty.frameStates[i].next = null;
			}
		}
	},
	
	/**
	 * 更新位置
	 */
	_renderPosition : function(viewProperty){
		if(viewProperty.dx!=0 || viewProperty.dy!=0 || viewProperty.dz!=0){
			for(var i in viewProperty.frameStates){
				EngineUtil.setPosition(viewProperty.frameStates[i], viewProperty);
				viewProperty.dx = viewProperty.dy = viewProperty.dz = 0;
			}
		}
	}
});
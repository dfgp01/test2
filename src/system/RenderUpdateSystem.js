/**
 * 渲染主系统
 */
RenderUpdateSystem = System.extend({
	name : "view",
	tick : Constant.TICK_FPS24,
	
	update : function(dt){
		this._curr = ObjectManager.propertys.getFirstViewNode();
		this._super(dt);
	},
	
	execute : function(dt, unitViewNode){
		this.renderOrientation(unitViewNode);
		this.renderFrame(unitViewNode);
		this.renderPosition(unitViewNode);
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
	renderPosition : function(viewProperty){
		if(viewProperty.dx!=0 || viewProperty.dy!=0 || viewProperty.dz!=0){
			for(var i in viewProperty.frameStates){
				EngineUtil.setPosition(viewProperty.frameStates[i], viewProperty);
				viewProperty.dx = viewProperty.dy = viewProperty.dz = 0;
			}
		}
	}
});
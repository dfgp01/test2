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
		this.renderFrame(unitViewNode);
		this.renderPosition(unitViewNode);
	},
	
	/**
	 * 更新帧
	 */
	renderFrame : function(viewProperty){
		if(viewProperty.lastVx != viewProperty.vx){
			//unit.viewCom.sprite._scaleX = viewProperty.vx;
			//unit.viewCom.sprite.setFlippedX(false);	//不知道哪个生效
			viewProperty.lastVx = viewProperty.vx;
		}
		if(viewProperty.frame != null){
			EngineUtil.setFrame(viewProperty.body, viewProperty.frame);
			viewProperty.frame = null;
		}
	},
	
	/**
	 * 更新位置
	 */
	renderPosition : function(viewProperty){
		/*var moveProperty = viewProperty.owner.propertys.move;
		if(moveProperty){
			viewProperty.dx += moveProperty.dx;
			viewProperty.dy += moveProperty.dy;
		}*/
		if(viewProperty.dx!=0 || viewProperty.dy!=0){
			EngineUtil.setPosition(viewProperty.body, viewProperty);
			viewProperty.dx = viewProperty.dy = 0;
		}
	}
});
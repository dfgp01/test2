/**
 * 渲染主系统
 */
RenderUpdateSystem = System.extend({
	name : "view",
	_view : null,
	tick : Constant.TICK_FPS24,
	
	/**
	 * 加入到链表中，并初始化第一帧
	 */
	/*addComponent : function(viewCom){
		this._super(viewCom);
		viewCom.frameIndex = 0;
		viewCom.lastFrameIndex = -1;	//这里设为-1，可以触发update时渲染新帧
		viewCom.interval = 0;
	},*/
	
	update : function(dt){
		
		this._view = ComponentManager.viewFirstNode();
		while(this._view!=null){
			this.renderFrame(this._view);
			this._view = this._view.next;
			ComponentManager.deleteNode(this._view.prep);
		}
		
		this._move = ComponentManager.moveFirstNode();
		while(this._move!=null){
			this.renderPosition(this._move);
			this._move = this._move.next;
		}
	},
	
	renderFrame : function(viewCom){
		if(viewCom.vx != 0){
			//unit.viewCom.sprite._scaleX = 1;
			//unit.viewCom.sprite.setFlippedX(false);	//不知道哪个生效
			viewCom.vx = 0;
		}
		EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[viewCom.frameIndex]);
	},
	
	renderPosition : function(moveCom){
		if(moveCom.dx!=0 || moveCom.dy!=0){
			EngineUtil.setPosition(moveCom.owner.viewCom.sprite, moveCom);
		}
	},
	
	execute : function(dt, viewCom){
		if(viewCom.vx != viewCom.lastVx){
			//unit.viewCom.sprite._scaleX = 1;
			//unit.viewCom.sprite.setFlippedX(false);	//不知道哪个生效
			viewCom.lastVx = viewCom.vx;
		}
		if(viewCom.frameIndex != viewCom.lastFrameIndex){
			EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[viewCom.frameIndex]);
			viewCom.lastFrameIndex = viewCom.frameIndex;
		}
	}
});
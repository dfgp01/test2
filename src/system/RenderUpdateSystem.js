/**
 * 渲染主系统
 */
RenderUpdateSystem = System.extend({
	name : "view",
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
		this._curr = ObjectManager.propertys.getFirstViewNode();
		this._super(dt);
		/*while(this._view!=null){
			this.renderFrame(this._view);
			this._view = this._view.next;
			ObjectManager.coms.removeViewNode(this._view.prep);
		}
		
		this._move = ObjectManager.coms.getFirstMoveNode();
		while(this._move!=null){
			this.renderPosition(this._move);
			this._move = this._move.next;
		}*/
	},
	
	execute : function(dt, unitViewNode){
		this.renderFrame(this.unitViewNode);
		this.renderPosition(this.unitViewNode);
		ObjectManager.propertys.removeViewNode(this.unitViewNode);
	},
	
	renderFrame : function(viewCom){
		if(viewCom.vx != 0){
			//unit.viewCom.sprite._scaleX = 1;
			//unit.viewCom.sprite.setFlippedX(false);	//不知道哪个生效
			viewCom.vx = 0;
		}
		EngineUtil.setFrame(viewCom.sprite, viewCom.frame);
	},
	
	renderPosition : function(viewCom){
		if(viewCom.dx!=0 || viewCom.dy!=0){
			EngineUtil.setPosition(viewCom.sprite, moveCom);
			viewCom.dx = viewCom.dy = 0;
		}
	}
});
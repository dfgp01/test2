/**
 * 用于建造组件的工厂类
 */
ComponentFactory = {
	
	addComponent : function(action, component){
		for(var i in action.components){
			if(component.priority > action.components[i].priority){
				this.systemList.splice(i, 0, system);
				return;
			}
		}
		//上面的循环未return时，说明优先级是最小的，要补加到列表尾
		action.components.push(component);
	},

	/**
	 * 移动组件
	 */
	createMove : function(data){
		var msg = ComponentValidator.validateMove(data);
		if(msg){
			cc.log("createMove error. " + msg);
			return null;
		}
		data.type = data.type ? data.type : Constant.MOVE_NORMAL;
		var move = null;
		switch(data.type){
		case Constant.MOVE_NORMAL:
			move = new MoveComponent();
			break;
		}
		//x,y,z的移动向量是以每秒移动xx为单位的，所以要换成以每毫秒移动xx。
		move.dx = data.dx ? data.dx / 1000 : 0;
		move.dy = data.dy ? data.dy / 1000 : 0;
		move.dz = data.dz ? data.dz / 1000 : 0;
		return move;
	},
	
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
	 * 显示组件
	 */
	createView : function(data){
		var msg = ComponentValidator.validateView(data);
		if(msg){
			cc.log("createView error. " + msg);
			return null;
		}
		var animates = [];
		for(var i in data.animates){
			var anm = this.createAnimate(data.animates[i]);
			if(!anm){
				return null;
			}
			animates.push(anm);
		}
		var view = new ViewComponent();
		view.animates = animates;
		return view;
	},
	
	/**
	 * 创建动画组件
	 */
	createAnimate : function(data){
		var msg = ComponentValidator.validateAnimate(data);
		if(msg){
			cc.log("createAnimate error. " + msg);
			return null;
		}
		data.type = data.type ? data.type : Constant.ANIMATE_ONCE;
		
		var animate = null;
		switch(data.type){
		case Constant.ANIMATE_STATIC:
			animate = new AnimateStaticComponent();
			break;
		case Constant.ANIMATE_ONCE:
			animate = new AnimateComponent();
			break;
		case Constant.ANIMATE_SCROLL:
			animate = new AnimateScrollComponent();
			break;
		}
		
		animate.frames = [];
		for(var i in data.frames){
			var frame = this.createFrame(data.frames[i]);
			if(!frame){
				return null;
			}
			animate.frames.push(frame);
		}
		return animate;
	},
	
	/**
	 * 创建帧
	 */
	createFrame : function(data){
		var msg = ComponentValidator.validateFrame(data);
		if(msg){
			cc.log("createFrame error. " + msg);
			return null;
		}
		var sf = cc.spriteFrameCache.getSpriteFrame(data.name);
		if(!sf){
			cc.log("frame:" + data.name + " not found");
			return null;
		}
		var frame = new Frame();
		frame.name = data.name;
		frame.time = data.time;
		frame.spriteFrame = sf;
		frame.position = data.position;
		frame.rect = data.rect;
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
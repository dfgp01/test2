/**
 * 动作节点系统，也是重要的逻辑系统之一
 */
ActionUpdateSystem = System.extend({
	name : "action",
	tick : Constant.TICK_FPS30,
	
	linkList : null,	//单位活动列表，暂时由这里维护，如果有多个地方需要使用，则换到ObjectManager中
	
	start : function(){
		this.linkList = new LinkList();
		this._initUnitAddStage();
		//处理输入的指令，查找是否有下一状态
		/*EventDispatcher.addEventListener("unitInput", function(inputEvt){
			var unit = evt.source;
			var action = null;
			for(var i=unit.actions.stack.length-1; i>=0; i--){
				action = unit.actions.stack[i].getNextByInput(unit, inputEvt.value);
				if(action){
					//发起
					return;
				}
			}
		});*/
	},

	update : function(dt){
		//this._curr = ObjectManager.propertys.getFirstActionsNode();
		this._curr = this.linkList();
		this._super(dt);
	},
	
	execute : function(dt, unitActions){
		/*if(unitActions.endFlag){
			if(unitActions.next){
				unitActions.current = unitActions.next;
				unitActions.current.start(unitActions.owner);
				unitActions.next = null;//还原为空状态，原因你懂，不信的话把这句注释看看。
			}else{
				unitActions.owner.template.actions.boot.update(dt, unitActions.owner);
			}
			//unitActions.current.end(unitActions.owner);
		}else{
			unitActions.current.update(dt, unitActions.owner);
		}*/
		if(unitActions.stack.length > 0){
			unitActions.stack[unitActions.stack.length - 1].update(dt, unitActions.owner);
		}else{
			unitActions.owner.template.actionStateManager.update(unitActions.owner);
		}
	},
	
	_initUnitAddStage : function(){
		var _that = this;
		EventManager.addListener(EventConstant.UNIT_ENTER_STAGE, function(unitEvt){
			var unit = unitEvt.source;
			unit.template.resetAction(unit);
			_that.linkList.add(unit);
		});
	},
	
	actionStart : function(actionEvt){
		var action = actionEvt.source;
		var unit = actionEvt.target;
		unit.actions.stack.push(action);
		action.start(unit);
		EventManager.send(EventConstant.ACTION_START, actionEvt);
	},
	
	actionEnd : function(actionEvt){
		var action = actionEvt.source;
		var unit = actionEvt.target;
		action.end(unit);
		unit.actions.stack.pop();
		EventManager.send(EventConstant.ACTION_END, actionEvt);
	},
	
	actionSwitch : function(actionEvt){
		var unit = evt.source;
		var action = actionEvt.target;
		//消耗检测
		if(action.checkCost(unit)){
			var cur = null;
			var stack = unit.actions.stack;
			while(cur=stack.pop()){
				cur.end(unit);
			}
			stack.push(action);
			action.start(unit);
		}
	}
});
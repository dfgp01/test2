/**
 * 动作节点系统，也是重要的逻辑系统之一
 */
ActionUpdateSystem = System.extend({
	name : "action",
	tick : Constant.TICK_FPS30,
	_currObj : null,
	_currAct : null,

	execute : function(dt, actionCom){
		if(actionCom.endFlag){
			actionCom.current.end(actionCom.owner);
			if(actionCom.next != null){
				actionCom.current = actionCom.next;
				actionCom.current.start(actionCom.owner);
				actionCom.next = null;//还原为空状态，原因你懂，不信的话把这句注释看看。
			}else{
				actionCom.owner.template.actions.start.update(0, actionCom.owner, null);
			}
			actionCom.endFlag = false;
		}else{
			actionCom.current.update(dt, actionCom.owner);
		}
	},
	
	end : function(){
		//remove
	}
});
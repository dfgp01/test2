/**
 * 动作节点系统，也是重要的逻辑系统之一
 */
ActionUpdateSystem = System.extend({
	name : "action",
	tick : Constant.TICK_FPS30,

	update : function(dt){
		this._curr = ObjectManager.propertys.getFirstActionsNode();
		this._super(dt);
	},
	
	execute : function(dt, unitActions){
		if(unitActions.endFlag){
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
		}
	}
});
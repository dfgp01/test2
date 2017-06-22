/**
 * 独立/附加的动画类
 * 执行时会获取一个新的view组件
 * 只运行在action中，结束时会回收
 */
AdditionalAnimateAction = AnimateAction.extend({

	start : function(unit){
		//获取一个新的view组件，和unit关联
		var view = ViewComponent.getInstance();
		unit.action.stack[this.id] = view;
	},

	update : function(dt, unit){
		//取出相关联的view来计算
	},

	end : function(unit){
		//回收资源，解除和unit的关联，隐藏显示
	}
});

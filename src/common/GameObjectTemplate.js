/**
 *  单位模板，相当于单位的制造工厂，以便于对象根据初始数值重新初始化
 *  因为每个模板对应一种单位，每种单位特征各不相同，所以也应该包含对象池
 *  edit by Hugo-Fu 2015.10.05
 *  update by Hugo-Fu 2015.11.26	加入ID递增，放入Service缓存
 */
GameObjectTemplate = cc.Class.extend({

	name : null,
	frame : null,				//初始frame
	featureCode : 0,
	_objHead : null,	//对象池队列的头指针
	_objTail : null,	//对象池队列的尾指针

	actions : null,		//动作集合
	firstAct : null,
	coms : null,
	
	nextId : 1,

	init : function(data){
		this.actions = {};
		this.coms = {};
	},
	
	/**
	 * 回收，归对象池队列内
	 */
	recycle : function(unit){
		if(this._objHead==null){
			this._objTail = this._objHead = unit;
		}else{
			this._objTail = this._objTail.next = unit;
		}
	},
	
	/**
	 * 从模板中获取一个新对象
	 * @returns unit
	 */
	getNewInstance : function(){
		var unit = this._objHead;
		if(unit == null){
			unit = new GameObject();
			unit.name = this.name;
			unit.coms = {};
			//注意，单位的ID是 名字+id序号 的组合
			unit.id = this.name + this.nextId++;
			
			for(var i in this.coms){
				var name = this.coms[i].name;
				unit.coms[name] = this.coms[i].clone();
				unit.coms[name].owner = unit;
			}
			unit.coms.view = new ViewComponent();
			unit.coms.view.owner = unit;
			//EngineUtil.setFrame(unit.coms.view.sprite, this.frame);
			unit.actions = new ActionsComponent();
			unit.actions.owner = unit;
			unit.template = this;
		}
		else{
			//重置所有组件内的数值
			for(var i in unit.coms){
				unit.coms[i].reset();
			}
			unit.actions.reset();
			this._objHead = unit.next;
			unit.next = null;
		}
		return unit;
	}
});
/**
 *  单位模板，相当于单位的制造工厂，存储某种单位类型的初始化数据
 *  因为每个模板对应一种单位，每种单位特征各不相同，所以应该有独立的对象池，以免和其他混淆，发生错误。
 *  edit by Hugo-Fu 2015.10.05
 *  update by Hugo-Fu 2017.01.09
 */
GameObjectTemplate = cc.Class.extend({

	availableList : null,	//对象池，可用列表
	name : null,
	frame : null,				//初始frame
	featureCode : 0,

	actionManager : null,	//状态机管理
	propertys : null,	//属性集合
	
	nextId : 1,

	init : function(data){
		this.name = data.name;
		this.availableList = [];
		this.propertys = {};
		this.frame = EngineUtil.getFrame(data.frame);
	}
});

GameObjectTemplate.prototype.create = function(data){
    var template = new GameObjectTemplate();
	template.init(data);
	//动作集合
    if(DataUtil.checkArrayNotNull(data.actions,"data.actions")){
        for(var i in data.actions){
            GameObjectTemplate.addActionAndProperty(
            		template, ActionFactory.create(data.actions[i]));
        }
    }
    //初始化属性
    return template;
};

GameObjectTemplate.prototype.addActionAndProperty = function(template, action){
	var asm = template.actionStateManager;
	asm.registered(action);
    if(action.components.length > 0){
        for(var i in action.components){
            var component = action.components[i];
            if(!template.propertys[component.name]){
                template.propertys[component.name] = GameObjectTemplate.createProperty(component.name);
            }
        }
    }
	return;
};

GameObjectTemplate.prototype.createProperty = function(name){
    var p = null;
    if(name=='move'){
        p = MoveProperty.create();
        //p.coefficient = DataUtil.checkIsNumber(data.coefficient) ? data.coefficient : p.coefficient;
    }else if(name=='command'){
        p = new CommandProperty();
    }else if(name=='view'){
        p = ViewProperty.create();
    }else if(name=='collide'){
        p = this._createCollide(data);
    }else if(name=='hit'){
        p = new HitProperty();
        p.collide = this._createCollide(data);
    }
    return p;
};
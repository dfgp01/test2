
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    deep: null,
    
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add background
        var bg = new cc.Sprite(background_png);
        bg.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(bg, 0);

        /*deep = new cc.Sprite("#deep_stand_0.png");
        deep.attr({
        	x: 150,
        	y: 250
        });
        deep._flippedX = true;
        deep._scaleX = -1;
        this.addChild(deep, 1);*/
        
      //load frames
    	cc.spriteFrameCache.addSpriteFrames(deep_0_plist);
        cc.spriteFrameCache.addSpriteFrames(deep_1_plist);
        cc.spriteFrameCache.addSpriteFrames(deep_2_plist);
        
        Service.initUnitTemplate(character_data);
    	var unit = Service.createUnit(character_data.name, 0);
    	var sprite = unit.viewCom.sprite;
    	sprite.attr({
    		x: 150,
        	y: 250
    	});
    	sprite._scaleX = -1;
    	this.addChild(sprite);
        
        var mas = new MainActionSystem();
        var pla = new PlayerSystem();
        SystemManager.init();
        SystemManager.addSystem(mas);
        SystemManager.addSystem(pla);
        SystemManager.start();
    	
        //别忘了这里是gl坐标系
        var leftRect = cc.rect(0, size*0.5, size*0.5, size*0.5);				//左上
        var rightRect = cc.rect(size*0.5, size*0.5, size*0.5, size*0.5);		//右上
        var attRect = cc.rect(size*0.5, 0, size*0.5, size*0.5);					//右下
        var selfPointer = this;
        var listener = cc.EventListener.create({
        	event: cc.EventListener.TOUCH_ONE_BY_ONE,
        	//event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        	swallowTouches: true,
        	onTouchBegan: function (touch, event) {
        		var locationInNode = sprite.convertToNodeSpace(touch.getLocation());
        		var s = sprite.getContentSize();
        		var rect = cc.rect(0, 0, s.width, s.height);
        		
        		//这个报废，但暂时不删
        		/*if (cc.rectContainsPoint(rect, locationInNode)) {
        			cc.log("点中精灵：" + locationInNode.x + "," + locationInNode.y);
        			
        			//标注1：这一句在JSB中报错：Invail Native Object，在chrome中没问题
        			//		网上说action要retain()，估计与内存管理有关
        			deep.runAction(cc.animate(animation).repeatForever());	
        			cc.log(touch.getID());
        			Controller.cmd = Controller.cmd | Constant.CMD.ATTACK;
        		}*/
        		
        		var point = touch.getLocation();
        		//临时操作
        		if(cc.rectContainsPoint(leftRect, point)){
        			pla.pressDirection(Constant.CMD.LEFT);
        		}
        		else if(cc.rectContainsPoint(rightRect, point)){
        			pla.pressDirection(Constant.CMD.RIGHT);
        		}
        		else if(cc.rectContainsPoint(attRect, point)){
        			
        		}else{
        			cc.log("click what? " + point.x + "," + point.y);
        		}
        		
        		//返回值是true，往下传递，触发onTouchMoved和onTouchEnded，false则不传递
        		cc.log("id:"+touch.getID() + ", pos:[" + touch.getLocation().x + "," + touch.getLocation().y + "]");
        		return true;
        	},
        	onTouchMoved: function (touch, event) {
        		//cc.log("移动:" + touch.getLocation().x + "," + touch.getLocation().y );
        	},
        	onTouchEnded: function (touch, event) {
        		cc.log("释放:" + touch.getLocation().x + "," + touch.getLocation().y );
        		Controller.releaseKey(0);
        	}
        });
        cc.eventManager.addListener(listener, this);
        
        if ('touches' in cc.sys.capabilities) {
        	cc.log("touchs");
        }else{
        	cc.log("not touchs");
        }
        
        //标注2：这一句在JSB和chrome下都没问题
        //deep.runAction(cc.animate(animation).repeatForever());
        
        //this.schedule(this.customAnimateRun, 0.2, -1, 0);
        //this.schedule(this.customAnimateRun, 0.12, -1, 0);
        this.scheduleUpdate();
        return true;
    },
    
    update:function(dt){
    	SystemManager.update(dt);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var iterObj = function(attr){
	var str = "";
	for(var i in attr){
		if(typeof(attr[i]) != 'function'){
			str += i + ":" + attr[i] + "\n\r";
		}else{
			str += i + ":" + attr[i] + "\n";
		}
	}
	return str;
}

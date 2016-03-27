
var HelloWorldLayer = cc.Layer.extend({
	
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var winSize = cc.winSize;

        // add background
        var bg = new cc.Sprite(res.background2_jpg);
        bg.attr({
        	x: winSize.width / 2,
        	y: winSize.height / 2
        });
        this.addChild(bg, -999);
/*
        var player = Service.Container.player.unit;
    	var sprite = player.coms.view.sprite;
    	sprite.attr({
    		x: 150,
        	y: 250
    	});
    	sprite._scaleX = -1;
    	this.addChild(sprite, 1);*/
        
        var character = Service.Container.player.unit;
        EngineUtil.addSprite(character.coms.view, 150, 0, 250, this);
        var sprite = character.coms.view.sprite;
        
        var selfPointer = this;
        var listener = cc.EventListener.create({
        	event: cc.EventListener.TOUCH_ONE_BY_ONE,
        	//event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        	swallowTouches: true,
        	onTouchBegan: function (touch, event) {
        		//单位内
                var attRect = cc.rect(0, 0, sprite.width, sprite.height);	
        		var locationInNode = sprite.convertToNodeSpace(touch.getLocation());
        		
        		//这个报废，但暂时不删
        		/*if (cc.rectContainsPoint(rect, locationInNode)) {
        			cc.log("点中精灵：" + locationInNode.x + "," + locationInNode.y);
        			
        			//标注1：这一句在JSB中报错：Invail Native Object，在chrome中没问题
        			//		网上说action要retain()，估计与内存管理有关
        			deep.runAction(cc.animate(animation).repeatForever());	
        			cc.log(touch.getID());
        		}*/
        		
        		//返回值是true，往下传递，触发onTouchMoved和onTouchEnded，false则不传递
        		cc.log(" mainLayer touch id:"+touch.getID() + ", pos:[" + touch.getLocation().x + "," + touch.getLocation().y + "]");
        		return true;
        	},
        	onTouchMoved: function (touch, event) {
        		//cc.log("移动:" + touch.getLocation().x + "," + touch.getLocation().y );
        	},
        	onTouchEnded: function (touch, event) {
        		
        	}
        });
        cc.eventManager.addListener(listener, this);
        
        if ('touches' in cc.sys.capabilities) {
        	cc.log("touchs supports");
        }else{
        	cc.log("touchs not supports");
        }
        
        //标注2：这一句在JSB和chrome下都没问题
        //deep.runAction(cc.animate(animation).repeatForever());
        
        //this.schedule(this.updateCustom, 0.45, cc.REPEAT_FOREVER, 5);

        Service.start();
        this.scheduleUpdate();
        return true;
    },
    
    update : function(dt){
    	Service.update(dt);
    },
    
    updateCustom : function(dt){
    	this.mainSystem.update(dt);
    }
});

/**
 * 本来想放在main.js中的，但不行，因为不认识cc.Scene.extend，估计是加载顺序问题
 */
var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
		layer = new ControllerLayer();
		this.addChild(layer);
	}
});
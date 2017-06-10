/**
 * 动作逻辑的基本接口
 */
Action = cc.Class.extend({
    id : 0,
    start : function(unit){},
    update : function(dt, unit){},
    end : function(unit){},
    isEnd : function(unit){ return false; }
});
class Zone{
    static current=new Zone('root',null);
    name;
    parent;
    intercept={};
    constructor(name,parent,intercept){
        this.name=name;
        this.parent=parent;
        this.intercept=intercept;
    }
    run(fn){
        const previouseZone = Zone.current;
        try{
            Zone.current=this;
            this.intercept?.beforeInvoke?.();
            fn.call();
            this.intercept?.afterInvoke?.();
        }finally{
            Zone.current=previouseZone;
        }
    }
    wrap(fn){
        const zone=this;
        return function(){
            zone.run(fn);
        }
    }
    fork(name,intercept){
        return new Zone(name,this,intercept);
    }
}

const nativeThen=Promise.prototype.then;
Promise.prototype.then=function(onfullfill,onreject){
    const self = this;
    const zone = Zone.current;
    nativeThen.call(self,zone.wrap(onfullfill),zone.wrap(onreject))
}
export {Zone}


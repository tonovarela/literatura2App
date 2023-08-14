export  class Stack{
    private stack:any[]=[];    
    constructor() {
     this.stack=[];         
    }
    push(element){
        this.stack.push(element);    
        return this.stack;
    }

    unshif(item){
        this.stack.unshift(item);
    }    
    size(){
        return this.stack.length;
    }
    obtener(max){
       let arr =[];       
        for(let  i=0;i<max;i++){        
         arr.push(this.stack[0]);
         this.stack.shift();                 
        }
        return arr;        
    }

    print(){
        console.log(this.stack);
    }

}
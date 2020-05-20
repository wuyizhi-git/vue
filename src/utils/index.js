

export const deleteKey = (obj) => {
    let newObj = JSON.parse(JSON.stringify(obj))
  
    for (var key in newObj) {
      if (newObj[key] === null || newObj[key] === '') {
        delete newObj[key]
      }
    }
    return newObj
  };
  export const getSessionId=(name="userId")=>{
    return sessionStorage.getItem(name);
  }
  export const setSessionId=(name='userId',value)=>{
      sessionStorage.setItem(name,value)
  }
  export const clearSession=(name)=>{
      if(name){
          sessionStorage.clear(name)
      }
      else{
          sessionStorage.clear();
      }
  }
  export const deepClone=(obj)=>{
    return JSON.parse(JSON.stringify(obj))

  }
  export const  getTree =function(oldArr){
    oldArr.forEach(element => {
      let pid = element.pid;
      if(pid !== '-1'){
        oldArr.forEach(ele => {
          if(ele.menuId == pid){ //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
            if(!ele.children){
              ele.children = [];
            }
            ele.children.push(element);
          }
        });
      }
    });
    
    oldArr = oldArr.filter(ele => ele.pid === '-1'); //这一步是过滤，按树展开，将多余的数组剔除；
  
    return oldArr;
  }
  export const getSplitArr=(str)=>{//"abC1D2"转成ab,c1,d2
   return  str.replace(/([A-Z])/g, ",$1").toLowerCase()
        
  }
  export const getStrLowCase=(item)=>{
    return item.replace(item[0], item[0].toUpperCase())

  }
  
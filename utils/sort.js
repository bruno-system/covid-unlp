  //funcion que ordena un array por alguna columna
  function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
  }

function sortByPropertyDesc(property){  
  return function(a,b){  
     if(a[property] < b[property])  
        return 1;  
     else if(a[property] > b[property])  
        return -1;  
 
     return 0;  
  }  
}

exports.sortByPropertyAsc = sortByProperty;
exports.sortByPropertyDesc = sortByPropertyDesc;
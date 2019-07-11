var nmbr = ['1','2','3','4','5','6','7','8','9'];
var operations = ['/','*','+','-','='];

var handles = {
  '0': function({code, stack}, val){
    if (!isDigit(val)){
      return state
    }
    return {
      code: '1',
      stack: [val]
    }
  },
  '1': function({code, stack}, val){
    return {
      stack:[...stack, val],
      code: isDigit(val) ? '1' : '2' 
    }
  },
  '2': function({code, stack}, val){
    return isDigit(val) ? ({
      code: '3',
      stack: [...stack, val]
    }) : ({
      stack: stack.slice(0, stack.length - 1),
      code: '2',
      stack: [...stack, val]
    })
  },
  '3': function({code, stack}, val){
    if (isDigit(val)){
      return {
        code: '3',
        stack: [...stack, val]
      }
    }

    var indexOperations = stack.findIndex(isOperation);
    var firstArg = parseInt(stack.slice(0, indexOperations).join(''));
    var secondArg = parseInt(stack.slice(indexOperations + 1).join(''));
    var result = calculate(stack[indexOperations], firstArg, secondArg);
    stack = [result];
    if (val == '=') {
      code = '1';
    } else {
      code = '2';
      stack = [...stack, val];
    }
    return { stack, code }
  }
}

function init() {
  var screen = document.querySelector('.w-4');
  var nodes = document.querySelectorAll('.calculator-button');
  var state = { code: '0', stack: ['0'] };
  nodes.forEach(function(node){
    node.addEventListener("click",function(event) {
      var val = event.target.textContent;
      state = processSymbol(state, val);
      console.log({ state })
      screen.textContent = state.stack.join('');
    });
  });
}

function isDigit(x){
  var index = nmbr.findIndex(function(y){
    return x == y;
  });

  if(index >= 0){
    return true;
  }
  return false;
}

function isOperation(x){
  var index = operations.findIndex(function(y){
    return x == y;
  });

  if(index >= 0){
    return true;
  }
  return false;
}

function calculate(operation, firstArg, secondArg){

  console.log({operation, firstArg, secondArg});
  switch(operation){
    case '+': 
      return firstArg + secondArg
    case '-':
      return firstArg - secondArg
    case '*':
      return firstArg * secondArg
    case '/':
      return firstArg / secondArg
  }
}

function processSymbol(state, val){
  var {code, stack} = state;
  if(val == 'C'){
    return {
      code: '0',
      stack: ['0']
    }
  }
  if (val == '←'){
    stack =  stack.slice(0, stack.length - 1);
    
    if (stack.length == 0){
      code = '0';
      stack = ['0'];
    }

    return { stack, code }
  } 
  var handler = handles[code]
  return handler(state, val)
}

init()
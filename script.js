const numberButtons = Array.from(document.querySelectorAll("button.number.expression"));
const operatorButtons = Array.from(document.querySelectorAll("button.operator.expression"));
const clearButton = document.querySelector("button#C");
const periodButton = document.querySelector("button#period");
const zeroButton = document.querySelector("button#num-0");
const executeButton = document.querySelector("button#evaluate");
const backspaceButton = document.querySelector("button#backspace");
const display = document.querySelector("#display");
const ERRORTEXT = "Can't let you do that";
// const MAXDISPLAY = 22;
// const maxLength = document.querySelector('.max-length');
let displayIsResult = false;

function add(num1, num2){
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    return (num1+num2);
}

function subtract(num1, num2){
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    return (num1-num2);
}

function multiply(num1, num2){
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    return (num1*num2);
}

function divide(num1, num2){
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (num2===0) return 'Error!';
    return (num1/num2);
}

function operate(num1, num2, operator){
    switch(operator){
        case '+':
            return add(num1, num2);
            break;
        case '-':
            return subtract(num1, num2);
            break;
        case '*':
            return multiply(num1, num2);
            break;
        case '/':
            return divide(num1, num2);
            break;
        default:
            return 'Error!';
    }
}

function getDisplayArray(displayBox=display){
    return displayBox.value.split(" ");
}

function updateDisplayFromArray(updatedArray, displayBox=display){
    displayBox.value = updatedArray.join(" ");
}

function changeOperator(operator, displayBox=display){
    const displayArray = getDisplayArray(displayBox);
    displayArray.splice(-2, 1, operator);
    updateDisplayFromArray(displayArray, displayBox);
}

function appendDisplayText(value, displayBox=display){
    const displayArray = getDisplayArray(displayBox);
    if (displayArray.length === 1 && displayArray[0] === ''){
        displayArray.splice(0, 1, value);
    } else{
        const updatedText = `${displayArray.pop()}${value}`;
        displayArray.push(updatedText);
    }
    displayBox.value = displayArray.join(" ");
}

function clearDisplayText(displayBox=display){
    displayBox.value = "";
    displayIsResult = false;
}

function getLastExpressionEntry(){
   return  getDisplayArray().slice(-1);
}

function pressButton(buttonId){
    const button = document.querySelector(`#${buttonId}`);
    button.click();
}

// function maxLengthCheck (displayBox=display){
//     if (displayBox.length == MAXDISPLAY){
//         numberButtons.forEach((button) => {
//             button.setAttribute("disabled", "");
//         });
//         operatorButtons.forEach((button) => {
//             button.setAttribute("disabled", "");
//         });
//         maxLength.removeAttribute("hidden");
//         return true;
//     }
//     return false;
// }

numberButtons.forEach(button => {
    button.addEventListener("click", (e) => {
    // if(maxLengthCheck()) return;
    if(displayIsResult) {
        clearDisplayText();
    }
    const value = e.target.value;
    appendDisplayText(value);
    });
});

operatorButtons.forEach(button =>{
    button.addEventListener("click", (e) => {
        const operator = e.target.value;
        const lastExpression = getLastExpressionEntry();
        if (getDisplayArray().length === 1 && lastExpression=='') {
            if (operator=='-'){
                appendDisplayText(`${operator}`);
                return;
            } else {
                return;
            }
        }
        if (!isNaN(parseFloat(lastExpression))) {
            appendDisplayText(` ${operator} `);
        } else if(lastExpression == '') {
            if (operator != '-') {
                changeOperator(operator);
            } else {
                const displayArray = getDisplayArray();
                if (displayArray[displayArray.length - 2] == '*' ||
                    displayArray[displayArray.length - 2] == '/') {
                    appendDisplayText(`${operator}`);
                }else if (displayArray[displayArray.length - 2] == '+') {
                    changeOperator(operator);
                }
            }
        } else if(lastExpression == '-') {
            if(operator != '-'){
                const displayArray = getDisplayArray();
                // displayArray.pop();
                displayArray.splice(-1, 1, '');
                updateDisplayFromArray(displayArray);
                if(operator != '+' && getDisplayArray().length>1){
                    changeOperator(operator);
                }
            }
        }
        if (display.value != ERRORTEXT){
            displayIsResult=false;
        }
    });
});

clearButton.addEventListener("click", () => clearDisplayText(display));

zeroButton.addEventListener("click", (e) => {
    if(displayIsResult) {
        clearDisplayText();
    }
    const lastExpression = getLastExpressionEntry();    if (String(lastExpression).length > 1 || parseFloat(lastExpression) !== 0){
        appendDisplayText("0");
    }
});

periodButton.addEventListener("click", (e) => {
    if(displayIsResult) {
        clearDisplayText();
    }
    const lastExpression = getLastExpressionEntry();
    if (!String(lastExpression).includes(".")){
        appendDisplayText(".");
    }
});

executeButton.addEventListener("click", (e) => {
    let resArray = getDisplayArray();
    if (resArray[resArray.length -1] == '' ||
        resArray[resArray.length -1] == '-'){
            return;
    }
    let operatorIndex = 0;
    let i=0;
    while(operatorIndex !== -1){
        operatorIndex = resArray.findIndex(element => /^[+\-*\/]$/.test(element));
        if (operatorIndex == -1){
            break;
        }
        
        result = operate(resArray[operatorIndex-1],
                         resArray[operatorIndex+1],
                         resArray[operatorIndex]
                        );
        if (result == 'Error!') {
            resArray=ERRORTEXT;
            break;
        }
        resArray.splice(operatorIndex-1,3,result);
        i++;
        if(i>30){
            break;
        }
    }
    if(Number.isInteger(parseFloat(resArray)) || isNaN(parseFloat(resArray))){
        display.value=String(resArray);
    } else {
        display.value=String(parseFloat(resArray).toFixed(3));
    }
    // display.value=String(resArray);
    displayIsResult = true;
});

backspaceButton.addEventListener("click", (e) => {
    if(displayIsResult) {
        clearDisplayText();
        return;
    }
    const displayArray = getDisplayArray();
    let lastExpression = String(displayArray.slice(-1));
    if(!isNaN(parseFloat(lastExpression))){
        displayArray.splice(-1,1,lastExpression.slice(0,-1));
        updateDisplayFromArray(displayArray);
        return;
    } else if(lastExpression == ''){
        displayArray.splice(-2, 2);
        updateDisplayFromArray(displayArray);
    } else if(lastExpression == '-' || lastExpression == '.'){
        displayArray.splice(-1, 1, '');
        updateDisplayFromArray(displayArray);
    }
});



const keyPressed = document.addEventListener("keyup", (e) => {
    if(parseFloat(e.key) || e.key == '0') pressButton(`num-${e.key}`);
    else if(e.key == '.') pressButton(`period`);
    else if(/^[+\-*\/]$/.test(e.key)) {
        const operatorDict = [{'+': 'Plus'}, {'-': 'Minus'}, {'*': 'Multiply'}, {'/': 'Divide'}];
        const operator = operatorDict.filter((operator) => e.key in operator);
        pressButton(`operator${operator[0][e.key]}`)
    } else if(e.key == '=' || e.key == 'Enter') pressButton(`evaluate`);
    else if(e.key == 'Backspace' || e.key == 'Delete') pressButton(`backspace`);
});


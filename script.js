function add(num1, num2) {
    return num1 + num2;
};

function subtract(num1, num2) {
    return add(num1, -num2);
};

function multiply(num1, num2) {
    return num1 * num2;
};

function divide(num1, num2) {
    return multiply(num1, 1 / num2);
};

const displayDiv = document.querySelector('#display');


const digitButtons = document.querySelectorAll('.digit');

var countDecimals = function (value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
    }

digitButtons.forEach((button) => {

    button.addEventListener('click', (e) => {

        if (justPressedEquals === true) {reset();};

        justPressedOperator = false;

        let digit = parseInt(button['id']);

        // If secondOperand === null (when it is time to type in a new number), 
        // have to make it 0 before digits can be "appended" to it by the process 
        // below.
        if (secondOperand === null) {
            secondOperand = 0;
        };

        if (decimalButton.classList.contains('active')) {

            let string = displayDiv.textContent
            console.log(string)
            if (string.includes('.')) {
                string += digit
            } else {
                string = string + '.' + digit
            };

            displayDiv.textContent = string;

            secondOperand = +string;

        } else {

            secondOperand *= 10;
            secondOperand += digit;

            displayDiv.textContent = secondOperand;

        };

    });

});


const decimalButton = document.querySelector('#decimal');

decimalButton.addEventListener('click', (e) => {

    // Don't want pressing decimalButton again to do anything until it is made 
    // inactive
    if (decimalButton.classList.contains('active')) {
        return;
    };

    decimalButton.classList.add('active');

});


const backspaceButton = document.querySelector('#backspace');

backspaceButton.addEventListener('click', (e) => {

    if (secondOperand === null) {
        return;
    };

    if (decimalButton.classList.contains('active')) {

        let string = displayDiv.textContent;

        if (!string.includes('.')) {
            decimalButton.classList.remove('active');

        } else if (string.charAt(string.length - 1) === '.') {
            string = string.slice(0, -1);
            decimalButton.classList.remove('active')

        } else {
            string = string.slice(0, -1);
        };

        displayDiv.textContent = string;

        secondOperand = +string;

    } else {

        secondOperand = Math.floor(secondOperand / 10);

        if (secondOperand === 0) {
            displayDiv.textContent = '_';

        } else {
            displayDiv.textContent = secondOperand;
        };

    };

});


const operatorButtons = document.querySelectorAll('.operator');

operatorButtons.forEach((button) => {

    button.addEventListener('click', (e) => {

        decimalButton.classList.remove('active');

        // If justPressedEquals is true and you leave it true, then the next time 
        // you press a number after pressing this operator, everything is reset instead 
        // of contributing the next number to previous operation/result
        justPressedEquals = false;

        if (justPressedOperator === false) {

            // Don't want anything to perform a new computation if you haven't typed in a new number to 
            // perform the queued operation on (because below the queued operator will 
            // be implemented on firstOperand and secondOperand)
            if (secondOperand === null) return;

            // Clicking the operator button doesn't cause the clicked operator to take 
            // effect immediately, because the clicked operator would have to wait 
            // for the following number to be typed in. Instead, the queued operator 
            // (the last one clicked) is implemented between the result so far and the 
            // last number typed in
            let previousOperatorResult = queuedOperator(firstOperand, secondOperand);
            displayDiv.textContent = previousOperatorResult;

            firstOperand = previousOperatorResult;
            secondOperand = null;

            justPressedOperator = true;

        };

        // Doing this instead of using eval(button['id']), for safety, because 
        // executing JavaScript from a string is a security risk 
        switch (button['id']) {
            case "add":
                queuedOperator = add;
                break;
            case "subtract":
                queuedOperator = subtract;
                break;
            case "multiply":
                queuedOperator = multiply;
                break;
            case "divide":
                queuedOperator = divide;
                break;
        };

    });
});


const equalsButton = document.querySelector('#equals');

equalsButton.addEventListener('click', (e) => {

    decimalButton.classList.remove('active');

    justPressedEquals = false;

    // So that equals takes no effect if the last thing clicked was an operator 
    // (because it would try to perform the queuedOperator on a null value) 
    // or if nothing has been typed in yet
    if (secondOperand === null) return;

    // TODO: refactor this code and the same code that appears in the 
    // operatorButtons event listener
    let previousOperatorResult = queuedOperator(firstOperand, secondOperand);
    displayDiv.textContent = previousOperatorResult;

    // So that, when a number is next pressed in immediately afterwards, everything 
    // is reset, so that the stored result and operations can be discontinued
    justPressedEquals = true;

});


const clearButton = document.querySelector('#clear');

function reset() {

    firstOperand = 0;
    secondOperand = null;
    displayDiv.textContent = '_';

    decimalButton.classList.remove('active');

    // This is first because, when number is typed in and operator is clicked, 
    // queued operator will simply add this secondOperand to firstOperand (0), meaning 
    // the stored result will simply be the first number typed in
    queuedOperator = add;
    
    // Want to know this so that, if user clicks an operator and then click another 
    // one (if user changes mind) they can do so without triggering another 
    // computation in operator click listener
    justPressedOperator = false;

    // Specifically, "just pressed equals while secondOperand not null"
    justPressedEquals = false;

};

clearButton.addEventListener('click', (e) => {

    reset();

});


window.addEventListener('keydown', function(e) {

    key = e.key;
    button = document.querySelector(`button[data-key="${key}"]`);
    if (!button) return;

    button.click()

})


let firstOperand, secondOperand, queuedOperator, justPressedOperator, justPressedEquals;
reset()

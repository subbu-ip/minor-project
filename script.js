// script.js

const display = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const opIndicator = document.getElementById("op-indicator");
const buttons = document.querySelectorAll("button");

let firstOperand = "";
let secondOperand = "";
let currentOperator = null;
let isResultShown = false;

function updateDisplay() {
  // Big display: always show firstOperand until user starts typing secondOperand
  if (currentOperator === null) {
    display.value = firstOperand !== "" ? firstOperand : "0";
  } else {
    display.value = secondOperand !== "" ? secondOperand : firstOperand || "0";
  }

  // Left operator indicator
  if (currentOperator === null) {
    opIndicator.textContent = "";
  } else {
    let opSymbol = currentOperator;
    if (currentOperator === "/") opSymbol = "÷";
    if (currentOperator === "*") opSymbol = "×";
    opIndicator.textContent = opSymbol;
  }

  // Small expression preview
  let expr = "";
  if (firstOperand !== "") {
    expr += firstOperand;
  }
  if (currentOperator !== null) {
    let opSymbol = currentOperator;
    if (currentOperator === "/") opSymbol = "÷";
    if (currentOperator === "*") opSymbol = "×";
    expr += " " + opSymbol;
  }
  if (secondOperand !== "") {
    expr += " " + secondOperand;
  }
  expressionEl.textContent = expr;
}


function clearAll() {
  firstOperand = "";
  secondOperand = "";
  currentOperator = null;
  isResultShown = false;
  display.value = "0";
  expressionEl.textContent = "";
  opIndicator.textContent = ""; // clear operator symbol
}

function handleNumber(num) {
  // If result is on screen and no operator, start fresh
  if (isResultShown && currentOperator === null) {
    firstOperand = "";
    isResultShown = false;
  }

  if (currentOperator === null) {
    // typing first number
    if (num === "." && firstOperand.includes(".")) return;
    firstOperand += num;
  } else {
    // typing second number
    if (num === "." && secondOperand.includes(".")) return;
    secondOperand += num;
  }
  updateDisplay();
}

function handleOperator(op) {
  if (firstOperand === "") return; // no first number yet

  // If already have operator and second operand, compute first
  if (currentOperator !== null && secondOperand !== "") {
    calculate();
  }

  currentOperator = op;
  isResultShown = false;
  updateDisplay();
}

function calculate() {
  if (firstOperand === "" || currentOperator === null || secondOperand === "") {
    return;
  }

  const a = parseFloat(firstOperand);
  const b = parseFloat(secondOperand);
  let result = 0;

  switch (currentOperator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = b === 0 ? "Error" : a / b;
      break;
    case "%":
      result = a % b;
      break;
  }

  let opSymbol = currentOperator;
  if (currentOperator === "/") opSymbol = "÷";
  if (currentOperator === "*") opSymbol = "×";

  if (result === "Error") {
    expressionEl.textContent = `${a} ${opSymbol} ${b} =`;
    display.value = "Error";
    firstOperand = "";
    secondOperand = "";
    currentOperator = null;
    isResultShown = true;
    opIndicator.textContent = ""; // remove old symbol
    return;
  }

  expressionEl.textContent = `${a} ${opSymbol} ${b} =`;

  // Put result into firstOperand so user can continue
  firstOperand = result.toString();
  secondOperand = "";
  currentOperator = null;
  isResultShown = true;
  display.value = firstOperand;
  opIndicator.textContent = ""; // clear operator after result
}

buttons.forEach((btn) => {
  const number = btn.getAttribute("data-number");
  const operator = btn.getAttribute("data-operator");
  const action = btn.getAttribute("data-action");

  if (number !== null) {
    btn.addEventListener("click", () => handleNumber(number));
  } else if (operator !== null) {
    btn.addEventListener("click", () => handleOperator(operator));
  } else if (action === "clear") {
    btn.addEventListener("click", clearAll);
  } else if (action === "square") {
    btn.addEventListener("click", () => {
      // Square the current visible value
      let currentValue = display.value || "0";
      const num = parseFloat(currentValue);
      const result = num * num;

      expressionEl.textContent = `${currentValue}² =`;
      firstOperand = result.toString();
      secondOperand = "";
      currentOperator = null;
      isResultShown = true;
      display.value = firstOperand;
      opIndicator.textContent = ""; // no operator for square result
    });
  } else if (action === "equals") {
    btn.addEventListener("click", calculate);
  }
});

// Prevent typing directly into input
display.addEventListener("keydown", (e) => {
  e.preventDefault();
});

// Initialize display
updateDisplay();

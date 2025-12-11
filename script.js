// Grabbing the display element
const display = document.getElementById("display");

// Variables to store the current state of the calculator
let currentInput = "";
let previousInput = "";
let currentOperator = null;
let shouldResetScreen = false;

/**
 * Helper function to update the display text.
 * Uses value of currentInput or 0 if empty.
 */
function updateDisplay() {
  display.value = currentInput || "0";
}

/**
 * Clear all values to reset calculator.
 */
function clearAll() {
  currentInput = "";
  previousInput = "";
  currentOperator = null;
  shouldResetScreen = false;
  updateDisplay();
}

/**
 * Append a digit or decimal point to the current input.
 */
function appendNumber(number) {
  // Prevent multiple decimals in one number
  if (number === "." && currentInput.includes(".")) return;

  // Replace initial 0 when starting fresh
  if (shouldResetScreen) {
    currentInput = "";
    shouldResetScreen = false;
  }

  currentInput += number;
  updateDisplay();
}

/**
 * Handle operator button click (+, -, *, /, %).
 */
function chooseOperator(operator) {
  // If there is already a previousInput and operator, calculate first
  if (currentOperator !== null && currentInput !== "") {
    compute();
  }

  previousInput = currentInput || previousInput;
  currentOperator = operator;
  shouldResetScreen = true;
}

/**
 * Perform the calculation based on previousInput, currentInput, and currentOperator.
 */
function compute() {
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);

  // Check if numbers are valid
  if (isNaN(prev) || isNaN(curr)) return;

  let result;

  // Using if/else to satisfy the condition mentioned in the PDF
  if (currentOperator === "+") {
    result = prev + curr;
  } else if (currentOperator === "-") {
    result = prev - curr;
  } else if (currentOperator === "*") {
    result = prev * curr;
  } else if (currentOperator === "/") {
    // Handle division by zero
    if (curr === 0) {
      currentInput = "Error";
      previousInput = "";
      currentOperator = null;
      updateDisplay();
      return;
    }
    result = prev / curr;
  } else if (currentOperator === "%") {
    // Modulo operation
    result = prev % curr;
  } else {
    return;
  }

  currentInput = result.toString();
  previousInput = "";
  currentOperator = null;
  updateDisplay();
}

/**
 * Calculate square of the current input.
 */
function squareCurrent() {
  const value = parseFloat(currentInput || previousInput || "0");
  const squared = value * value;
  currentInput = squared.toString();
  previousInput = "";
  currentOperator = null;
  updateDisplay();
}

// Attach event listeners to all buttons using a loop
const buttons = document.querySelectorAll(".calculator-buttons button");

buttons.forEach((button) => {
  // Using dataset attributes to determine type of button
  const number = button.dataset.number;
  const operator = button.dataset.operator;
  const action = button.dataset.action;

  button.addEventListener("click", () => {
    if (number !== undefined) {
      appendNumber(number);
    } else if (operator !== undefined) {
      chooseOperator(operator);
    } else if (action === "clear") {
      clearAll();
    } else if (action === "equals") {
      compute();
    } else if (action === "square") {
      squareCurrent();
    }
  });
});

// Initialize display when page loads
clearAll();

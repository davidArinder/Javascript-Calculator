//This is the function that actually does the calculation. 
const calculate = (n1, operator, n2) => {      
    const firstNum = parseFloat(n1) //convert strings n1 and n2 to numbers 
    const secondNum = parseFloat(n2)
    if (operator === "add") return firstNum + secondNum
    if (operator === "subtract") return firstNum - secondNum      
    if (operator === "multiply") return firstNum * secondNum       
    if (operator === "divide") return firstNum / secondNum
  }
    
// Function to ascertain what type of key was used.
const getKeyType = key => {
    const { action } = key.dataset
    if (!action) return "number"
    if (
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
      ) return "operator"
      return action
    }  
   

const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    const  {
      firstValue,
      modValue,
      operator,
      previousKeyType
    } = state
    
   if (keyType === "number") {
     return displayedNum === "0" ||
       previousKeyType === "operator" ||
       previousKeyType === "calculate"
       ? keyContent
       : displayedNum + keyContent
   }
  
   if (keyType === "decimal") {
     if (!displayedNum.includes(".")) return displayedNum + "." //adds a decimal to the number
     if (previousKeyType === "operator" || previousKeyType === "calculate") return "0." //If you click decimal after an operator or the equals sign, resets to 0 plus a decimal. 
     return displayedNum
   } 
  
   if (keyType === "operator") {
     return firstValue &&
       operator &&
       previousKeyType !== "operator" &&
       previousKeyType !== "calculate"
       ? calculate(firstValue, operator, displayedNum) //If you have a first value, operator, and a second value in that order, run calculation.
       : displayedNum //If not, return the displayedNum.
   }
  
  if (keyType === "clear") return 0 //AC button clears the calculator
  
  if (keyType === "calculate") {
    return firstValue 
        ? previousKeyType === "calculate" 
          ? calculate(displayedNum, operator, modValue) 
          : calculate(firstValue, operator, displayedNum)
        : displayedNum
  }
}  
   
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset
  
  calculator.dataset.previousKeyType = keyType
  
  if (keyType === "operator") {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
      ? calculatedValue
      : displayedNum
  }
  
  if (keyType === "calculate") {
    calculator.dataset.modValue = firstValue && previousKeyType === "calculate"
    ? modValue
    : displayedNum
  }
  
  if (keyType === "clear" && key.textContent === "AC") {
    calculator.dataset.firstValue = ""
    calculator.dataset.modValue = ""
    calculator.dataset.operator = ""
    calculator.dataset.previousKeyType = ""
  }
}
  
  
  const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key);
    Array.from(key.parentNode.children).forEach(k => k.classList.remove("is-depressed")) //Remove depressed state.
    
    if(keyType === "operator") key.classList.add("is-depressed") //Add depressed state.
    if(keyType === "clear" && key.textContent !== "AC") key.textContent = "AC"
    if (keyType !== "clear") {
      const clearButton = calculator.querySelector("[data-action=clear]")
      clearButton.textContent = "CE"
    }
  }  

const calculator = document.querySelector(".calculator")
const display = calculator.querySelector(".calculator_display")
const keys = document.querySelector(".calculator_keys")

keys.addEventListener("click", e => {
    if (!e.target.matches("button")) return
    const key = e.target
    const displayedNum = display.textContent
    const resultString = createResultString(key, displayedNum, calculator.dataset)
    
    // Update states
    display.textContent = resultString  
    updateCalculatorState (key, calculator, resultString, displayedNum)
    updateVisualState(key, calculator)
  })

//https://medium.freecodecamp.org/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98
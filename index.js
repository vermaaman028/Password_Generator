const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthContainer]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector(".data-indicator");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={}[]:;"?<>,./';

let password = "";
uppercaseCheck.checked = true;
let passwordLength = 10;
let checkcount =0; 
handleSlider();                                     // line 15 -18 starting value set
// set strength circle color to gray
setIndecator("#ccc");

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min))+"% 100%"


}

function setIndecator(color){
    // console.log("set indecator");
    indicator.style.backgroundColor = color;
    // console.log("set indecator2");
   indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min))+min ; 
    // return Math.floor(Math.random() * (min-max))+min;  
}

function generateInteger(){
    return getRndInteger(0,9);
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}



function generateSymbol(){
   const randNum = getRndInteger(0,symbols.length) ;
   return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(numbersCheck.checked) hasNum = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndecator("#0f0");
    }else if((hasLower || hasUpper) && 
    (hasNum || hasSym)&& passwordLength >= 6){
        setIndecator("#ff0");
    }else{
        setIndecator("#f00");
    }

}

async function copyContent(){
    console.log("copy me aa gye");
    try{
           // throw error if password is empty
           if(password === ""){
            alert('First Generate Password to copy');
            throw 'Failed'; 
           }
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copid";
        console.log("copid");
    }
    catch(e){
        copyMsg.innerText = "Faild";
    }
    // To make copy span visible
    copyMsg.classList.add("active");
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
  
}

function shufflepassword(array){
    //Fisher yets method
    for( let i = array.length -1 ; i> 0 ; i--){
        //random j find out 
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];  // swaping code
        array[i] =array[j];
        array[j] = temp;
        console.log("suffuring done");
    }
    let str = "";
    array.forEach((el)=>(str += el));
    console.log("suffuring done2");
    return str;

}

function handlecheckboxchange(){
    checkcount = 0;
    allCheckBox.forEach( (checkbox) => {
      if(checkbox.checked)
      checkcount++;
    });

    //spacial case
    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckboxchange());
})


inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})




copyBtn.addEventListener('click',()=>{
            //its show password length is non empty
       copyContent(); 
    
});


generateBtn.addEventListener('click' , () => {
    console.log("heelo");
   // non of the checkbox is selected 
  
   if(checkcount <= 0){
       return;
   }
     
    
   if (passwordLength < checkcount) {
    passwordLength = checkcount;
    handleSlider();
}

   //let's finds a new password
   console.log("start");
   // remove old password
   password = "";

   //let's put the stuff mentions by checked box
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateInteger();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    
    let funcArr = [];
    if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);
   
    if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funcArr.push(generateInteger);

    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

    // compasory addition
    for(let i=0 ; i<funcArr.length ; i++){
        password += funcArr[i]();
    }
    console.log("compasory addition done");

    // remaning addtion
    for(let i = 0 ; i<(passwordLength-funcArr.length) ; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
        console.log("randIndex" + randIndex);
    }
   
    //shuffle the password
    password = shufflepassword(Array.from(password));
    console.log("shuffling addition done");

    // show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    // calulate strength 
    calcStrength();

});
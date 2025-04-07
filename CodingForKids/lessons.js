// Task counters for tutorial and lessons
let tutorialStep = 0;
let lesson1Step = 0;
let lesson2Step = 0;
let lesson1Score = 3;
let lesson2Score = 3;

// Overlay used to dim the screen
const overlay = document.getElementById("dimOverlay");

function startTutorial() {

  if (!workspace) {
    console.error("Workspace not ready. Retrying...");
    setTimeout(startTutorial, 500);
    return;
  }

  // Clear any blocks in the workspace
  workspace.clear();

  // Setup turorial text and UI
  const tutorialText = document.getElementById("tutorialText");
  const nextButton = document.getElementById("nextTutorialStep");
  const runButton = document.getElementById("runButton");

  const tutorialMessages = [
    "Welcome to the game! Before you start coding, let's go through a quick tutorial.",
    "This game uses drag-and-drop blocks to help you learn programming in a fun way!"
  ];

  tutorialStep = 0;
  tutorialText.textContent = tutorialMessages[tutorialStep];
  tutorialBox.style.display = "block";
  overlay.style.display = "block";

  // Handle clicking through tutorial messages
  nextButton.addEventListener("click", handleNextClick);

  function handleNextClick() {
    if (tutorialStep < tutorialMessages.length - 1) {
      tutorialStep++;
      tutorialText.textContent = tutorialMessages[tutorialStep];
    } else {
      // End of tutorial intro, show first tooltip task
      const tutorialBox = document.getElementById("tutorialBox");
      if (tutorialBox) {
        tutorialBox.remove();
      }
      overlay.style.display = "none";

      tutorialStep = 1;

      showTooltipNextToElement(
        "variables_get",
        "Drag the 'item' block into the workspace, click the small arrow and rename it to 'myFirstVar'.\n\n Check your answer by clicking Run Code!"
      );

      if (runButton) {
        runButton.addEventListener("click", tutorialRunCode);
      }
    }
  }
}

function tutorialRunCode() {
  const userCode = Blockly.Python.workspaceToCode(workspace);

  // Handle if run code is pressed with no code (unless its task 3 - clear workspace)
  if (!userCode && tutorialStep !== 3) {
    showModal("Please write some code before running.");
    return;
  }

  // Handles checking users blocks during tutorial dependant on step
  if (tutorialStep === 1) {
    checkMyFirstVarRenamed();
  } else if (tutorialStep === 2) {
    checkBlocksConnected();
  } else if (tutorialStep === 3) {
    checkWorkspaceCleared();
  }
}

// Check block type and if its named myFirstVar
function checkMyFirstVarRenamed() {
  const blocks = workspace.getAllBlocks(false);
  
  const hasMyFirstVar = blocks.some(block => {
    if (block.type === 'variables_get' || block.type === 'variables_set') {
      const varId = block.getFieldValue('VAR');
      const varModel = block.workspace.getVariableById(varId);
      return varModel && varModel.name.toLowerCase() === 'myfirstvar';
    }
    return false;
  });

  // If renamed correctly, move to next tutorial step
  if (hasMyFirstVar) {
    showModal("Correct! You have renamed your variable to 'myFirstVar'.", () => {
      tutorialStep = 2;
      hideTutorialTooltip();

      showTooltipNextToElement(
        'variables_set',
        "Now drag out a 'set item' block, click the arrow and then 'Choose existing variable' to name it to 'myFirstVar' and connect a number block to it!\n\n Check your answer by clicking Run Code!"
      );
    });
  } else {
    showModal("Unlucky! Try again! Hint: rename your variable to 'myFirstVar'.");
  }
}

// Checks if 'myFirstVar' is set to a number
function checkBlocksConnected() {
  let isConnectedAndInteger = false;
  let connectedNumber = null;
  const blocks = workspace.getAllBlocks(false);

  // Loop through blocks to find if 'myFirstVar' is set to an integer
  for (let block of blocks) {
    if (block.type === 'variables_set') {
      const varId = block.getFieldValue('VAR');
      const varModel = block.workspace.getVariableById(varId);
      if (!varModel || varModel.name.toLowerCase() !== 'myfirstvar') continue;

      const connected = block.getInputTargetBlock("VALUE");
      if (connected && connected.type === 'math_number') {
        const numStr = connected.getFieldValue("NUM");
        const parsedVal = parseInt(numStr, 10);
        if (!isNaN(parsedVal)) {
          isConnectedAndInteger = true;
          connectedNumber = parsedVal;
          break;
        }
      }
    }
  }

  // Show success and next tooltip or retry modal
  if (isConnectedAndInteger) {
    showModal("Great! You set 'myFirstVar' to the number " + connectedNumber + "!", () => {
      tutorialStep = 3;

      hideTutorialTooltip();
      showTooltipNextToElement(
        "trashBin",
        "You can clear the workspace by dragging blocks back into the toolbox OR just click this bin to remove everything. Then Run Code!"
      );
    });
  } else {
    showModal("Not yet connected! Make sure 'myFirstVar' is set to an integer using a number block!");
  }
}

// Checks if the workspace has been cleared of all blocks
function checkWorkspaceCleared() {
  const blockCount = workspace.getAllBlocks(false).length;
  if (blockCount === 0) {
    showModal("Nice! You cleared your workspace!", () => {
      
      tutorialStep = 4;
      hideTutorialTooltip();

      // Show hint tooltip next
      showTooltipNextToElement(
        "hintButton",
        "Need a hint? Click here to see an example code snippet!"
      );

      const hintButton = document.getElementById("hintButton");
      // Show hint, then home button tooltip
      if (hintButton) {
        function showTutorialHint() {
          // Call show hint function with example for tutorial
          showHintForLevel("tutorial", tutorialStep);
          setTimeout(() => {
            showTooltipNextToElement(
              "homeButton",
              "Now click 'Home' to return to the lobby!"
            );
            tutorialStep = 6;
          }, 500);
          hintButton.removeEventListener("click", showTutorialHint);
        }
        hintButton.addEventListener("click", showTutorialHint);
      }
      
      else {
        showTooltipNextToElement(
          "homeButton",
          "Now click 'Home' to return to the lobby!"
        );
        tutorialStep = 6;
      }
    });
  } else {
    showModal("Workspace is not empty yet. Drag blocks to the toolbox or click the bin to clear them!");
  }
}

// Star Level 1: Variables
function startLevel1() {

  if (!workspace) {
    console.error("Blockly workspace not initialized yet. Retrying...");
    return;
  }
  workspace.clear();

  // Removes the tutorial message box so it won't flash
  const tutorialBox = document.getElementById("tutorialBox");
  if (tutorialBox) {
    tutorialBox.remove();
  }

  // Dim screen and introoduce level
  overlay.style.display = "block";
  showLessonModal({
    heading: "Welcome to Level 1: Variables!",
    description: `
      <p>In this lesson, you'll learn about the power of <strong>variables!</strong></p>
      <p><strong>What is a variable?</strong> Think of a variable like a magic box that can hold anything you want in it.</p>
      <p>A variable can be set to anything from your favourite <strong>number (which we call an Integer)</strong> to your name <strong>(which we'd call a String)</strong> and they are essential in programming when storing and changing data!</p>
      <p>Click the button below to start your first task!</p>
      <p><strong>⭐ Hint: Be careful! Every time you click Run Code with the wrong answer or click Show Solution, you’ll lose a star! Try your best before hitting run!</strong></p>
    `,
    img: treasureChestPreload,
    buttonText: "Start Task 1",
    onClose: function() {
      overlay.style.display = "none";
      startLessonTask1();
    }
  });
}

// Starts level 1 Task 1
function startLessonTask1() {
  lesson1Step = 1;
  showTooltipNextToElement(
    "variables_set",
    "<strong>For your first task, I want you to remember what you learned from the tutorial!</strong>\n\n Firstly drag out the <strong>'set item to'</strong> block, and set a variable called <strong>'myFavNum'</strong> to <strong>your favourite number!</strong>"
  );
}

// Checks if 'myFavNum' is set to a number
function checkMyFirstIntSet() {
  let isSetToNumber = false;
  let favNumber = null;
  const blocks = workspace.getAllBlocks(false);

  for (let block of blocks) {
    if (block.type === 'variables_set') {
      const varId = block.getFieldValue('VAR');
      const varModel = block.workspace.getVariableById(varId);
      if (varModel && varModel.name.toLowerCase() === 'myfavnum') {
        const connected = block.getInputTargetBlock("VALUE");
        if (connected && connected.type === 'math_number') {
          favNumber = connected.getFieldValue("NUM");
          isSetToNumber = true;
          break;
        }
      }
    }
  }

  // Show success modal if correct
  if (isSetToNumber) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Well Done! This variable is now an integer!",
      description: `
        <p>Great job! You've successfully created <strong>'myFavNum' and set it to your favourite number ${favNumber}!</strong></p>
        <p>As you’ve seen, <strong>variables can store different types of information, like numbers and words.</strong> But another important <strong>type of variable in programming is a Boolean!</strong></p>
        <p>Think of a <strong>Boolean like a light switch—it’s either <strong>True</strong> (on) or <strong>False</strong> (off). There’s no in-between!</p>
        <p><strong>Booleans</strong> are useful because they help computers make decisions. For example, scroll down to see how a game might use a Boolean to check if the player has won:</p>
        <strong><pre>
        <code>
  game_over = False

  if game_over = True:
      print("Game Over! Try again?")
  else:
      print("Keep playing!")
        </code>
        </pre></strong>
      `,
      img: lightSwitch,
      buttonText: "Next",
      // Upon closing the modal, increment lesson step and start next task
      onClose: function() {
        overlay.style.display = "none";
        lesson1Step = 2;
        hideTutorialTooltip();
        startLessonTaskBoolean();
      }
    });
  } else {
    // Decrement score and prompt user to try again
    if (currentLevel === 'level_1') {
      decrementScore("level_1");
    }
    showModal("Unlucky! Please create a variable named 'myFavNum' and set it to your favourite number. Try again!", () => {});
  }
}

// Start next task
function startLessonTaskBoolean() {
  showTooltipNextToElement(
    "logic_boolean",
    "<strong>1.</strong> Drag a <strong>'set item to'</strong> block and name it <strong>amIExcited</strong>.<br><br>" +
    "<strong>2.</strong> Set it to <strong>true</strong> or <strong>false</strong>.<br><br>" +
    "<strong>3.</strong> Click <strong>Run Code</strong>."
  ); 
}

// Checks if 'amIExcited' is set to True or False
function checkBooleanTask() {
  let isBooleanSet = false;
  let boolVal = null;
  const blocks = workspace.getAllBlocks(false);

  for (let block of blocks) {
    if (block.type === 'variables_set') {
      const varId = block.getFieldValue('VAR');
      const varModel = block.workspace.getVariableById(varId);
      if (varModel && varModel.name.toLowerCase() === 'amiexcited') {
        const connected = block.getInputTargetBlock("VALUE");
        if (connected && connected.type === 'logic_boolean') {
          boolVal = connected.getFieldValue('BOOL');
          isBooleanSet = true;
          break;
        }
      }
    }
  }

  // If correct, show success modal personalised on the answer
  if (isBooleanSet) {
    overlay.style.display = "block";
    if (boolVal === "TRUE") {
      showLessonModal({
        heading: "Amazing! You're really excited about starting you're coding journey!",
        description: `
          <p>You did it! You've set <strong>'amIExcited' to ${boolVal}</strong>.</p>
          <p>I already had a feeling you might be destined to be a programmer!</p>
          <p>Think of <strong>Boolean values</strong> like choosing whether to join your friends on an adventure - <strong>either you're all in (True)</strong> or <strong>you're sitting this one out (False)</strong>.</p>
          <p>Your decision shapes the next part of your quest! Its the same with programming!</p>
          <p>When you're ready, click Next to move onto your next task!</p>
          `,
        img: mountainClimber,
        buttonText: "Next",
        onClose: function() {
          // On close, remove 'amIExcited' block, and start next task
          removeBlocksByVariable("amiexcited");
          overlay.style.display = "none";
          lesson1Step = 3;
          hideTutorialTooltip();
          startLessonTask2();
        }
      });
    } 
    
    else if (boolVal === "FALSE") {
      showLessonModal({
        heading: "No worries, keep exploring!",
        description: `
          <p>You did it! You've set <strong>'amIExcited' to ${boolVal}</strong>.</p>
          <p>Believe it or not, the person who made this very game wasn't too sure about programming at the start either. Now they do it every day and love what they do!</p>
          <p>Think of <strong>Boolean values</strong> like choosing whether to join your friends on an adventure - <strong>either you're all in (True)</strong> or <strong>you're sitting this one out (False)</strong>.</p>
          <p>Your decision shapes the next part of your quest! Its the same with programming!</p>
          <p>When you're ready, click Next to move onto your next task!</p>
        `,
        img: mountainClimber,
        buttonText: "Next",
        onClose: function() {
          // On close, remove 'amIExcited' block, and start next task
          removeBlocksByVariable("amiexcited");
          overlay.style.display = "none";
          lesson1Step = 3;
          hideTutorialTooltip();
          startLessonTask2();
        }
      });
    }
  } else {
    // Decrement score and prompt user to try again
    if (currentLevel === 'level_1') {
      decrementScore("level_1");
    }
    showModal("Unlucky! Please create a Boolean variable named 'amIExcited' and set it to true or false. Try again!", () => {});
  }
}

// Start lesson Task 2
function startLessonTask2() {
  showTooltipNextToElement(
    "variables_set",
    "<strong>1.</strong> Drag a <strong>'set item to'</strong> block.<br><br>" +
    "<strong>2.</strong> Name the variable anything you want <strong>(except myFavNum)</strong>.<br><br>" +
    "<strong>3.</strong> Set it to any number you like!"
  );
}

// Check if the user has created a second integer (any name)
function checkSecondVariableSet() {
  let isSet = false;
  let newIntValue = null;
  let numStr = "";
  const blocks = workspace.getAllBlocks(false);

  // Loop through blocks to find any variable (not 'myFavNum') set to a number
  for (let block of blocks) {
    if (block.type === 'variables_set') {
      const varId = block.getFieldValue('VAR');
      const varModel = block.workspace.getVariableById(varId);

      if (varModel && varModel.name.toLowerCase() !== 'myfavnum') {
        const connected = block.getInputTargetBlock("VALUE");
        if (connected && connected.type === 'math_number') {
          numStr = connected.getFieldValue("NUM");
          newIntValue = parseInt(numStr, 10);
          if (!isNaN(newIntValue)) {
            isSet = true;
            break;
          }
        }
      }
    }
  }

  // If they have show the success message
  if (isSet) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Good Job!",
      description: `
        <p><strong>Great! You've set your new variable to ${numStr}!</strong></p>
        <p>Next, <strong>let's explore the math block!</strong> With this block, you can perform different calculations like <strong>adding, subtracting, multiplying, or dividing</strong> your numbers. It's a simple tool that lets you solve problems and combine values in creative ways.</p>
        <p><strong>Think of it as a calculator built right into your code—one that you can use to power up your projects or even solve puzzles!</strong></p>
        <p><strong>When you're ready, click Next to learn how to perform calculations with code!</strong></p>
      `,
      img: additionCat,
      buttonText: "Next",
      onClose: function() {
        // On close, increment step and start next task
        overlay.style.display = "none";
        lesson1Step = 4;
        hideTutorialTooltip();
        startLessonTask3();
      }
    });
  } else {
    // If incorrect, decrement score and prompt the user to try again
    if (currentLevel === 'level_1') {
      decrementScore("level_1");
    }
    showModal("Unlucky! Please create another variable and set it to any number. Try again!", () => {});
  }
}

// Starts Lesson Task 3
function startLessonTask3() {
  showTooltipNextToElement(
    "math_arithmetic",
    "<strong>1.</strong> Drag out a <strong>math '+'</strong> block<br><br>" +
    "<strong>2.</strong> Drag out two <strong>variable 'item'</strong> blocks<br><br>" +
    "<strong>3.</strong> Rename the two variables to <strong>myFavNum</strong>, and <strong>your second integer variable</strong><br><br>" +
    "<strong>4.</strong> Drag a <strong>set 'item' to</strong>, name it <strong>result</strong>, and <strong>connect the math block!</strong>"
  );
}

// Checks if the arithmetic operation is correct and shows the result
function checkArithmeticTask() {
  let isArithmeticCorrect = false;
  let operator = null;
  let operandNames = { a: "", b: "" };
  const blocks = workspace.getAllBlocks(false);

  // Check if the users made 'set result to '' + '' block'
  for (let block of blocks) {
    if (block.type === 'variables_set') {
      const varId = block.getFieldValue('VAR');
      const varModel = block.workspace.getVariableById(varId);
      if (varModel && varModel.name.toLowerCase() === 'result') {
        const arithmeticBlock = block.getInputTargetBlock("VALUE");
        if (arithmeticBlock && arithmeticBlock.type === 'math_arithmetic') {
          operator = arithmeticBlock.getFieldValue("OP");

          const inputA = arithmeticBlock.getInputTargetBlock("A");
          const inputB = arithmeticBlock.getInputTargetBlock("B");

          // Get the variable names used in the arithmetic block
          if (inputA && inputA.type === 'variables_get') {
            const varIdA = inputA.getFieldValue('VAR');
            const varModelA = inputA.workspace.getVariableById(varIdA);
            operandNames.a = varModelA ? varModelA.name : "";
          }
          if (inputB && inputB.type === 'variables_get') {
            const varIdB = inputB.getFieldValue('VAR');
            const varModelB = inputB.workspace.getVariableById(varIdB);
            operandNames.b = varModelB ? varModelB.name : "";
          }
          isArithmeticCorrect = true;
          break;
        }
      }
    }
  }

  // Check if one variable is 'myFavNum' and the other is a different integer variable
  if (isArithmeticCorrect) {
    const opA = operandNames.a.toLowerCase();
    const opB = operandNames.b.toLowerCase();
    if (!((opA === "myfavnum" && opB && opB !== "myfavnum") ||
          (opB === "myfavnum" && opA && opA !== "myfavnum"))) {
      isArithmeticCorrect = false;
    }
  }
  
  if (!isArithmeticCorrect) {
    // If incorrect, decrement score and prompt the user to try again 
    if (currentLevel === 'level_1') {
      decrementScore("level_1");
    }
    showModal(
      "It looks like your setup isn't correct. Make sure your code includes:<br>" +
      "<pre><code>result = myFavNum + IntegerVariable</code></pre><br>" +
      "Double-check your blocks and try again!",
      () => {}
    );
    return;
  }

  // Reconstruct Python code from blocks to evaluate the result
  let userCode = Blockly.Python.workspaceToCode(workspace);

  // Remove any null assignements
  let lines = userCode
    .split("\n")
    .filter(line => !line.includes("= None"));

  // Separate variables
  let variableLines = [];
  let resultLine = "";
  let otherLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    const lowerTrimmed = trimmed.toLowerCase();

    // Identify the line that assigns to 'result'
    if (lowerTrimmed.startsWith("result =")) {
      // Clean up formatting and force standardised format
      resultLine = line.replace(/^.*result\s*=/i, "result =");
    } 
    // Store all other variable assignments
    else if (trimmed.includes("=")) {
      variableLines.push(line);
    } 
    // Catch any other lines like comments or print statements
    else {
      otherLines.push(line);
    }
  }
  // Build final code
  let finalCode = variableLines.join("\n");
  if (otherLines.length > 0) {
    finalCode += "\n" + otherLines.join("\n");
  }
  finalCode += "\n" + resultLine;

  finalCode += "\nresult";

  overlay.style.display = "block";

  // Delay slightly to ensure UI updates before Python runs
  setTimeout(() => {

    // Clear previous Python variables
    pyodide.runPython(`globals().clear()`);

    // Run the final code in Pyodide and show the result in a modal
    pyodide.runPythonAsync(finalCode)
      .then(resultValue => {
        // Convert Blockly operator names to readable words
        let opText = "";
        if (operator === "ADD") opText = "plus";
        else if (operator === "MINUS") opText = "minus";
        else if (operator === "MULTIPLY") opText = "times";
        else if (operator === "DIVIDE") opText = "divided by";
        else opText = operator ? operator.toLowerCase() : "unknown operator";

        // Show modal with the result of the equation
        showLessonModal({
          heading: "Fantastic! You're on a roll!",
          description: `
            <p><strong>Congrats, you successfully completed your first sum and stored it in the variable 'result'!</strong>:</p>
            <p><strong>${operandNames.a} ${opText} ${operandNames.b}</strong> equals <strong>${resultValue}</strong>!</p>
            <p><strong>You've now learned how to create variables, set their values, and perform sums with them!</strong></p>
            <p><strong>What do you think will happen if we create two string variables and try to "add" them together? Give it a try!</strong></p>
          `,
          img: pudgyPenguin,
          buttonText: "Next",
          onClose: function () {
            overlay.style.display = "none";
            lesson1Step = 5;
            hideTutorialTooltip();
            workspace.clear();
            startLessonTask4();
          }
        });
      })
      .catch(error => {
        showModal("There was an error executing your arithmetic expression. Please check your blocks and try again! " + error.message, () => {});
      });
  }, 200);
}


// Start Task 4
function startLessonTask4() {
  showTooltipNextToElement(
    "text",
    "<strong>1.</strong> Drag out two <strong>set 'item' to</strong> blocks and connect a <strong>text block (\" \")</strong> to each<br><br>" +
    "<strong>2.</strong> <strong>Rename the variables</strong> to <strong>two different names</strong> and <strong>write something in each text block!</strong><br><br>" +
    "<strong>3.</strong> Drag an <strong>math '+'</strong> and add two <strong>item</strong> blocks, <strong>change the names to what you named your two variables!</strong><br><br>" +
    "<strong>4.</strong> Drag a <strong>set 'item' to</strong>, name it <strong>result</strong>, and <strong>connect the math block!</strong>"
  );
}

// Check users blocks for the string concatination
function checkStringAddition() {
  let hasFirstString = false;
  let hasSecondString = false;
  let hasResultAssignment = false;
  let hasStringConcatenation = false;
  let firstVariable = null;
  let secondVariable = null;

  // Get all blocks in the workspace
  const blocks = workspace.getAllBlocks(false);

  // Loop through all blocks for two variables that are assigned string values
  for (let block of blocks) {
    if (block.type === 'variables_set') {

      const varId = block.getFieldValue('VAR');
      const varModel = block.workspace.getVariableById(varId);

      if (varModel) {
        const assignedValue = block.getInputTargetBlock("VALUE");

        // If the block sets a variable to a text (string), save the name and value
        if (assignedValue && assignedValue.type === 'text') {
          const textVal = assignedValue.getFieldValue('TEXT');
          if (!hasFirstString) {
            hasFirstString = true;
            firstVariable = varModel.name;
            firstVariableValue = textVal;
          } 
          
          else if (!hasSecondString) {
            hasSecondString = true;
            secondVariable = varModel.name;
            secondVariableValue = textVal;
          }
        }
      }
    }
  }

  // Generate and clean Python code
  let userCode = Blockly.Python.workspaceToCode(workspace);
  let cleanedCode = userCode
    .split("\n")
    .filter(line => !line.includes("= None") && line.trim() !== "")
    .map(line => line.trim())
    .join("\n");


  // Extract all lines
  let lines = cleanedCode.split("\n").map(line => line.trim());
  for (let i = 0; i < lines.length; i++) {
    if (/^result\s*=/i.test(lines[i])) {
      lines[i] = lines[i].replace(/^.*result\s*=/i, "result =");
    }
  }

  // Rebuild cleanedCode after casing fix
  cleanedCode = lines.join("\n");

  // Check if the last line of the code is the result assignment
  const lastLine = lines[lines.length - 1];
  const hasCorrectOrder = lastLine.startsWith("result =");

  // Use regex to find if 'result = var1 + var2' exists in the code
  const regex = /result\s*=\s*(\w+)\s*\+\s*(\w+)/i;
  const match = cleanedCode.match(regex);

  if (match) {
    const firstVarMatch = match[1];
    const secondVarMatch = match[2];

    // Check if the concatenated variables match the two string variables found earlier
    if (
      (firstVarMatch === firstVariable && secondVarMatch === secondVariable) ||
      (firstVarMatch === secondVariable && secondVarMatch === firstVariable)
    ) {
      hasStringConcatenation = true;
      hasResultAssignment = true;
    } 
  }
  
  // If everything is correct, show a success modal with level score
  if (hasFirstString && hasSecondString && hasResultAssignment && hasStringConcatenation && hasCorrectOrder) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Amazing! Strings Joined!",
      description: `
        <p>Your variables <strong>${firstVariable}</strong> and <strong>${secondVariable}</strong> were added together to make:</p>
        <p><strong>"${firstVariableValue + secondVariableValue}"!</strong></p>
        <p>In programming, we call this <strong>string concatenation!</strong></p>
        <p><strong>You've now completed Level 1: Variables. Congratulations! You are well on your way to becoming proficient in coding!</strong></p>
      `,
      img: successPenguin,
      buttonText: "Finish Lesson",
      score: lesson1Score,
      onClose: function () {
        // On close, update progress on the server and redirect the user to the game lobby
        overlay.style.display = "none";
        setTimeout(() => {
          fetch("/update-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level: "level_1", score: lesson1Score })
          })
          .then(response => response.text())
          .then(text => {
            try {
              const data = JSON.parse(text);
              window.location.href = "/gameLobby";
              sessionStorage.setItem("level1Completed", "true");
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          })
          .catch(error => console.error("Error updating progress:", error));
          hideTutorialTooltip();
        }, 300);
      }
    });
  } else {
    // If incorrect, decrement score and prompt the user to try again
    if (currentLevel === 'level_1') {
      decrementScore("level_1");
    }
    showModal(
      "<p>Your code isn't quite right:</p>" +
      "<pre><code>any_variable_name = 'text'</code></pre>" +
      "<pre><code>another_variable_name = 'text'</code></pre>" +
      "<pre><code>result = any_variable_name + another_variable_name</code></pre>(must be the last line)<br>" +
      "Try again!",
      () => {}
    );
  }
}

// Start Level 2
function startLevel2() {

  // Make sure Blockly workspace is ready
  if (!workspace) {
    console.error("Blockly workspace not initialized yet. Retrying...");
    return;
  }

  // Clear existing blocks and show the dim overlay
  workspace.clear();
  overlay.style.display = "block";
  lesson2Step = 0;

  // Show intro modal with example code
  showLessonModal({
    heading: "Welcome to Level 2: Conditionals",
    description: `
      <p>In this level, you'll learn how to make decisions in your code using <strong>if statements, else-if, and else clauses!</strong></p>
      <p><strong>Before facing any dangers, our adventurer and his friends needs to check if the weather is clear for their journey!</strong></p>
      <p>Try coding the if statement below:</p>
      <strong><pre><code>weather_is_clear = False

if weather_is_clear == True:
    print("It is safe to start your adventure!")
</code></pre></strong>
      <p><strong>When you're ready, click "Start Task 1" to begin!</strong></p>
    `,
    img: adventureStart,
    buttonText: "Start Task 1",
    onClose: function() {
      overlay.style.display = "none";
      startLevel2Task0();
    }
  });
}

// Start Task 1
function startLevel2Task0() {
  showTooltipNextToElement(
    "controls_if",
    "<strong>1.</strong> Drag out a <strong>set 'item' to</strong>, name it <strong>weather_is_clear</strong>, and make it <strong>false</strong> using the <strong>true</strong> block<br><br>" +
    "<strong>2.</strong> Drag out an <strong>if</strong> block, and an <strong>'item'</strong> block, and rename <strong>'item'</strong> to <strong>weather_is_clear</strong><br><br>" +
    "<strong>3.</strong> Connect <strong>weather_is_clear</strong> to the <strong>if</strong> to check <strong>if weather_is_clear = True</strong> using an <strong>\"=\"</strong> block<br><br>" +
    "<strong>4.</strong> In the <strong>'if'</strong>, use a print block to output <br><strong>'It is safe to start your adventure!'</strong>"
  );
}

// Check users answer for Task 1
function checkWeatherTask() {
  setTimeout(() => {
    let userCode = Blockly.Python.workspaceToCode(workspace);


    // Remove any assignment for weather_is_clear that sets it to None
    userCode = userCode.replace(/weather_is_clear\s*=\s*none\s*/gi, "");

    // Make code to lower case
    const lowerCode = userCode.toLowerCase();
    // Check if weather_is_clear is assigned to false
    const hasAssignmentFalse = lowerCode.includes("weather_is_clear = false");
    // Check if the conditional checks for if weather_is_clear == true
    const hasIfCondition = lowerCode.includes("if weather_is_clear == true:");
    // Check if print statement is correct
    const hasPrintSafe = lowerCode.includes("print('it is safe to start your adventure") ||
                           lowerCode.includes('print("it is safe to start your adventure');

    
    // If all parts are present, show success modal
    if (hasAssignmentFalse && hasIfCondition && hasPrintSafe) {
      workspace.clear();
      overlay.style.display = "block";
      showLessonModal({
        heading: "Fantastic! Let's go!",
        description: `
          <p><strong>You've smashed your first if statement! You're now ready to embark on your adventure!</strong></p>
          <p>As you step into the mystical forest, <strong>you sense a looming danger—a dragon is near!</strong> To keep our adventurer safe, you'll need to use decision-making in your code.</p>
          <p>This seems like a good place to introduce <strong>else conditions!</strong></p>
          <p>Try coding the following if statement to guide your hero:</p>
          <strong><pre><code>dragon_is_near = False

if dragon_is_near == True:
    print("Run away!")
else:
    print("Proceed on your adventure!")
      </code></pre></strong>
          <p><strong>When you're ready, click "Next Task" to continue your journey!</strong></p>
        `,
        img: dragon,
        buttonText: "Next Task",
        onClose: function() {
          // On close, increment step and start next task
          overlay.style.display = "none";
          startLevel2Task1();
          lesson2Step = 1;
        }
      });
    } else {
      // If incorrect, decrement score and prompt the user to try again with example code
      if (currentLevel === 'level_2') {
        decrementScore("level_2");
      }
      showModal(
        "It looks like your code isn't quite correct. Make sure it includes:" +
        "<strong><pre><code>" +
          "weather_is_clear = False\n" +
          "if weather_is_clear == True:\n" +
          "    print(\"It is safe to start your adventure\")" +
        "</code></pre></strong>" +
        "Try again!"
      );
    }
  }, 200);
}

  // Start Task 2
  function startLevel2Task1() {
    showTooltipNextToElement(
      "controls_if",
      "<strong>1.</strong> Add <strong>set 'dragon_is_near' to false</strong><br><br>" +
      "<strong>2.</strong> Drag an <strong>if</strong> block and check <strong>if dragon_is_near = true</strong><br><br>" +
      "<strong>3.</strong> In the <strong>if</strong>, print <strong>'Run away!'</strong><br><br>" +
      "<strong>4.</strong> Add an <strong>else</strong> using the gear icon, print <strong>'Proceed on your adventure!'</strong>"
    );
  }

  // Check if user completed the dragon task correctly
  function checkDragonTask() {
    setTimeout(() => {
      // Force dragon_is_near to True to test the user logic
      pyodide.runPython(`dragon_is_near = True`);

      let userCode = Blockly.Python.workspaceToCode(workspace);
      userCode = userCode.replace(/dragon_is_near\s*=\s*None/g, "# removed auto assignment");

      // Wrap code in Python stdout capturing logic to test printed output
      const wrappedCode =
"import sys\n" +
"import io\n\n" +
"# Backup the original stdout\n" +
"backup_stdout = sys.stdout\n" +
"capture = io.StringIO()\n" +
"sys.stdout = capture\n\n" +
userCode + "\n\n" +
"sys.stdout = backup_stdout\n" +
"capture.getvalue()\n";

      pyodide.runPythonAsync(wrappedCode)
        .then(output => {
          const printed = output.trim().toLowerCase();

          // Change user code to lower case, and assign each line to a boolean
          const lowerCode = userCode.toLowerCase();
          const hasAssignmentFalse = lowerCode.includes("dragon_is_near = false");
          const hasIfCondition = lowerCode.includes("if dragon_is_near == true:");
          const hasElseBlock = lowerCode.includes("else:");
          const hasPrintRunAway = lowerCode.includes("print('run away") || lowerCode.includes('print("run away');
          const hasPrintProceed = lowerCode.includes("print('proceed on your adventure") || lowerCode.includes('print("proceed on your adventure');

          // Check all parts exist in the users code
          if (hasAssignmentFalse && hasIfCondition && hasElseBlock && hasPrintRunAway && hasPrintProceed) {
            overlay.style.display = "block";
            workspace.clear();
            showLessonModal({
              heading: "Well Done!",
              description: `
                <p><strong>Your previous task was handled brilliantly!</strong></p>
                <p>Now, as our adventurers continue their journey, <strong>they stumble upon a wide, rushing river blocking the path!</strong></p>
                <p>They need to decide how to get across! Try the following:</p>
                <pre><code><strong>has_boat = False</strong>
<strong>has_rope = False

if has_boat == True:
    print("Row across the river!")
elif has_rope == True:
    print("Swing across the river!")
else:
    print("Find a shallow spot to walk through!")
</code></pre></strong>
            <p>This means that <strong>if the hero has a boat, they can row across; if not, but they have a rope, they can swing across; otherwise, they're going to get wet!</strong></p>
            <p>When you're ready, click "Next" to help our adventurers cross the river!</p>
            `,
              img: runningWater,
              buttonText: "Next",
              onClose: function() {
                // On close, increment step and start next task
                overlay.style.display = "none";
                lesson2Step = 2;
                startLevel2Task3();
              }
            });
          } else {
            // If incorrect, decrement score and prompt the user to try again with example code
            if (currentLevel === 'level_2') {
              decrementScore("level_2");
            }
            showModal(
              "It looks like your code isn't quite correct. Make sure your code includes:<br>" +
              "<strong><pre><code>" +
                "dragon_is_near = False\n" +
                "if dragon_is_near == True:\n" +
                "    print(\"Run away!\")\n" +
                "else:\n" +
                "    print(\"Proceed on your adventure!\")" +
              "</code></pre></strong>" +
              "Try again!"
            );
          }
        })
        .catch(error => {
          showModal("There was an error running your code: " + error.message, () => {});
        });
    }, 200);
  }

// Start Task 3
function startLevel2Task3() {
  showTooltipNextToElement(
    "controls_if",
    "<strong>1.</strong> Set <strong>has_boat</strong> and <strong>has_rope</strong> to <strong>false</strong><br><br>" +
    "<strong>2.</strong> Add an <strong>if block</strong>: <br>check <strong>has_boat = true</strong>, print <strong>'Row across the river!'</strong><br><br>" +
    "<strong>3.</strong> Add an <strong>else-if</strong>: check <strong>has_rope = true</strong>, print <strong>'Swing across the river!'</strong><br><br>" +
    "<strong>4.</strong> Add an <strong>else</strong>: print <strong>'Find a shallow spot to walk through!'</strong>"
  );
}


// Check for River task
function checkRiverTask() {
  setTimeout(() => {
    // Generate Python code from Blockly blocks
    let userCode = Blockly.Python.workspaceToCode(workspace);

    // Clean up default Blockly "None" assignments
    userCode = userCode.replace(/has_boat\s*=\s*none/gi, "");
    userCode = userCode.replace(/has_rope\s*=\s*none/gi, "");

    // Wrap user code in Python stdout capture to check printed output
    const wrappedCode =
"import sys\n" +
"import io\n\n" +
"# Backup the original stdout\n" +
"backup_stdout = sys.stdout\n" +
"capture = io.StringIO()\n" +
"sys.stdout = capture\n\n" +
userCode + "\n\n" +
"sys.stdout = backup_stdout\n" +
"capture.getvalue()\n";

    // Execute the Python code using Pyodide
    pyodide.runPythonAsync(wrappedCode)
      .then(output => {
        const printed = output.trim().toLowerCase();
        const lowerCode = userCode.toLowerCase();

        // Verify required elements are present in code
        const hasBoatAssignment = lowerCode.includes("has_boat = false");
        const hasRopeAssignment = lowerCode.includes("has_rope = false");
        const hasIfCondition = lowerCode.includes("if has_boat == true:");
        const hasElifCondition = lowerCode.includes("elif has_rope == true:");
        const hasElseCondition = lowerCode.includes("else:");

        // Check all three print messages
        const hasPrintRow = lowerCode.includes("print('row across the river") || lowerCode.includes('print("row across the river');
        const hasPrintSwing = lowerCode.includes("print('swing across the river") || lowerCode.includes('print("swing across the river');
        const hasPrintWade = lowerCode.includes("print('find a shallow spot to walk through") || lowerCode.includes('print("find a shallow spot to walk through');

        // If everything is present, show success modal
        if (hasBoatAssignment && hasRopeAssignment && hasIfCondition && hasElifCondition && hasElseCondition && hasPrintRow && hasPrintSwing && hasPrintWade) {
          workspace.clear();
          overlay.style.display = "block";
          showLessonModal({
            heading: "You helped them make it across!",
            description: `
              <p><strong>After overcoming obstacles in the forest, they stumble upon a small stand where a charismatic salesman awaits!</strong></p>
              <p>But his prized possession, a 300 year-old golden sword comes with a price. It's a bit rusty, but it's love at first sight!</p>
              <p><strong>If their treasure is greater than OR equal to 500</strong>, they'll be able to claim the sword and bolster your quest. Otherwise, they'll have to continue your adventure to gather more riches!</p>

<strong><pre><code>goldenSwordCost = 500

if treasureCost >= goldenSwordCost:
    print("Great news! Go back and get that sword!")
else:
    print("Keep looking for more treasure")
</code></pre></strong>

<p>Now, it's time to put your conditional logic to the test! Click next to move on!</p>
            `,
            img: brokenSword,
            buttonText: "Next Task",
            onClose: function() {
              // On close, increment step and start next task
              overlay.style.display = "none";
              lesson2Step = 3;
              startLevel2Task4();
            }
          });
        } else {
          // If incorrect, decrement score and prompt the user to try again with example code
          if (currentLevel === 'level_2') {
            decrementScore("level_2");
          }
          showModal(
            "It looks like your code doesn't have the correct structure. Make sure it includes:" +
            "<strong><pre><code>" +
              "has_boat = False\n" +
              "has_rope = False\n" +
              "if has_boat == True:\n" +
              "    print(\"Row across the river!\")\n" +
              "elif has_rope == True:\n" +
              "    print(\"Swing across the river!\")\n" +
              "else:\n" +
              "    print(\"Find a shallow spot to walk through!\")" +
            "</code></pre></strong>" +
            "Double-check your blocks and try again."
          );
        }
      })
      .catch(error => {
        showModal("There was an error running your code: " + error.message, () => {});
      });
  }, 200);
}

// Start Task 4
function startLevel2Task4() {
  showTooltipNextToElement(
    "logic_compare",
    "<strong>1.</strong> Set <strong>goldenSwordCost = 500</strong><br><br>" +
    "<strong>2.</strong> Add an <strong>if</strong>: <br>check <strong>if treasureValue ≥ goldenSwordCost</strong> <br>using the <strong>\"=\" block</strong><br><br>" +
    "<strong>3.</strong> In the <strong>if</strong>: print <strong>'Go back and get that sword!'</strong><br><br>" +
    "<strong>4.</strong> In the <strong>else</strong>: print <strong>'Keep looking for more treasure!'</strong>"
  );
}


function checkSwordTask() {
  setTimeout(() => {
    let userCode = Blockly.Python.workspaceToCode(workspace);

    // Remove None assignements from variables
    userCode = userCode.replace(/goldenSwordCost\s*=\s*none/gi, "");
    userCode = userCode.replace(/treasureValue\s*=\s*none/gi, "");

    // Clean up code and make it lower case
    const lowerCode = userCode.toLowerCase();
    const strippedCode = lowerCode.replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

    // Check if users code is correct
    const hasIfCondition = strippedCode.includes("if treasurevalue goldenswordcost");
    const hasPrintSword = strippedCode.includes("printgo back and get that sword");
    const hasElsePrint = strippedCode.includes("printkeep looking for more treasure");

    // If it has all checks, show success modal
    if (hasIfCondition && hasPrintSword && hasElsePrint) {
      workspace.clear();
      overlay.style.display = "block";
      showLessonModal({
        heading: "Great work! They can now claim their treasure!",
        description: `
          <p><strong>The adventurers' treasure was more than enough to secure the ancient, though broken, golden sword!</strong></p>
          <p>But the charismatic salesman isn't finished yet. <strong>As they inspect the rusty blade, he leans in and hands them a scroll which contains the prophecy of the sword!</strong></p>
          <p>The adventurers follow the map to find the man who forged the sword, and he offers them a deal!</p>
          <p>He offers to repair the sword just for finding him, and for an extra 20 gold, <strong>he will transform it completely!</strong></p>

          <strong><pre><code>found_creator = False\n
if found_creator = True AND gold >= 20:
  print("The creator offers to fix and upgrade the sword!")
else if found_creator = True AND gold < 20:
  print("The creator fixes the sword!")
else:
  print("The adventurers keep looking for the creator!")
</code></pre></strong>

          <p>When you're ready, click Next to face this new challenge!</p>
        `,
        img: penguinInGold,
        buttonText: "Next Task",
        onClose: function() {
          // On close, increment step and start next task
          overlay.style.display = "none";
          lesson2Step = 4;
          startLevel2Task5();
        }
      });
    } else {
      // If incorrect, decrement score and prompt the user to try again with example code
      if (currentLevel === 'level_2') {
        decrementScore("level_2");
      }
      showModal(
        "Nearly there! Make sure you check if <code>treasureValue >= goldenSwordCost</code> and print the correct messages!" +
        "<strong><pre><code>goldenSwordCost = 500\n\nif treasureCost >= goldenSwordCost:\n    print(\"Great news! Go back and get that sword!\")\nelse:\n    print(\"Don't worry, keep looking and you're bound to find more treasure\")</code></pre></strong>",
        () => {}
      );
    }
  }, 200);
}



// Start Task 5
function startLevel2Task5() {
  showTooltipNextToElement(
    "controls_if",
    "<strong>1.</strong> Set <strong>found_creator = false</strong><br><br>" +
    "<strong>2.</strong> Add <strong>if</strong>: check <strong>if found_creator = true AND gold ≥ 20</strong><br><br>" +
    "<strong>3.</strong> In <strong>if</strong>: print <strong>'The creator offers to fix and upgrade the sword!'</strong><br><br>" +
    "<strong>4.</strong> Add <strong>else-if</strong>: check <strong>if found_creator = true AND gold < 20</strong>, print <strong>'The creator fixes the sword!'</strong><br><br>" +
    "<strong>5.</strong> Add <strong>else</strong>: print <strong>'The adventurers keep looking for the creator!'</strong>"
  );
}

// Check Creator Task
function checkCreatorTask() {
  setTimeout(() => {
    let userCode = Blockly.Python.workspaceToCode(workspace);

    // Remove any assignment of None for found_creator and gold.
    userCode = userCode.replace(/found_creator\s*=\s*none/gi, "");
    userCode = userCode.replace(/gold\s*=\s*none/gi, "");

    // Clean up code and make lower case
    const lowerCode = userCode.toLowerCase();
    const strippedCode = lowerCode.replace(/[^a-z0-9\s><=]/g, "").replace(/\s+/g, " ").trim();

    // Check if users code is correct
    const hasFoundCreatorAssignment = strippedCode.includes("foundcreator = false");
    const hasIfCondition = strippedCode.includes("if foundcreator == true and gold >= 20");
    const hasElifCondition = strippedCode.includes("elif foundcreator == true and gold < 20");
    const hasElsePrint = strippedCode.includes("printthe adventurers keep looking for the creator");

    // If correct, show success modal with level score
    if (hasFoundCreatorAssignment && hasIfCondition && hasElifCondition && hasElsePrint) {
      overlay.style.display = "block";
      showLessonModal({
          heading: "The creator fixes and upgrades your sword!",
          description: `
            <p><strong>Your conditional logic is spot-on! The adventurers are shocked by the true power their sword was hiding!</strong></p>
            <p><strong>The creator has evaluated the adventurers' treasure and decided to fully upgrade the sword... This decision will help the adventurers face any danger they face along their quest!<strong></p>
            <p><strong>You've now completed level 2: Conditionals! Well done!</strong></p>
          `,
          img: lightningSword,
          score: lesson2Score,
          buttonText: "Finish Lesson",
          onClose: function() {
            // On close, update level and score progress to server
            overlay.style.display = "none";
            setTimeout(() => {
              fetch("/update-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ level: "level_2", score: lesson2Score })
              })
              .then(response => {
                return response.text();
              })
              .then(text => {
                try {
                  const data = JSON.parse(text);
                  // Navigate back to gameLobby
                  window.location.href = "/gameLobby";
                  // Set level 2 to completed
                  sessionStorage.setItem("level2Completed", "true");
                } catch (e) {
                  console.error("Error parsing JSON:", e);
                }
              })
              .catch(error => console.error("Error updating progress:", error));
              hideTutorialTooltip();
            }, 500);
          }
        });
    } else {
      // If incorrect, decrement score and prompt the user to try again with example code
      if (currentLevel === 'level_2') {
        decrementScore("level_2");
      }
      showModal(
        "Good effort! Try again! Use the below code to help:" +
        "<strong><pre><code>" +
          "if found_creator = True AND gold >= 20:\n" +
          "  print(\"The creator offers to fix and upgrade the sword!\")\n" +
          "else if found_creator = True AND gold < 20:\n" +
          "  print(\"The creator fixes the sword!\")\n" +
          "else:\n" +
          "  print(\"The adventurers keep looking for the creator!\")" +
        "</code></pre></strong>",
        () => {}
      );
    }
  }, 200);
}







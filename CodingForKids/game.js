// Get current level from URL (e.g., ?level=level_1)
const urlParams = new URLSearchParams(window.location.search);
const currentLevel = urlParams.get('level') || 'tutorial';

// Toolboxes define available blocks for each level
const tutorialToolbox = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'variables_get' }, 
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } }
  ]
};

// Toolbox for level 1
const level1toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'variables_get' }, 
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'text'},
    { kind: 'block', type: 'logic_boolean' },
    { kind: 'block', type: 'math_arithmetic' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
  ],
};

// Toolbox for level 2
const level2toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'variables_get' },
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'logic_boolean' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
    { kind: 'block', type: 'logic_compare' },      
    { kind: 'block', type: 'logic_operation' },     
    { kind: 'block', type: 'text_print' },
    { kind: 'block', type: 'text' }           
  ]
};

// Toolbox for level 3
const level3toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'variables_get' },        
    { kind: 'block', type: 'variables_set' },        
    { kind: 'block', type: 'lists_create_with' },
    { kind: 'block', type: 'controls_forEach' },      
    { kind: 'block', type: 'controls_whileUntil' },        
    { kind: 'block', type: 'controls_if' },           
    { kind: 'block', type: 'logic_compare' }, 
    { kind: 'block', type: 'logic_operation' }, 
    { kind: 'block', type: 'logic_boolean' },        
    { kind: 'block', type: 'text' },                   
    { kind: 'block', type: 'text_print' }              
  ]
};

// Toolbox for each step of level 4 (tasks get harder as the steps progress)
const level4toolboxTask1 = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'procedures_defnoreturn' },
    { kind: 'block', type: 'variables_get' },
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'controls_forEach' },
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'logic_compare' },
    { kind: 'block', type: 'logic_boolean' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
    { kind: 'block', type: 'text' },
    { kind: 'block', type: 'text_print' }
  ]
};

const level4toolboxTask2 = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'procedures_defnoreturn' },
    { kind: 'block', type: 'variables_get' },
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'lists_create_with' },
    { kind: 'block', type: 'controls_forEach' },
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'math_arithmetic' },
    { kind: 'block', type: 'logic_compare' },
    { kind: 'block', type: 'text_join' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
    { kind: 'block', type: 'text' },
    { kind: 'block', type: 'text_print' }
  ]
};

const level4toolboxTask3 = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'procedures_defreturn' },
    { kind: 'block', type: 'variables_get' },
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'lists_create_with' },
    { kind: 'block', type: 'controls_forEach' },
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'math_arithmetic' },
    { kind: 'block', type: 'logic_compare' },
    { kind: 'block', type: 'text_join' },
    { kind: 'block', type: 'logic_boolean' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
    { kind: 'block', type: 'text' },
    { kind: 'block', type: 'text_print' }
  ]
};

const level4toolboxTask4 = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'procedures_defreturn' },
    { kind: 'block', type: 'variables_get' },
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'lists_create_with' },
    { kind: 'block', type: 'lists_length' },
    { kind: 'block', type: 'lists_getIndex' },
    { kind: 'block', type: 'controls_forEach' },
    { kind: 'block', type: 'controls_whileUntil' },
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'math_arithmetic' },
    { kind: 'block', type: 'logic_compare' },
    { kind: 'block', type: 'text_join' },
    { kind: 'block', type: 'logic_boolean' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
    { kind: 'block', type: 'text' },
    { kind: 'block', type: 'text_print' }
  ]
};

// A comprehensive toolbox for free play level or fallback
const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'procedures_defnoreturn' },
    { kind: 'block', type: 'procedures_defreturn' },
    { kind: 'block', type: 'variables_get' },
    { kind: 'block', type: 'variables_set' },
    { kind: 'block', type: 'lists_create_with' },
    { kind: 'block', type: 'lists_getIndex' },
    { kind: 'block', type: 'controls_forEach' },
    { kind: 'block', type: 'controls_whileUntil' },
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'math_arithmetic' },
    { kind: 'block', type: 'logic_compare' },
    { kind: 'block', type: 'text_join' },
    { kind: 'block', type: 'logic_operation' },
    { kind: 'block', type: 'logic_boolean' },
    { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
    { kind: 'block', type: 'text' },
    { kind: 'block', type: 'text_print' }
  ]
};

// Declare global variables for Blockly and Pyodide
let workspace;
let pyodide;

// Creates the Blockly coding workspace based on the current level
function createBlocklyWorkspace() {
  const blocklyDiv = document.getElementById('blocklyDiv');
  if (!blocklyDiv) {
    console.error("blocklyDiv not found.");
    return;
  }

  // Load toolbox based on the level and current lesson step
  if (currentLevel === 'tutorial') {
    workspace = Blockly.inject(blocklyDiv, { toolbox: tutorialToolbox });
  } else if (currentLevel === 'level_1') {
    workspace = Blockly.inject(blocklyDiv, { toolbox: level1toolbox });
  } else if (currentLevel === 'level_2') {
    workspace = Blockly.inject(blocklyDiv, {toolbox: level2toolbox});
  } else if (currentLevel === 'level_3') {
    workspace = Blockly.inject(blocklyDiv, {toolbox: level3toolbox});
  } else if (currentLevel === 'level_4') {
    if (lesson4Step === 0) {
      workspace = Blockly.inject(blocklyDiv, { toolbox: level4toolboxTask1 });
    } else if (lesson4Step === 1) {
      workspace.updateToolbox(level4toolboxTask2);
    } else if (lesson4Step === 2) {
      workspace.updateToolbox(level4toolboxTask3);
    } else if (lesson4Step === 3 || lesson4Step === 4) {
      workspace.updateToolbox(level4toolboxTask4);
    }
  } else {
    workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
  }
  resizeBlocklyWorkspace(); // Fit workspace to container
}


// Resize the Blockly workspace to match its container
function resizeBlocklyWorkspace() {
  const blocklyDiv = document.getElementById('blocklyDiv');
  const container = document.getElementById('blocklyContainer');

  if (!blocklyDiv || !container) {
    console.error("Blockly containers (blocklyDiv or blocklyContainer) not found in the DOM.");
    return;
  }

  // Set workspace size
  blocklyDiv.style.width = container.offsetWidth + 'px';
  blocklyDiv.style.height = container.offsetHeight + 'px';

  // Trigger resize in Blockly
  if (workspace) {
    Blockly.svgResize(workspace);
  } else {
    console.error("Blockly workspace is not initialized.");
  }
}

// Setup functionality for the bin icon
function setupTrashBin() {
  const trashBin = document.getElementById("trashBin");

  if (!trashBin) {
    console.error("bin element not found.");
    return;
  }

  // Enlarge on drag over
  trashBin.addEventListener("dragover", (event) => {
    event.preventDefault();
    trashBin.style.transform = "scale(1.2)"; 
  });

  trashBin.addEventListener("dragleave", () => {
    trashBin.style.transform = "scale(1)"; 
  });

  // Clear all blocks when bin is clicked
  trashBin.addEventListener("click", () => {
    if (workspace) {
      workspace.clear(); 
    }
  });
}

// Handle hints and solution button based on current level and step
document.addEventListener('DOMContentLoaded', () => {
  const hintButton = document.getElementById('hintButton');

  if (currentLevel === 'free_play') {
    overlay.style.display = 'block'; 
    showModal('Welcome to Free Play Mode!<br><br>This is your space to experiment, explore, and practice anything you’ve learned. Click run code to see your blocks in python code!', () => {
      overlay.style.display = 'none'; 
    });

    if (hintButton) {
      hintButton.style.display = 'none';
    }
  }

  const showSolution = document.getElementById('showSolution');
  // Handle Show Solution button clicks
  if (showSolution) {
    showSolution.addEventListener('click', () => {
      // Handle solution click for Tutorial and Free Play
      if (currentLevel === 'free_play' || currentLevel === 'tutorial') {
        const modeMessage = currentLevel === 'free_play' ? 'Free Play' : 'Tutorial';
        showModal(`Solution is disabled in ${modeMessage} mode.`);
        return;
      }

      // Level 1 Solution logic
      if (currentLevel === 'level_1') {
        if (lesson1Step === 1) {
          showModal("<strong>Come on! You can do it!</strong><br><br>Drag out the <strong>'set item to'</strong> block, rename it to <strong>myFavNum</strong>, and <strong>set it to your favourite number!</strong>");
        } else if (lesson1Step === 2) {
          showModal("<strong>Come on! You can do it!</strong><br><br>Drag out the <strong>'set item to'</strong> block, rename it to <strong>amIExcited</strong>, and <strong>set it true or false!</strong>");
        } else if (lesson1Step === 3) {
          showModal("<strong>Come on! You can do it!</strong><br><br>Drag out the <strong>'set item to'</strong> block, rename it to <strong>secondInteger</strong>, and <strong>set it to any number!</strong>");
        } else {
          decrementScore("level_1");
          loadSolutionLevel1(lesson1Step);
        }
      } 
      
      // Load solutions for other levels
      else if (currentLevel === 'level_2') {
        decrementScore("level_2");
        loadSolutionLevel2(lesson2Step);
      } else if (currentLevel === 'level_3') {
        decrementScore("level_3");
        loadSolutionLevel3(lesson3Step);
      } else if (currentLevel === 'level_4') {
        decrementScore("level_4");
        loadSolutionLevel4(lesson4Step);
      } else {
        console.error("Unsupported level for solution.");
      }
    });
  } else {
    console.error("Show Solution button with ID 'showSolution' not found in the DOM.");
  }

  // Attach hint logic for each level
  if (hintButton) {
    hintButton.addEventListener('click', () => {
      if (currentLevel === 'tutorial') {
        showHintForLevel('tutorial', tutorialStep);
      } else if (currentLevel === 'level_1') {
        showHintForLevel('level_1', lesson1Step);
      } else if (currentLevel === 'level_2') {
        showHintForLevel('level_2', lesson2Step);
      } else if (currentLevel === 'level_3') {
        showHintForLevel('level_3', lesson3Step);
      } else if (currentLevel === 'level_4') {
        showHintForLevel('level_4', lesson4Step);
      }
    });
  }
});


// Load Python interpreter using Pyodide (runs in browser)
async function initializePyodide() {
  try {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
    });
  } catch (error) {
    console.error("Failed to load Pyodide:", error);
  }
}

initializePyodide();


// Function to run Python code created using blocks
async function runCode() {
  if (!pyodide) {
    showModal('Pyodide is not loaded yet.');
    return;
  }
  const userCode = Blockly.Python.workspaceToCode(workspace);
  if (!userCode) {
    showModal('Please write some code.');
    return;
  }

  // Run code function for current level & step
  if (currentLevel === 'tutorial') {
    tutorialRunCode();
    return;
  } 
  // Lesson 1 Logic
  else if (currentLevel === 'level_1') {
    if (lesson1Step === 1) {
      checkMyFirstIntSet();
      return;
    } else if (lesson1Step === 2) {
      checkBooleanTask();
      return;
    } else if (lesson1Step === 3) {
      checkSecondVariableSet();
      return;
    } else if (lesson1Step === 4) {
      checkArithmeticTask();
      return;
    } else if (lesson1Step === 5) {
      checkStringAddition();
      return;
    }
  } 
  // Lesson 2 Logic
  else if (currentLevel === 'level_2') {
    if (lesson2Step === 0) {
      checkWeatherTask();
      return;
    } else if (lesson2Step === 1) {
      checkDragonTask();
      return;
    } else if (lesson2Step === 2) {
      checkRiverTask();
      return;
    } else if (lesson2Step === 3) {
      checkSwordTask();
      return;
    } else if (lesson2Step === 4) {
      checkCreatorTask();
      return;
    }
  } 
  // Lesson 3 Logic
  else if (currentLevel === 'level_3') {
     if (lesson3Step === 1) {
      checkHutTask();
      return;
    } else if (lesson3Step === 2) {
      checkCastleTask();
      return;
    } else if (lesson3Step === 3) {
      checkDoorTask();
      return;
    } else if (lesson3Step === 4){
      checkTrapTask();
      return;
    } 
  } 
  // Lesson 4 Logic
  else if (currentLevel === 'level_4') {
    if (lesson4Step === 0){
      checkBeginJourneyTask();
      return;
    } else if (lesson4Step === 1) { 
      checkDivideTreasureTask();
      return;
    } else if (lesson4Step === 2) { 
      checkBuildMachineTask();
      return;
    } else if (lesson4Step === 3) { 
      checkSayGoodbyeTask();
      return;
    } else if (lesson4Step === 4) { 
      checkGuideHomeTask();
      return;
  }
}
  // If it's not a structured level, just run the Python code
  await runPythonCode(userCode);
}


// Runs the generated Python code inside Pyodide
async function runPythonCode(userCode) {
  try {
    // Clear variables from previous runs
    pyodide.runPython(`globals().clear()`);

    // Clean user code to avoid errors
    const cleanedCode = userCode
      .replace(/^\s*\w+\s*=\s*None\s*[\r\n]*/gm, '')
      .replace(/^.*\bglobal\b.*[\r\n]?/gm, '');

    // Show output in modal
    showFreePlayModal(cleanedCode);
  } catch (error) {
    showFreePlayModal(`Error: ${error.message}`);
  }
}

// Once page is ready
document.addEventListener('DOMContentLoaded', () => {

  // Attach event listener to the Run button
const runButton = document.getElementById('runButton');
if (runButton) {
    runButton.addEventListener('click', runCode);
} else {
    console.error("Run button with ID 'runButton' not found in the DOM.");
}

// Attach event listener to the Home button
const homeButton = document.getElementById("homeButton");
if (homeButton) {
    homeButton.addEventListener("click", () => {
        // Only update progress if tutorial is fully completed
        if (tutorialStep === 6) {

            // Save completion status locally
            sessionStorage.setItem("tutorialCompleted", "true");

            // Send POST to the server that the tutorial is complete
            fetch("/update-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ level: "tutorial" })  
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = "/gameLobby";
            })
            .catch(error => console.error("Error updating progress:", error));
        } else {
            // Go back to game lobby even if tutorial isn't complete
            window.location.href = "/gameLobby";
        }
    });
} else {
    console.error("Home button not found in the DOM.");
}

  // Set up Blockly and trash bin, then load Pyodide
  createBlocklyWorkspace();
  setupTrashBin();
  initializePyodide();

  // Resize Blockly if the window size changes
  window.addEventListener('resize', () => {
    resizeBlocklyWorkspace();
  });

  // Wait until Blockly is fully loaded before starting level logic
  const checkBlocklyReady = setInterval(() => {
      if (typeof workspace !== "undefined" && workspace !== null) {
          clearInterval(checkBlocklyReady);

          // Start the appropriate level
          if (currentLevel === 'tutorial') {
              startTutorial();
          } else if (currentLevel === 'level_1') {
              startLevel1();
          } else if (currentLevel === 'level_2') {
              startLevel2();
          } else if(currentLevel === 'level_3') {
              startLevel3();
          } else if(currentLevel === 'level_4') {
              startLevel4();
          }

      }
  }, 200); // Keep checking every 200ms until ready
});

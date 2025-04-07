// Declare global variables
let workspace;
let pyodide;
let currentQuiz;

// Initialise quiz scores at the maximum 3
let quiz1Score = 3;
let quiz2Score = 3;
let quiz3Score = 3;
let quiz4Score = 3;
const overlay = document.getElementById("dimOverlay");

// Add fallback for older Blockly versions if needed
if (typeof Blockly.Xml.textToDom !== 'function') {
  Blockly.Xml.textToDom = function(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    return xmlDoc.documentElement;
  };
}

// Show hint for the current quiz, including how many mistakes and the correct solution
function showHintForQuiz(currentQuiz) {
  let hintMessage = "";

  if (currentQuiz === "quiz_1") {
    hintMessage = "<strong>Hint: Total mistakes in this code: 4</strong><br><br>" +
    "Try fixing the code so it adds the two variables 25 + 10 together and stores it in a variable called 'result'!<br><br>"+
    "<strong>⭐Remember: Each time you hit Run Code with the incorrect blocks, you lose a star!</strong><br><br>" +
    "<strong>Correct Code:</strong><br>" +
    "<strong><pre><code>" +
      "firstNum = 25\n" +
      "secondNum = 10\n" +
      "result = firstNum + secondNum" +
      "</code></pre></strong>";
  }  
  
  else if (currentQuiz === "quiz_2") {
     hintMessage = "<strong>Hint: Total mistakes in this code: 4</strong><br><br>" +
     "Fix the code to calculate if the gamer has beat their high score!<br><br>" +
     "<strong>⭐Remember: Each time you hit Run Code with the incorrect blocks, you lose a star!</strong><br><br>" +
     "<strong>Correct Code:</strong><br>" +
      "<strong><pre><code>" +
      "newHighScore = False\n" +
      "highScore = 200\n" +
      "if currentScore > highScore:\n" +
      "    newHighScore = True\n" +
      "    print(\"You have beat your high score!\")\n" +
      "else:\n" +
      "    print(\"Keep trying to better your score!\")" +
      "</code></pre></strong>";
    } 
    
    else if (currentQuiz === "quiz_3") {
      hintMessage = "<strong>Hint: Total mistakes in this code: 5</strong><br><br>" +
      "Fix the loops and conditionals to achieve the correct score logic! Remember, the user should have completed 4 or more rounds and achieved the correct score!:<br><br>" +
      "<strong>⭐Remember: Each time you hit Run Code with the incorrect blocks, you lose a star!</strong><br><br>" +
      "<strong>Correct Code:</strong><br>" +
        "<strong><pre><code>" +
        "levelScores = [10, 15, 20, 5]\n" +
        "totalScore = 0\n" +
        "for score in levelScores:\n" +
        "    totalScore += score\n" +
        "if len(levelScores) >= 4 and totalScore >= 50:\n" +
        "    print(\"Bonus Awarded!\")\n" +
        "else:\n" +
        "    print(\"Unlucky, try again!\")" +
        "</code></pre></strong>";
    } 
    
    else if (currentQuiz === "quiz_4") {
       hintMessage = "<strong>Hint: Total mistakes in this code: 3</strong><br><br>" +
       "Fix the code to work out how many cupcakes they can afford to buy and return the number of cupcakes!:<br><br>" +
       "<strong>⭐Remember: Each time you hit Run Code with the incorrect blocks, you lose a star!</strong><br><br>" +
       "<strong>Correct Code:</strong><br>" +
      "<strong><pre><code>" +
      "money = 50\n" +
      "cupcakePrice = 5\n" +
      "cupcakeCount = 0\n\n" +
      "def buyCupcakes(money, cupcakePrice, cupcakeCount):\n" +
      "    while money >= cupcakePrice:\n" +
      "        money -= cupcakePrice\n" +
      "        cupcakeCount += 1\n" +
      "return cupcakeCount" +
      "</code></pre></strong>";
    }

  showModal(hintMessage, () => {});
}

// Page setup once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // Get quiz value from URL, default to quiz_1 
  const urlParams = new URLSearchParams(window.location.search);
  currentQuiz = urlParams.get('quiz') || 'quiz_1';

  // Define a standard toolbox for all quizzes
  const standardToolbox = {
    kind: 'flyoutToolbox',
    contents: [
      { kind: 'block', type: 'procedures_defnoreturn' },
      { kind: 'block', type: 'procedures_defreturn' },
      { kind: 'block', type: 'variables_get' },
      { kind: 'block', type: 'variables_set' },
      { kind: 'block', type: 'lists_create_with' },
      { kind: 'block', type: 'lists_length' },
      { kind: 'block', type: 'controls_forEach' },
      { kind: 'block', type: 'controls_if' },
      { kind: 'block', type: 'math_arithmetic' },
      { kind: 'block', type: 'logic_compare' },
      { kind: 'block', type: 'logic_boolean' },
      { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
      { kind: 'block', type: 'text' },
      { kind: 'block', type: 'text_print' }
    ]
  };

  // Load XML blocks based on the quiz
  createBlocklyWorkspace(standardToolbox);
  if (currentQuiz === 'quiz_1') {
    loadQuiz1Preload();
  } else if (currentQuiz === 'quiz_2') {
    loadQuiz2Preload();
  } else if (currentQuiz === 'quiz_3') {
    loadQuiz3Preload();
  } else if (currentQuiz === 'quiz_4') {
    loadQuiz4Preload();
  }

  setupTrashBin();
  initializePyodide();
  resizeBlocklyWorkspace();
  window.addEventListener('resize', resizeBlocklyWorkspace);

  // Home Button: Return to quiz lobby
  const homeButton = document.getElementById('homeButton');
  if(homeButton) {
    homeButton.addEventListener('click', () => {
      window.location.href = '/quizLobby';
    });
  }

  // Hint button: Show hint
  const hintButton = document.getElementById('hintButton');
  if (hintButton) {
    hintButton.addEventListener('click', () => {
      showHintForQuiz(currentQuiz);
    });
  }

  // Run Button: Run code
  const runButton = document.getElementById('runButton');
  if(runButton) {
    runButton.addEventListener('click', runCode);
  }

  // Auto-show hint on page load
  showHintForQuiz(currentQuiz);
});

// Create the Blockly workspace with the provided toolbox
function createBlocklyWorkspace(toolbox) {
  const blocklyDiv = document.getElementById('blocklyDiv');
  if (!blocklyDiv) {
    console.error("blocklyDiv not found.");
    return;
  }
  workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
  resizeBlocklyWorkspace();
}

// Dynamically resize the Blockly workspace
function resizeBlocklyWorkspace() {
  const blocklyDiv = document.getElementById('blocklyDiv');
  const container = document.getElementById('blocklyContainer');
  if (!blocklyDiv || !container) {
    console.error("Blockly container or blocklyDiv not found.");
    return;
  }
  blocklyDiv.style.width = container.offsetWidth + 'px';
  blocklyDiv.style.height = container.offsetHeight + 'px';

  if (workspace) {
    Blockly.svgResize(workspace);
  }
}

// Set up trash bin to clear all blocks
function setupTrashBin() {
  const trashBin = document.getElementById("trashBin");
  if (!trashBin) {
    console.error("Trash bin element not found.");
    return;
  }
  trashBin.addEventListener("click", () => {
    if (workspace) {
      workspace.clear();
    }
  });
}

// Load Pyodide from CDN
async function initializePyodide() {
  try {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
    });
  } catch (error) {
    console.error("Failed to load Pyodide:", error);
  }
}

// Run the correct function to check quiz answer
async function runCode() {
  if (!pyodide) {
    alert("Pyodide is not loaded yet.");
    return;
  }
  if (currentQuiz === 'quiz_1') {
    checkQuiz1();
    return;
  } else if (currentQuiz === 'quiz_2') {
    checkQuiz2();
    return;
  } else if (currentQuiz === 'quiz_3') {
    checkQuiz3();
    return;
  } else if (currentQuiz === 'quiz_4') {
    checkQuiz4();
    return;
  }

  // Otherwise, just run the generated Python code
  const userCode = Blockly.Python.workspaceToCode(workspace);
  if (!userCode) {
    alert("Please create some code using the blocks.");
    return;
  }
  try {
    pyodide.runPython(userCode);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Centre all spawned in blocks in the workspace
function centerBlocks() {
  // Get all blocks that are not inside other blocks
  const topBlocks = workspace.getTopBlocks(true); 
  if (topBlocks.length === 0) return; // If there's no blocks, stop here

  // Get the middle of the visible workspace area
  const metrics = workspace.getMetrics();
  const viewCenterX = metrics.viewWidth / 2;
  const viewCenterY = metrics.viewHeight / 2;

  // Find the area that all the blocks take up
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  topBlocks.forEach(block => {
    const pos = block.getRelativeToSurfaceXY(); // Block's position
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    const blockHW = block.getHeightWidth(); // Block's size
    maxX = Math.max(maxX, pos.x + blockHW.width);
    maxY = Math.max(maxY, pos.y + blockHW.height);
  });

  // Work out the centre point of all the blocks
  const blocksCenterX = (minX + maxX) / 2;
  const blocksCenterY = (minY + maxY) / 2;

  // Calculate how much to move the blocks
  const dx = viewCenterX - blocksCenterX;
  const dy = viewCenterY - blocksCenterY;

  // Move all the top-level blocks to the centre
  topBlocks.forEach(block => {
    block.moveBy(dx, dy);
  });
}

// Pre-loaded blocks for the Quiz 1 workspace
function loadQuiz1Preload() {
  const quiz1XML = `
  <xml xmlns="https://developers.google.com/blockly/xml">
    <!-- Block 1: Set firstNum incorrectly to 6 instead of 25 -->
    <block type="variables_set" x="20" y="20">
    <field name="VAR">firstNum</field>
    <value name="VALUE">
      <block type="math_number">
        <field name="NUM">6</field>
      </block>
    </value>
    <next>
      <!-- Block 2: Set secondNum incorrectly to True instead of 10 -->
      <block type="variables_set">
        <field name="VAR">secondNum</field>
        <value name="VALUE">
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </value>
        <next>
          <!-- Block 3: Incorrect addition: 'item' = firstNum + result -->
          <block type="variables_set">
            <field name="VAR">item</field>
            <value name="VALUE">
              <block type="math_arithmetic">
                <field name="OP">ADD</field>
                <value name="A">
                  <block type="variables_get">
                    <field name="VAR">firstNum</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get">
                    <field name="VAR">result</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`;

  // Convert XML to Blockly format and add it to workspace
  const xmlDom = Blockly.Xml.textToDom(quiz1XML);
  Blockly.Xml.domToWorkspace(xmlDom, workspace);
  // Center blocks
  centerBlocks();
}

// Check users answer for Quiz 1
function checkQuiz1() {
  // Get the Python code generated from the blocks
  const code = Blockly.Python.workspaceToCode(workspace);

  // Expected correct code snippet
  const expectedCode = "<strong><pre><code>" +
      "firstNum = 25\n" +
      "secondNum = 10\n" +
      "result = firstNum + secondNum" +
      "</code></pre></strong>";

  // Check if the code is correct
  if (code.includes("firstNum = 25") &&
      code.includes("secondNum = 10") &&
      code.includes("result = firstNum + secondNum") &&
      !code.includes("firstNum = 6") &&
      !code.includes("secondNum = True") &&
      !code.includes("item =")) {

    // Generate the star display HTML using the current quiz score.
    const starHTML = generateStarHTML(quiz1Score);

    // Show success message with star display and update progress on the server
    showModal("<p>Amazing! You fixed the addition block to correctly equal!</p>" + expectedCode + starHTML, () => {
      fetch("/update-progress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ level: "quiz_1", score: quiz1Score }),
        credentials: 'include' 
      })
      .then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          // Go back to the quiz lobby
          window.location.href = "/quizLobby";
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      })
      .catch(error => console.error("Error updating progress:", error));

    });

  } else {
    // If incorrect, decrement the score and show the expected code
    decrementScore("quiz_1", "quiz");
    showModal("<p>Unlucky! Please check your blocks and try again.</p>" +
              "<p>Expected code is:</p>" + expectedCode, () => {});
  }
}

// Pre-loaded blocks for the Quiz 2 workspace
function loadQuiz2Preload() {
  const quiz2XML = `
  <xml xmlns="https://developers.google.com/blockly/xml">
  <!-- Block 1: Set newHighScore incorrectly to TRUE (should be False) -->
  <block type="variables_set" x="50" y="30">
    <field name="VAR">newHighScore</field>
    <value name="VALUE">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <next>
      <!-- Block 2: Set highScore to 200 -->
      <block type="variables_set">
        <field name="VAR">highScore</field>
        <value name="VALUE">
          <block type="math_number">
            <field name="NUM">200</field>
          </block>
        </value>
        <next>
          <!-- Block 3: Incorrect if block combining the boolean and numeric condition, with an else branch -->
          <block type="controls_if">
            <mutation else="1"></mutation>
            <value name="IF0">
              <block type="logic_compare">
                <field name="OP">LT</field>
                <value name="A">
                  <block type="variables_get">
                    <field name="VAR">currentScore</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get">
                    <field name="VAR">highScore</field>
                  </block>
                </value>
              </block>
            </value>
            <statement name="DO0">
              <block type="variables_set">
                <field name="VAR">newHighScore</field>
                <value name="VALUE">
                  <block type="logic_boolean">
                    <field name="BOOL">FALSE</field>
                  </block>
                </value>
                <next>
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">Keep trying to better your score!</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </statement>
            <statement name="ELSE">
              <block type="text_print">
                <value name="TEXT">
                  <block type="text">
                    <field name="TEXT">You have beat your high score!</field>
                  </block>
                </value>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`;
  // Convert XML to Blockly format and add it to workspace
  const xmlDom = Blockly.Xml.textToDom(quiz2XML);
  Blockly.Xml.domToWorkspace(xmlDom, workspace);
  // Center blocks
  centerBlocks();
}

// Check users answer for Quiz 2
function checkQuiz2() {
  // Generate Python code from the workspace
  let userCode = Blockly.Python.workspaceToCode(workspace);

  // Clean the code by making it lowercase and removing symbols
  const lowerCode = userCode.toLowerCase();
  const strippedCode = lowerCode.replace(/[^a-z0-9\s><=]/g, " ").replace(/\s+/g, " ").trim();

  // Use boolean method to check the users answer
  const hasNewHighScoreAssignment = strippedCode.includes("newhighscore = false");
  const hasHighScoreAssignment = strippedCode.includes("highscore = 200");
  const hasIfCondition = strippedCode.includes("if currentscore > highscore");
  const hasInsideAssignment = strippedCode.includes("newhighscore = true");
  const hasUnlockedPrint = strippedCode.includes("print you have beat your high score");
  const hasElseKeyword = strippedCode.includes("else");
  const hasElsePrint = strippedCode.includes("print keep trying to better your score");

  // What the correct code should look like
  const expectedCode = "<strong><pre><code>" +
            "newHighScore = False\n" +
            "highScore = 200\n" +
            "if currentScore > highScore:\n" +
            "    newHighScore = True\n" +
            "    print(\"You have beat your high score!\")\n" +
            "else:\n" +
            "    print(\"Keep trying to better your score!\")" +
            "</code></pre></strong>";


  // If answer is correct, show message with star score and update progress
  if (hasNewHighScoreAssignment && hasHighScoreAssignment && hasIfCondition &&
      hasInsideAssignment && hasUnlockedPrint && hasElseKeyword && hasElsePrint) {
        const starHTML = generateStarHTML(quiz2Score);
        showModal("<p>Fantastic! You fixed the conditional logic to get:</p>" + expectedCode + starHTML, () => {
          fetch("/update-progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ level: "quiz_2", score: quiz2Score }),
            credentials: 'include' 
          })
          .then(response => response.text())
          .then(text => {
            try {
              const data = JSON.parse(text);
              window.location.href = "/quizLobby";
            } catch (err) {
              console.error("Error parsing JSON:", err);
            }
          })
          .catch(error => console.error("Error updating progress:", error));
        });
      } else {
        // If incorrect, decrement the score and show the expected code
        decrementScore("quiz_2", "quiz");
        showModal("<p>Not quite right. Unlucky! Please check your blocks and try again.</p>" +
                  "<p>Expected code is:</p>" + expectedCode, () => {});
      }
    }

// Pre-loaded blocks for the Quiz 3 workspace
function loadQuiz3Preload() {
  const quiz3XML = `<xml xmlns="https://developers.google.com/blockly/xml">
  <!-- SECTION 1: Two set blocks (connected to each other) -->
  <block type="variables_set" x="50" y="20">
    <field name="VAR">levelScores</field>
    <value name="VALUE">
      <block type="lists_create_with">
        <mutation items="4"></mutation>
        <value name="ADD0">
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
        <value name="ADD1">
          <block type="math_number">
            <field name="NUM">15</field>
          </block>
        </value>
        <value name="ADD2">
          <block type="math_number">
            <field name="NUM">20</field>
          </block>
        </value>
        <value name="ADD3">
          <block type="math_number">
            <field name="NUM">5</field>
          </block>
        </value>
      </block>
    </value>
    <next>
      <block type="variables_set">
        <field name="VAR">totalScore</field>
        <value name="VALUE">
          <block type="math_number">
            <field name="NUM">0</field>
          </block>
        </value>
      </block>
    </next>
  </block>

  <!-- SECTION 2: For loop -->
  <block type="controls_forEach" x="50" y="200">
    <field name="VAR">levelScores</field>
    <value name="LIST">
      <block type="variables_get">
        <field name="VAR">score</field>
      </block>
    </value>
    <statement name="DO">
      <block type="variables_set">
        <field name="VAR">score</field>
        <value name="VALUE">
          <block type="math_arithmetic">
            <field name="OP">ADD</field>
            <value name="A">
              <block type="variables_get">
                <field name="VAR">totalScore</field>
              </block>
            </value>
            <value name="B">
              <block type="variables_get">
                <field name="VAR">score</field>
              </block>
            </value>
          </block>
        </value>
      </block>
    </statement>
  </block>

  <!-- SECTION 3: If statement (incorrect) as another top-level block -->
  <block type="controls_if" x="50" y="400">
    <mutation else="1"></mutation>
    <value name="IF0">
      <block type="logic_operation">
        <field name="OP">OR</field>
        <value name="A">
          <block type="logic_compare">
            <field name="OP">GTE</field>
            <value name="A">
              <block type="lists_length">
                <value name="VALUE">
                  <block type="variables_get">
                    <field name="VAR">levelScores</field>
                  </block>
                </value>
              </block>
            </value>
            <value name="B">
              <block type="math_number">
                <field name="NUM">4</field>
              </block>
            </value>
          </block>
        </value>
        <value name="B">
          <block type="logic_compare">
            <field name="OP">LTE</field>
            <value name="A">
              <block type="variables_get">
                <field name="VAR">totalScore</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number">
                <field name="NUM">50</field>
              </block>
            </value>
          </block>
        </value>
      </block>
    </value>
    <statement name="DO0">
      <block type="text_print">
        <value name="TEXT">
          <block type="text">
            <field name="TEXT">Unlucky, try again!</field>
          </block>
        </value>
      </block>
    </statement>
    <statement name="ELSE">
      <block type="text_print">
        <value name="TEXT">
          <block type="text">
            <field name="TEXT">Bonus Awarded!</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`;
  // Convert XML to Blockly format and add it to workspace
  const xmlDom = Blockly.Xml.textToDom(quiz3XML);
  Blockly.Xml.domToWorkspace(xmlDom, workspace);
  // Center blocks
  centerBlocks();
}

// Check users answer for Quiz 3
function checkQuiz3() {
  // Generate Python code from the workspace
  let code = Blockly.Python.workspaceToCode(workspace);

  // Remove any auto-assignment lines that set variables to None:
  code = code.replace(/levelScores\s*=\s*None\s*/gi, "");
  code = code.replace(/score\s*=\s*None\s*/gi, "");
  code = code.replace(/totalScore\s*=\s*None\s*/gi, "");

  // Clean the code by making it lowercase and removing symbols
  const lowerCode = code.toLowerCase();
  const normalized = lowerCode.replace(/[^a-z0-9\s><=]/g, " ").replace(/\s+/g, " ").trim();

  // Use boolean method to check the users answer
  const cond1 = normalized.includes("levelscores = 10 15 20 5");
  const cond2 = normalized.includes("totalscore = 0");
  const cond3 = normalized.includes("for score in levelscores");
  const cond4 = normalized.includes("if len levelscores >= 4 and totalscore >= 50");
  const cond5 = normalized.includes("print bonus awarded");
  const cond6 = normalized.includes("else") && normalized.includes("print unlucky try again");

  // What the correct code should look like
  const expectedCode = "<strong><pre><code>" +
      "levelScores = [10, 15, 20, 5]\n" +
      "totalScore = 0\n" +
      "for score in levelScores:\n" +
      "    totalScore += score\n" +
      "if len(levelScores) >= 4 and totalScore >= 50:\n" +
      "    print(\"Bonus Awarded!\")\n" +
      "else:\n" +
      "    print(\"Unlucky, try again!\")" +
      "</code></pre></strong>";

  // If answer is correct, show message with star score and update progress
  if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6) {
    const starHTML = generateStarHTML(quiz3Score);
    showModal("<p>Well Done! You made the below code like a pro!</p>" + expectedCode + starHTML, () => {
      fetch("/update-progress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ level: "quiz_3", score: quiz3Score }),
        credentials: 'include' 
      })
      .then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          window.location.href = "/quizLobby";
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      })
      .catch(error => console.error("Error updating progress:", error));
    });
  } else {
    // If incorrect, decrement the score and show the expected code
    decrementScore("quiz_3", "quiz");
    showModal("<p>Not quite right. Unlucky! Please check your blocks and try again.</p>" +
              "<p>Expected code is:</p>" + expectedCode, () => {});
  }
}

// Pre-loaded blocks for the Quiz 4 workspace
function loadQuiz4Preload() {
  const quiz4XML = `<xml xmlns="https://developers.google.com/blockly/xml">
  <!-- SECTION 1: Variable Assignments -->
  <block type="variables_set" x="50" y="20">
    <field name="VAR">money</field>
    <value name="VALUE">
      <block type="math_number">
        <field name="NUM">50</field>
      </block>
    </value>
    <next>
      <block type="variables_set">
        <field name="VAR">cupcakePrice</field>
        <value name="VALUE">
          <block type="math_number">
            <field name="NUM">5</field>
          </block>
        </value>
        <next>
          <block type="variables_set">
            <field name="VAR">cupcakeCount</field>
            <value name="VALUE">
              <block type="math_number">
                <field name="NUM">0</field>
              </block>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>

  <!-- SECTION 2: Function Definition (Incorrect) -->
  <block type="procedures_defreturn" x="50" y="150">
    <field name="NAME">buyCupcakes</field>
    <mutation>
      <arg name="money"></arg>
      <arg name="cupcakePrice"></arg>
      <arg name="cupcakeCount"></arg>
    </mutation>
    <statement name="STACK">
      <!-- Incorrect While Loop: uses money < cupcakePrice instead of money >= cupcakePrice -->
      <block type="controls_whileUntil">
        <field name="MODE">WHILE</field>
        <value name="BOOL">
          <block type="logic_compare">
            <field name="OP">LT</field>
            <value name="A">
              <block type="variables_get">
                <field name="VAR">money</field>
              </block>
            </value>
            <value name="B">
              <block type="variables_get">
                <field name="VAR">cupcakePrice</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <!-- Subtract cupcakePrice from money -->
          <block type="variables_set">
            <field name="VAR">money</field>
            <value name="VALUE">
              <block type="math_arithmetic">
                <field name="OP">MINUS</field>
                <value name="A">
                  <block type="variables_get">
                    <field name="VAR">money</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get">
                    <field name="VAR">cupcakePrice</field>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <!-- Incorrect update: sets cupcakePrice instead of incrementing cupcakeCount -->
              <block type="variables_set">
                <field name="VAR">cupcakePrice</field>
                <value name="VALUE">
                  <block type="math_arithmetic">
                    <field name="OP">ADD</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR">cupcakeCount</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number">
                        <field name="NUM">1</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </statement>
    <!-- Incorrect return: returns money instead of cupcakeCount -->
    <value name="RETURN">
      <block type="variables_get">
        <field name="VAR">money</field>
      </block>
    </value>
  </block>
</xml>`;
// Convert XML to Blockly format and add it to workspace
const xmlDom = Blockly.Xml.textToDom(quiz4XML);
  Blockly.Xml.domToWorkspace(xmlDom, workspace);
  // Center blocks
  centerBlocks();
}

// Check users answer for Quiz 4
function checkQuiz4() {
  // Generate Python code from the workspace
  let code = Blockly.Python.workspaceToCode(workspace);

  // Clean the code by removing null values
  code = code.replace(/money\s*=\s*none/gi, "");
  code = code.replace(/cupcakeprice\s*=\s*none/gi, "");
  code = code.replace(/cupcakecount\s*=\s*none/gi, "");

  // Clean the code by making it lowercase and removing symbols
  const lowerCode = code.toLowerCase();
  const normalized = lowerCode.replace(/[^a-z0-9\s><=]/g, " ").replace(/\s+/g, " ").trim();

  // Use boolean method to check the users answer
  const c1 = normalized.includes("money = 50");
  const c2 = normalized.includes("cupcakeprice = 5");
  const c3 = normalized.includes("cupcakecount = 0");
  const c4 = normalized.includes("while money >= cupcakeprice");
  const c5 = (
    normalized.includes("cupcakecount += 1") ||
    normalized.includes("cupcakecount = cupcakecount 1")
  );
  const c6 = normalized.includes("return cupcakecount");

  // What the correct code should look like
  const expectedCode = "<strong><pre><code>" +
      "money = 50\n" +
      "cupcakePrice = 5\n" +
      "cupcakeCount = 0\n\n" +
      "def buyCupcakes(money, cupcakePrice):\n" +
      "    while money >= cupcakePrice:\n" +
      "        money -= cupcakePrice\n" +
      "        cupcakeCount += 1\n" +
      "    return cupcakeCount" +
      "</code></pre></strong>";

  // If answer is correct, show message with star score and update progress
  if (c1 && c2 && c3 && c4 && c5 && c6) {
    const starHTML = generateStarHTML(quiz4Score);
    showModal("<p>Spot on! You fixed the function to calculate how many cupcakes we can afford!</p>" + expectedCode + starHTML, () => {
      fetch("/update-progress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ level: "quiz_4", score: quiz4Score }),
        credentials: 'include' 
      })
      .then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          window.location.href = "/quizLobby";
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      })
      .catch(error => console.error("Error updating progress:", error));
    });
  } else {
    // If incorrect, decrement the score and show the expected code
    decrementScore("quiz_4", "quiz");
    showModal("<p>Not quite right. Unlucky! Please check your blocks and try again.</p>" +
              "<p>Expected code is:</p>" + expectedCode, () => {});
  }
}



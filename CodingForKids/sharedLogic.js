// Wait for the DOM to fully load before running any scripts
document.addEventListener("DOMContentLoaded", () => {
  // Check if the image preload container already exists
    let preloadContainer = document.getElementById("preloadContainer");

    // If not, create a hidden container to hold preloaded images
    if (!preloadContainer) {
      preloadContainer = document.createElement("div");
      preloadContainer.id = "preloadContainer";
      preloadContainer.style.display = "none";
      document.body.appendChild(preloadContainer);
    }

    // Logic to load images into preloaded container 
    window.treasureChestPreload = new Image();
    window.treasureChestPreload.src = "/static/Animations/Treasure-chest.gif";

    window.adventureStart = new Image();
    window.adventureStart.src = "/static/Animations/start-adventure.gif";

    window.House = new Image();
    window.House.src = "/static/Animations/house.gif";

    window.dragon = new Image();
    window.dragon.src = "/static/Animations/dragon.gif";

    window.lightSwitch = new Image();
    window.lightSwitch.src = "/static/Animations/light-switch.gif";

    window.runningWater = new Image();
    window.runningWater.src = "/static/Animations/Running-Water.gif";

    window.brokenSword = new Image();
    window.brokenSword.src = "/static/Animations/broken-sword.gif";

    window.Castle = new Image();
    window.Castle.src = "/static/Animations/castle.gif";

    window.padlock = new Image();
    window.padlock.src = "/static/Animations/doorUnlocked.gif";

    window.Jetpack = new Image();
    window.Jetpack.src = "/static/Animations/Jetpack.gif";

    window.Farewell = new Image();
    window.Farewell.src = "/static/Animations/Goodbyeedited.gif";

    window.HomeFinish = new Image();
    window.HomeFinish.src = "/static/Animations/calm-home.gif";

    window.Key = new Image();
    window.Key.src = "/static/Animations/key.gif";

    window.penguinInGold = new Image();
    window.penguinInGold.src = "/static/Animations/Penguin-in-Gold.gif";

    window.lightningSword = new Image();
    window.lightningSword.src = "/static/Animations/lightning-sword.gif";

    window.mathDuckGuy = new Image();
    window.mathDuckGuy.src = "/static/Animations/Math-thinking.gif";

    window.doorSafe = new Image();
    window.doorSafe.src = "/static/Animations/safeDoor.gif";

    window.successPenguin = new Image();
    window.successPenguin.src = "/static/Animations/success.gif";

    window.additionCat = new Image();
    window.additionCat.src = "/static/Animations/addition-cat.gif";

    window.pudgyPenguin = new Image();
    window.pudgyPenguin.src = "/static/Animations/pudgy-penguin.gif";

    window.mountainClimber = new Image();
    window.mountainClimber.src = "/static/Animations/mountain-climb.gif";


    preloadContainer.appendChild(window.adventureStart);
    preloadContainer.appendChild(window.treasureChestPreload);
    preloadContainer.appendChild(window.House);
    preloadContainer.appendChild(window.lightSwitch);
    preloadContainer.appendChild(window.dragon);
    preloadContainer.appendChild(window.mathDuckGuy);
    preloadContainer.appendChild(window.Castle);
    preloadContainer.appendChild(window.Key);
    preloadContainer.appendChild(window.padlock);
    preloadContainer.appendChild(window.Jetpack);
    preloadContainer.appendChild(window.runningWater);
    preloadContainer.appendChild(window.Farewell);
    preloadContainer.appendChild(window.HomeFinish);
    preloadContainer.appendChild(window.lightningSword);
    preloadContainer.appendChild(window.brokenSword);
    preloadContainer.appendChild(window.penguinInGold);
    preloadContainer.appendChild(window.successPenguin);
    preloadContainer.appendChild(window.doorSafe);
    preloadContainer.appendChild(window.additionCat);
    preloadContainer.appendChild(window.pudgyPenguin);
    preloadContainer.appendChild(window.mountainClimber);

  });


// Check if a variable in the workspace has been renamed
function waitForVariableRename(targetName, callback) {
    const pollInterval = setInterval(() => {
        const blocks = workspace.getAllBlocks(false);
        const foundTarget = blocks.some(block => {
            if (block.type === 'variables_get' || block.type === 'variables_set') {
                const varId = block.getFieldValue('VAR');
                const varModel = block.workspace.getVariableById(varId);
                return varModel && varModel.name === targetName;
            }
            return false;
        });

        if (foundTarget) {
            clearInterval(pollInterval);
            callback();
        }
    }, 500);
}

// Function to spawn tooltip for tasks 
function showTooltipNextToElement(target, message) {
  const tooltipDiv = document.getElementById("tutorialTooltip");
  if (!tooltipDiv) {
    console.error("tutorialTooltip not found.");
    return;
  }

  let targetRect = null;
  let isFlyout = false;

  const targetElement = document.getElementById(target);
  if (targetElement) {
    targetRect = targetElement.getBoundingClientRect();
  } else if (typeof workspace !== "undefined") {
    const flyout = workspace.getFlyout();
    if (!flyout) {
      console.error("No flyout found. Toolbox must be a 'flyoutToolbox'.");
      return;
    }
    const flyoutWorkspace = flyout.getWorkspace();
    const flyoutBlocks = flyoutWorkspace.getTopBlocks(false);
    let targetBlock = flyoutBlocks.find(b => b.type === target);
    if (targetBlock) {
      const blockSvg = targetBlock.getSvgRoot();
      if (!blockSvg) return;
      targetRect = blockSvg.getBoundingClientRect();
      isFlyout = true;
    }
  }

  if (!targetRect) {
    console.warn(`No block of type "${target}" found in the toolbox or element with ID "${target}" not found.`);
    return;
  }

  // Position tooltip
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipWidth = tooltipDiv.offsetWidth || 150;


  tooltipDiv.style.display = "block";
  tooltipDiv.style.visibility = "hidden";
  const tooltipHeight = tooltipDiv.offsetHeight;
  tooltipDiv.style.visibility = "";

  const offsetX = 105;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  let tooltipLeft = targetCenterX + offsetX;

  let tooltipTop = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);

  // Ensure the tooltip doesn't go off the top of the screen
  if (tooltipTop < 10) {
    tooltipTop = 10;
  }
  // Ensure the tooltip doesn't go off the bottom of the screen
  if (tooltipTop + tooltipHeight > viewportHeight - 10) {
    tooltipTop = viewportHeight - tooltipHeight - 10;
  }

  // If the tooltip would go off-screen to the right, position it to the left of its target
  if (tooltipLeft + tooltipWidth > viewportWidth) {
    tooltipLeft = targetRect.left - tooltipWidth - (offsetX * 1);
  }

  tooltipDiv.style.left = `${tooltipLeft + window.scrollX}px`;
  tooltipDiv.style.top = `${tooltipTop + window.scrollY}px`;

  tooltipDiv.innerHTML = message;
  tooltipDiv.style.display = "block";
}

// Hide tooltip
function hideTutorialTooltip() {
  const tooltipDiv = document.getElementById("tutorialTooltip");
  if (tooltipDiv) {
    tooltipDiv.style.display = "none";
  }
}

// Function to show lesson modal
function showLessonModal({ heading, description, img, buttonText, score, onClose }) {
  const modal = document.getElementById("lessonModal");
  const modalHeading = document.getElementById("lessonModalHeading");
  const modalDescription = document.getElementById("lessonModalDescription");
  const modalImage = document.getElementById("lessonModalImage");
  const closeButton = document.getElementById("closeLessonModal");

  // Update the modal content.
  modalHeading.textContent = heading;
  
  // Append star display at the bottom if a score is provided.
  let finalDescription = description;
  if (typeof score !== "undefined") {
      finalDescription += generateStarHTML(score);
  }
  modalDescription.innerHTML = finalDescription;

  if (typeof img === "object" && img.src) {
    modalImage.src = img.src;
  } else {
    modalImage.src = img;
  }

  closeButton.textContent = buttonText || "Next";

  modal.scrollTop = 0; 
  modalDescription.scrollTop = 0;
  
  modal.style.display = "flex";

  closeButton.disabled = true;

  // After 1 second, enable the button 
  setTimeout(() => {
    closeButton.disabled = false;
    closeButton.onclick = function() {
      modal.style.display = "none";
      if (onClose) {
        onClose();
      }
    };
  }, 1000);
}

// Logic to create user score display
function generateStarHTML(score, maxStars = 3) {
  let html = '<div class="lesson-score-container" style="margin-top: 1em; text-align: center; color: goldenrod;">';
  html += "<p>Your score for this level:</p>";
  // Generate star icons
  for (let i = 0; i < maxStars; i++) {
    if (i < score) {
      html += '<i class="bi bi-star-fill"></i>';
    } else {
      html += '<i class="bi bi-star"></i>';
    }
  }
  // Choose message based on score
  let message = "";
  if (score === 3) {
    message = "Amazing! Perfect 3 out of 3!";
  } else if (score === 2) {
    message = "Great effort! So close to a perfect score!";
  } else if (score === 1) {
    message = "Good attempt! Try again to better your score!";
  } else {
    message = "Unlucky! Try again to better your score!";
  }
  html += `<p>${message}</p>`;
  html += '</div>';
  return html;
}


// Show modal function
function showModal(message, onClose) {
  const modal = document.getElementById('resultModal');
  const modalMessage = document.getElementById('modalMessage');
  const modalContent = modal.querySelector('.modal-content');
  const closeModalButton = document.getElementById('closeModal');
  const overlay = document.getElementById('dimOverlay');

  if (!modal || !modalMessage || !modalContent || !closeModalButton) {
    console.error("Modal elements are missing from the DOM.");
    return;
  }

  // Set the message
  modalMessage.innerHTML = message;
  
  // Check if the content includes a <code> element.
  if (modalMessage.querySelector('code')) {
    modalContent.classList.add('modal-content-wide');
  } else {
    modalContent.classList.remove('modal-content-wide');
  }

  overlay.style.display = "block";
  modal.style.display = 'block';

  // Close modal when clicking the close button
  closeModalButton.onclick = () => {
    modal.style.display = 'none';
    overlay.style.display = "none";
    if (onClose) {
      onClose();
    }
  };

  // Close modal when clicking outside the modal content
  window.onclick = (event) => {
    if (event.target === modal) {
      overlay.style.display = "none";
      modal.style.display = 'none';
    }
  };
}

// Modal specific to free play
function showFreePlayModal(code, onClose) {
  const modal = document.getElementById('freePlayModal');
  const modalMessage = document.getElementById('freePlayModalMessage');
  const closeModalButton = document.getElementById('freePlayClose');
  const overlay = document.getElementById('dimOverlay');

  if (!modal || !modalMessage || !closeModalButton) {
    console.error("Free play modal elements are missing from the DOM.");
    return;
  }

  // Build the modal content
  modalMessage.innerHTML = `
    <p>Your Python Code:</p>
    <div class="code-container">
      <pre><code>${code}</code></pre>
    </div>
  `;
  overlay.style.display = "block";
  modal.style.display = 'block';

  closeModalButton.onclick = () => {
    overlay.style.display = "none";
    modal.style.display = 'none';
    if (onClose) {
      onClose();
    }
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      overlay.style.display = "none";
      modal.style.display = 'none';
      if (onClose) {
        onClose();
      }
    }
  };
}
  
// Function to remove a specific block
function removeBlocksByVariable(variableName) {
  const blocks = workspace.getAllBlocks(false);

  blocks.forEach(block => {
    const varId = block.getFieldValue('VAR'); // Get variable ID
    if (varId) {
      const variable = block.workspace.getVariableById(varId);
      if (variable && variable.name.toLowerCase() === variableName.toLowerCase()) {
        block.dispose(); // Remove the block from the workspace
      }
    }
  });
}

// Update Score display on level button
function updateScoreDisplay(key, score, type = "level") { 
  let elementId = "";
  
  if (type === "level") {
    if (key === "level_1") {
      elementId = "level1-btn";
    } else if (key === "level_2") {
      elementId = "level2-btn";
    } else if (key === "level_3") {
      elementId = "level3-btn";
    } else if (key === "level_4") {
      elementId = "level4-btn";
    }
  } else if (type === "quiz") {
    if (key.startsWith("quiz_")) {
      let quizNumber = key.split("_")[1];
      elementId = "quiz" + quizNumber + "-btn";
    }
  }
  
  const button = document.getElementById(elementId);

  if (button) {
    let currentHigh = parseInt(button.dataset.highScore) || 0;
    // Only update if the new score is higher 
    if (score >= currentHigh) {
      button.dataset.highScore = score;
      const stars = button.querySelectorAll(".star-container i");
      stars.forEach((star, index) => {
        star.className = (index < score) ? "bi bi-star-fill" : "bi bi-star";
    });
  }
}
}
  
// Function to decrement score while making sure it can't go below 0
function decrementScore(key, type = "level") {
  if (type === "level") {
    if (key === "level_1") {
      lesson1Score = Math.max(lesson1Score - 1, 0);
      updateScoreDisplay("level_1", lesson1Score);
    } else if (key === "level_2") {
      lesson2Score = Math.max(lesson2Score - 1, 0);
      updateScoreDisplay("level_2", lesson2Score);
    } else if (key === "level_3") {
      lesson3Score = Math.max(lesson3Score - 1, 0);
      updateScoreDisplay("level_3", lesson3Score);
    } else if (key === "level_4") {
      lesson4Score = Math.max(lesson4Score - 1, 0);
      updateScoreDisplay("level_4", lesson4Score);
    }
  } else if (type === "quiz") {
    if (key === "quiz_1") {
      quiz1Score = Math.max(quiz1Score - 1, 0);
      updateScoreDisplay("quiz_1", quiz1Score, "quiz");
    } else if (key === "quiz_2") {
      quiz2Score = Math.max(quiz2Score - 1, 0);
      updateScoreDisplay("quiz_2", quiz2Score, "quiz");
    } else if (key === "quiz_3") {
      quiz3Score = Math.max(quiz3Score - 1, 0);
      updateScoreDisplay("quiz_3", quiz3Score, "quiz");
    } else if (key === "quiz_4") {
      quiz4Score = Math.max(quiz4Score - 1, 0);
      updateScoreDisplay("quiz_4", quiz4Score, "quiz");
    }
  }
}

  // Custom rename logic
  Blockly.FieldVariable.prototype.showEditor_ = function() {
    const choiceModal = document.getElementById("variableChoiceModal");
    const renameBtn = document.getElementById("renameOption");
    const chooseBtn = document.getElementById("chooseOption");
  
    renameBtn.onclick = null;
    chooseBtn.onclick = null;
  
    // If user clicks "Rename Variable"
    renameBtn.onclick = () => {
      choiceModal.style.display = "none";
      showRenameModalForField(this);
    };
  
    // If user clicks "Choose Existing Variable"
    chooseBtn.onclick = () => {
      choiceModal.style.display = "none";
      showExistingVariablesModal(this);
    };
  
    // Show the choice modal
    choiceModal.style.display = "flex";
  };
  
  // Existing variables button
  function showExistingVariablesModal(field) {
    const existingModal = document.getElementById("existingVariablesModal");
    const existingList = document.getElementById("existingVariablesList");
    const renameBtn = document.getElementById("renameBtn"); 
    const cancelChooseBtn = document.getElementById("cancelChooseBtn");
  
    existingList.innerHTML = "";
  
    // Gather existing variables from the workspace
    const workspace = field.sourceBlock_.workspace;
    let variableList = workspace.getAllVariables(); 
    variableList.sort(Blockly.VariableModel.compareByName);
  
    // Create a button for each variable
    variableList.forEach(variable => {
      const btn = document.createElement("button");
      btn.textContent = variable.name;
      btn.style.margin = "5px";
      btn.onclick = () => {
        field.setValue(variable.getId());
        existingModal.style.display = "none";
      };
      existingList.appendChild(btn);
    });
  
    renameBtn.onclick = () => {
      existingModal.style.display = "none";
      showRenameModalForField(field);
    };
  
    cancelChooseBtn.onclick = () => {
      existingModal.style.display = "none";
    };
  
    existingModal.style.display = "flex";
  }
  
  function showRenameModalForField(field) {
    
    const currentName = field.getText();
    const renameModal = document.getElementById("renameVariableModal");
    const renameInput = document.getElementById("renameVariableInput");
    const renameConfirmBtn = document.getElementById("renameConfirmBtn");
    const renameCancelBtn = document.getElementById("renameCancelBtn");
  
    renameInput.value = currentName;
    renameModal.style.display = "flex";
  
    renameInput.onkeyup = (event) => {
      if (event.key === "Enter") {
        renameConfirmBtn.click();
      }
    };
  
    renameConfirmBtn.onclick = () => {
      renameModal.style.display = "none";
      const newName = renameInput.value.trim();
      if (newName) {
        const workspace = field.sourceBlock_.workspace;
        let variable = workspace.getVariable(newName);
        if (!variable) {
          variable = workspace.createVariable(newName);
        }
        field.setValue(variable.getId());
      }
    };
  
    renameCancelBtn.onclick = () => {
      renameModal.style.display = "none";
    };
  }
  
  const choiceModal = document.getElementById("variableChoiceModal");
  window.addEventListener('click', (event) => {
    if (event.target === choiceModal) {
      choiceModal.style.display = 'none';
    }
  });
  
  const existingModal = document.getElementById("existingVariablesModal");
  window.addEventListener('click', (event) => {
    if (event.target === existingModal) {
      existingModal.style.display = 'none';
    }
  });
  
  const renameModal = document.getElementById("renameVariableModal");
  window.addEventListener('click', (event) => {
    if (event.target === renameModal) {
      renameModal.style.display = 'none';
    }
  });

  // Expected code per level task used for hint button
  function getExpectedCodeForLevel(currentLevel, lessonStep) {
    let expectedCode = "";
    if (currentLevel === "tutorial"){
      expectedCode = "<strong><pre><code>" + 
                      "Example Code" + 
                      "</code></pre></strong>";
    } else if (currentLevel === "level_1") {

        if (lessonStep === 1) {
        expectedCode = "<strong><pre><code>" +
                       "myFavNum = 'your favorite number'" +
                       "</code></pre></strong>";
      } else if (lessonStep === 2) {
        expectedCode = "<strong><pre><code>" +
                       "amIExcited = True\n" +
                       "// or\n" +
                       "amIExcited = False" +
                       "</code></pre></strong>";
      } else if (lessonStep === 3) {
        expectedCode = "<strong><pre><code>" +
                       "anotherInt = 'any number'" +
                       "</code></pre></strong>";
      } else if (lessonStep === 4) {
        expectedCode = "<strong><pre><code>" +
                       "result = myFavNum + anotherInt" +
                       "</code></pre></strong>";
      } else if (lessonStep === 5) {
        expectedCode = "<strong><pre><code>" +
                       "any_variable_name = 'text'\n" +
                       "another_variable_name = 'text'\n" +
                       "result = any_variable_name + another_variable_name" +
                       "</code></pre></strong>";
      }
    } 
    
    else if (currentLevel === "level_2") {
      if (lessonStep === 0) {
        expectedCode = "<strong><pre><code>" +
                       "weather_is_clear = False\n" +
                       "if weather_is_clear == True:\n" +
                       "    print(\"It is safe to start your adventure\")" +
                       "</code></pre></strong>";
      } else if (lessonStep === 1) {
        expectedCode = "<strong><pre><code>" +
                       "dragon_is_near = False\n" +
                       "if dragon_is_near == True:\n" +
                       "    print(\"Run away!\")\n" +
                       "else:\n" +
                       "    print(\"Proceed on your adventure!\")" +
                       "</code></pre></strong>";
      } else if (lessonStep === 2) {
        expectedCode = "<strong><pre><code>" +
                       "has_boat = False\n" +
                       "has_rope = False\n" +
                       "if has_boat == True:\n" +
                       "    print(\"Row across the river!\")\n" +
                       "elif has_rope == True:\n" +
                       "    print(\"Swing across the river!\")\n" +
                       "else:\n" +
                       "    print(\"Find a shallow spot to walk through!\")" +
                       "</code></pre></strong>";
      } else if (lessonStep === 3) {
        expectedCode = "<strong><pre><code>" +
                       "goldenSwordCost = 500\n\n" +
                       "if treasureValue >= goldenSwordCost:\n" +
                       "    print(\"Great news! Go back and get that sword!\")\n" +
                       "else:\n" +
                       "    print(\"Keep looking for more treasure\")" +
                       "</code></pre></strong>";
      } else if (lessonStep === 4) {
        expectedCode = "<strong><pre><code>" +
                       "if found_creator == True and gold >= 20:\n" +
                       "    print(\"The creator offers to fix and upgrade the sword!\")\n" +
                       "elif found_creator == True and gold < 20:\n" +
                       "    print(\"The creator fixes the sword!\")\n" +
                       "else:\n" +
                       "    print(\"The adventurers keep looking for the creator!\")" +
                       "</code></pre></strong>";
      }
    } 
    
    else if (currentLevel === "level_3") {
      if (lessonStep === 1) {
        expectedCode = "<strong><pre><code>" +
                       "Loot = ['gold', 'ancient_key', 'healing_potion']" +
                       "</code></pre></strong>";
      } else if (lessonStep === 2) {
        expectedCode = "<strong><pre><code>" +
                       "for i in Loot:\n" +
                       "    if i == 'ancient_key':\n" +
                       "        print(\"Gate unlocked!\")" +
                       "</code></pre></strong>";
      } else if (lessonStep === 3) {
        expectedCode = "<strong><pre><code>" +
                       "doors = ['red_door', 'black_door', 'blue_door']\n" +
                       "for i in doors:\n" +
                       "    if i == 'red_door' or i == 'blue_door':\n" +
                       "        print(\"Don't go down there!\")\n" +
                       "    else:\n" +
                       "        print(\"You are safe to continue on your quest!\")" +
                       "</code></pre></strong>";
      } else if (lessonStep === 4) {
        expectedCode = "<strong><pre><code>" +
                       "trap_door_open = True\n" +
                       "while trap_door_open == False:\n" +
                       "    print(\"RUN!\")" +
                       "</code></pre></strong>";
      }
    } 
    
    else if (currentLevel === "level_4") {
      if (lessonStep === 0) {
        expectedCode = "<strong><pre><code>" +
                       "def begin_journey():\n" +
                       "    gear_ready = True\n" +
                       "    if gear_ready:\n" +
                       "        print(\"The journey begins!\")\n" +
                       "    else:\n" +
                       "        print(\"Get all your things together!\")" +
                       "</code></pre></strong>";
      } else if (lessonStep === 1) {
        expectedCode = "<strong><pre><code>" +
                       "def divide_treasure(total_gold, no_adventurers):\n" +
                       "    share_each = total_gold / no_adventurers\n" +
                       "    print(\"each adventurers share is \" + share_each)" +
                       "</code></pre></strong>";
      } else if (lessonStep === 2) {
        expectedCode = "<strong><pre><code>" +
                       "def build_machine(scrap, crystalsFound):\n" +
                       "    machine_power = 0\n" +
                       "    jetpack_ready = False\n" +
                       "    for crystalPower in crystalsFound:\n" +
                       "        machine_power += crystalPower\n" +
                       "    if machine_power > 100:\n" +
                       "        print(\"You've got enough power to fly the machine!\")\n" +
                       "        jetpack_ready = True\n" +
                       "return jetpack_ready" +
                       "</code></pre></strong>";
      } else if (lessonStep === 3) {
        expectedCode = "<strong><pre><code>" +
                       "def say_goodbye():\n" +
                       "    adventurers = [\"Name1\", \"Name2\", \"Name3\"]\n" +
                       "    i = 0\n" +
                       "    while i < len(adventurers) - 1:\n" +
                       "        print(adventurers[i] + \" says goodbye to the adventurers!\")\n" +
                       "        i += 1\n" +
                       "return adventurers[i]" +
                       "</code></pre></strong>";
      } else if (lessonStep === 4) {
        expectedCode = "<strong><pre><code>" +
                       "def guide_home():\n" +
                       "    made_it_home = False\n" +
                       "    checkpoints = [\"Forest\", \"River\", \"Village\", \"Home\"]\n" +
                       "    i = 0\n" +
                       "    while i < len(checkpoints):\n" +
                       "        print(\"Arrived at \" + checkpoints[i] + \"!\")\n" +
                       "        i += 1\n" +
                       "    made_it_home = True\n" +
                       "    print(\"Home at last!\")\n" +
                       "return made_it_home" +
                       "</code></pre></strong>";
      }
    }
    return expectedCode;
  }

  // Show hint dependant on level and lessonstep
  function showHintForLevel(currentLevel, lessonStep) {
    const expectedCode = getExpectedCodeForLevel(currentLevel, lessonStep);
    showModal("<p>Hint: Expected Code:</p>" + expectedCode, () => {});
  }

  

  
  
  


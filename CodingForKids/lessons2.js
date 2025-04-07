// Initialise variables to track level score and step
let lesson3Step = 0;  
let lesson4Step = 0;
let lesson3Score = 3;
let lesson4Score = 3;

// Show level 3 intro
function startLevel3() {
  // Clear any blocks in the workspace
  workspace.clear();
  overlay.style.display = "block";
  showLessonModal({
    heading: "Welcome to Level 3: Arrays and Loops!",
    description: `
      <p><strong>Hint: In this lesson you'll have to scroll down to find some blocks!</strong></p>
      <p>In this lesson you'll learn about <strong>arrays</strong> - which are what we call <strong>lists in programming that store items! You'll also learn different types of loops!</strong></p>
      <p>While continuing their quest, our adventurers stumble across a small hut, they go inside to search for any treasure!</p>
      <p>Your task is to create an array named <strong>Loot</strong> that contains three items: <strong>'gold', 'ancient_key', and 'healing potion'.</strong></p>
      <code><pre><strong>Loot = ['gold', 'ancient_key', 'healing_potion'];</code></strong></pre>
    `,
    img: House, 
    buttonText: "Start Task 1",
    onClose: function() {
      overlay.style.display = "none";
      lesson3Step = 1;
      startLevel3Task1();
    }
  });
}

// Start Task 1
function startLevel3Task1() {
  showTooltipNextToElement(
    "lists_create_with",
    "<strong>1.</strong> Add <strong>set 'Loot' to</strong> block first, then connect the <strong>array block</strong><br><br>" +
    "<strong>2.</strong> Add 3 <strong>'item'</strong> blocks: <br><strong>'gold'</strong>, <strong>'ancient_key'</strong>, <strong>'healing_potion'</strong>"
  );
}

// Check users blocks for Hut task
function checkHutTask() {
  // Get users blocks and convert them to code
  let userCode = Blockly.Python.workspaceToCode(workspace);

  // Remove any none values
  userCode = userCode.replace(/=\s*None/g, "");

  const lowerCode = userCode.toLowerCase();
  const hasChest = lowerCode.includes("loot");
  const hasSecretKey = lowerCode.includes("ancient_key") || lowerCode.includes("ancient key");
  const hasGold = lowerCode.includes("gold");
  const hasHealingPotion = lowerCode.includes("healing_potion") || lowerCode.includes("healing potion");

  if (hasChest && hasSecretKey && hasGold && hasHealingPotion) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Success! They found some valuable Loot!",
      description: `
        <p><strong>You created the Loot array to help the adventurers store the items they found!</strong></p>
        <p>The adventures leave the hut and continue on their journey exploring the forest, <strong>but wait... They see something huge in the distance, towering above the trees!</strong></p>
        <p>They walk towards the tower and see that it's actually a huge castle! They approach it and are confronted by a gate, but it is locked!</p>
        <p><strong>They remember they found a key earlier on, write a loop to help the adventurers find it!</strong></p>
        <p><strong>Hint: i represents each item in the loop:<strong></p>
        <pre><code><strong>for i in Loot:
    if i == 'ancient_key':
        print("Gate unlocked!")</pre></code></strong>
      `,
      img: Castle,
      buttonText: "Next",
      onClose: function() {
        overlay.style.display = "none";
        lesson3Step = 2;
        hideTutorialTooltip();
        startLevel3Task2();
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_3') {
      decrementScore("level_3");
    }
    showModal(
      "Unlucky! Try again. Try and use the below to help:" +
      "<strong><pre><code>" +
        "Loot = ['gold', 'ancient_key', 'healing_potion']" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start Task 2
function startLevel3Task2() {
  showTooltipNextToElement(
    "controls_forEach",
    "<strong>1.</strong> Add a <strong>'for each item i in list'</strong> block and connect it to <strong>Loot</strong><br><br>" +
    "<strong>2.</strong> Inside the loop, check <br><strong> if i = 'ancient_key'</strong><br><br>" +
    "<strong>3.</strong> Then, print <br><strong> 'Gate unlocked!'</strong>"
  );
}

// Check users answer for Castle Task
function checkCastleTask() {

  let userCode = Blockly.Python.workspaceToCode(workspace);
  userCode = userCode.replace(/=\s*None/g, "");

  const lowerCode = userCode.toLowerCase();

  const hasForLoop = lowerCode.includes("for") && lowerCode.includes("in loot");

  const hasAncientKeyCheck =
  lowerCode.includes("if i == ancient_key") ||
  lowerCode.includes("if item == ancient_key") ||
  lowerCode.includes("if item == 'ancient_key'") ||
  lowerCode.includes('if item == "ancient_key"') ||
  lowerCode.includes("if i == 'ancient_key'") ||
  lowerCode.includes('if i == "ancient_key"');

  const hasPrintUnlocked =
    lowerCode.includes('print("gate unlocked!")') ||
    lowerCode.includes("print('gate unlocked!')") ||
    lowerCode.includes('print("gate unlocked")') ||
    lowerCode.includes("print('gate unlocked')");

  if (hasForLoop && hasAncientKeyCheck && hasPrintUnlocked) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Door Unlocked! Enter the Castle!",
      description: `
        <p>You unlocked the gate and proved your skill with <strong>arrays and loops!</strong> Now our adventurers step into the amazing castle!</p>
        <p>In Level 2, you mastered the <strong>AND</strong> operator. Next, we'll learn about the <strong>OR</strong> operator—which means <strong>if at least one condition is true, the whole expression is true.</strong></p>
        <p><strong>When entering the castle, the adventurers are confronted by three mysterious doors! Two are trap doors (red and blue) while only the black door is safe.</strong> Write a <strong>loop with an OR condition</strong> to warn about the red and blue doors to guide them safely through the castle:</p>
        <strong><pre><code>doors = ['red_door', 'black_door', 'blue_door']
for i in doors:
    if i == 'red_door' or door == 'blue_door':
        print("Don't go down there!")
    else:
        print("You are safe to continue on your quest!")</code></pre></strong>
      `,
      img: padlock,
      buttonText: "Next",
      onClose: function() {
        workspace.clear();
        overlay.style.display = "none";
        lesson3Step = 3;
        hideTutorialTooltip();
        startLevel3Task3();
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_3') {
      decrementScore("level_3");
    }
    showModal(
      "It looks like your loop isn't correct. Make sure you loop over 'Loot', check for 'ancient_key' and print 'Gate unlocked!'" +
      "<strong><pre><code>" +
        "for i in Loot:\n" +
        "    if i == 'ancient_key':\n" +
        "        print(\"Gate unlocked!\")" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start Task 3
function startLevel3Task3() {
  showTooltipNextToElement(
    "controls_forEach",
    "<strong>1.</strong> Create an <strong>array 'doors'</strong> with: <strong>'red_door'</strong>, <strong>'black_door'</strong>, <strong>'blue_door'</strong><br><br>" +
    "<strong>2.</strong> Add <strong>'for each item i in list'</strong> and connect <strong>doors</strong><br><br>" +
    "<strong>3.</strong> Inside loop, check <strong>if i = 'red_door' OR i = 'blue_door'</strong><br><br>" +
    "<strong>4.</strong> If true, print <strong>'Don't go down there!'</strong><br>" +
    "Else, print <strong>'You are safe to continue on your quest!'</strong>"
  );
}

// Check user answer for Door Task
function checkDoorTask() {

  let userCode = Blockly.Python.workspaceToCode(workspace);
  userCode = userCode.replace(/=\s*None/g, "");

  const lowerCode = userCode.toLowerCase();

  const hasDoorsArray = lowerCode.includes("doors") &&
                        lowerCode.includes("red_door") &&
                        lowerCode.includes("black_door") &&
                        lowerCode.includes("blue_door");

  const hasForLoop = lowerCode.includes("for") && lowerCode.includes("in doors");

  const hasOrCondition = lowerCode.includes("or") &&
                         lowerCode.includes("red_door") &&
                         lowerCode.includes("blue_door");

  const hasSafePrint = lowerCode.includes("print") &&
                       (lowerCode.includes("you are safe") || lowerCode.includes("safe to continue"));

  const hasTrapPrint = lowerCode.includes("print") &&
                       (lowerCode.includes("dont go down there") || lowerCode.includes("don't go down there"));

  if (hasDoorsArray && hasForLoop && hasOrCondition && hasSafePrint && hasTrapPrint) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Close call! You kept the adventurers safe!",
      description: `
        <p>Excellent work! You used a <strong>loop</strong> and an <strong>OR condition</strong> to warn them about the dangerous doors!</p>
        <p><strong>Now, as they try to leave the castle, a trap door opens a massive hole in the floor! They must time their escape perfectly!</strong></p>
        <p>This is a perfect time to introduce <strong>while loops. The loop runs as long as its condition is true.</strong></p>
        <p>For example, <strong>if the trap door is open (True)</strong>, they can’t run. But if you check for <strong>while trap_door_open == False</strong>, then <strong>as soon as the door is closed (False</strong>), they can run!</p>
        <strong><pre><code>trap_door_open = True
  while trap_door_open == False:
      print("RUN!")</code></pre></strong>
      `,
      img: doorSafe, 
      buttonText: "Next",
      onClose: function() {
        workspace.clear();
        overlay.style.display = "none";
        lesson3Step = 4;
        hideTutorialTooltip();
        startLevel3Task4(); 
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_3') {
      decrementScore("level_3");
    }
    showModal(
      "It looks like your code isn't quite right. Make sure you:" +
      "<strong><pre><code>" +
        "doors = ['red_door', 'black_door', 'blue_door']\n" +
        "for i in doors:\n" +
        "    if i == 'red_door' OR i == 'blue_door':\n" +
        "        print(\"Don't go down there!\")\n" +
        "    else:\n" +
        "        print(\"You are safe to continue on your quest!\")\n" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start Task 4
function startLevel3Task4() {
  showTooltipNextToElement(
    "controls_whileUntil", 
    "<strong>1.</strong> Set <strong>trap_door_open = true</strong><br><br>" +
    "<strong>2.</strong> Add <strong>'repeat while' loop</strong><br><br>" +
    "<strong>3.</strong> Set condition: <strong>repeat while trap_door_open = false</strong><br><br>" +
    "<strong>4.</strong> Inside the loop, print <strong>'RUN!'</strong>"
  );
}

// Check users code for Trap Task
function checkTrapTask() {
  let userCode = Blockly.Python.workspaceToCode(workspace);
  userCode = userCode.replace(/=\s*None/g, "");

  const lowerCode = userCode.toLowerCase();

  const hasTrapDoorDeclaration = lowerCode.includes("trap_door_open") && lowerCode.includes("true");

  const hasWhileLoop = lowerCode.includes("while") &&
                       lowerCode.includes("trap_door_open") &&
                       lowerCode.includes("== false");

  const hasRunPrint = lowerCode.includes("print") && lowerCode.includes("run");

  if (hasTrapDoorDeclaration && hasWhileLoop && hasRunPrint) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Amazing! They couldn't have done it without you!",
      description: `
        <p><strong>Great work! Your while loop helped the adventurers time when the trap door was closed, and allowed them to escape!</strong></p>
        <p><strong>You've now mastered arrays and loops!</strong> You learned how to <strong>create arrays to store valuable items</strong>, use <strong>for loops (with OR conditions)</strong> to navigate through dangerous challenges, and even <strong>implemented a while loop to time your escape perfectly!</strong></p>
        <p><strong>Well done on finishing Level 3: Arrays and Loops! Keep up the amazing work!</strong></p>
      `,
      img: successPenguin,
      score: lesson3Score,
      buttonText: "Finish Lesson",
      onClose: function() {
        // On close, update user score and progress
        overlay.style.display = "none";
        fetch("/update-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level: "level_3", score: lesson3Score })
        })
        .then(response => response.json())
        .then(data => {
          // Navigate back to gameLobby
          window.location.href = "/gameLobby";
          sessionStorage.setItem("level3Completed", "true");
        })
        .catch(error => console.error("Error updating progress:", error));
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_3') {
      decrementScore("level_3");
    }
    showModal(
      "Your code doesn't seem to be quite right. Double-check you have:" +
      "<strong><pre><code>" +
        "trap_door_open = True\n" +
        "while trap_door_open == False:\n" +
        "    print(\"RUN!\")\n" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start level 4
function startLevel4() {
  overlay.style.display = "block";
  showLessonModal({
    heading: "Welcome to Level 4: Functions!",
    description: `
      <p><strong>Hint: In this lesson you'll have to scroll down to find some blocks!</strong></p>
      <p><strong>In this level, you'll wrap up everything you've learned so far</strong> while also introducing one of the most important concepts in programming - <strong>Functions</strong></p>
      <p><strong>A function is like a container that holds code to do a specific task. Then you can call that function to reuse it whenever you want. Kind of like writing a recipe down on a piece of paper!</strong></p>
      <p>In this task, you'll creat the function <strong>begin_journey()</strong> to check if the adventuers are ready to begin their journey home!</p>
      <strong><pre><code>def begin_journey():
  gear_ready = True
  if gear_ready:
      print("The journey begins!")
  else:
      print("Get all your things together!")</code></pre></strong>
      <p><strong>Tip: This shows if a variable already equals True, you dont need to write if gear_ready = True</strong></p>
    `,
    img: adventureStart,
    buttonText: "Start Task 1",
    onClose: function() {
      overlay.style.display = "none";
      startLevel4Task1();
    }
  });
}

// Check Task 1
function startLevel4Task1() {
  showTooltipNextToElement(
    "procedures_defnoreturn",
    "<strong>1.</strong> Add a <strong>function</strong> block and rename to <strong>begin_journey</strong><br><br>" +
    "<strong>2.</strong> Inside it, set <strong>gear_ready = true</strong><br><br>" +
    "<strong>3.</strong> In the if condition, add <strong>if gear_ready</strong><br><br>" +
    "<strong>4.</strong> In the <strong>if</strong>: <br> print <strong>'The journey begins!'</strong><br><br>" +
    "<strong>5.</strong> In the <strong>else</strong>: <br> print <strong>'Get all your things together!'</strong>"
  );
}

// Check Begin Journey Task
function checkBeginJourneyTask() {
  let userCode = Blockly.Python.workspaceToCode(workspace);
  userCode = userCode.replace(/=\s*None/g, "").trim();
  
  const lowerCode = userCode.toLowerCase();
  
  function normalize(text) {
    return text.replace(/[^\w\s]/g, "").toLowerCase();
  }
  
  const normalisedCode = normalize(lowerCode);

  
  const hasBeginJourney = lowerCode.includes("def begin_journey");
  const hasGearReadyAssignment = lowerCode.includes("gear_ready = true");
  const hasIfGearReady = lowerCode.includes("if gear_ready");
  const hasPrintJourney = normalisedCode.includes("printthe journey begins");
  const hasPrintNotAllGear = normalisedCode.includes("printget all your things together");
  

  if (hasBeginJourney && hasGearReadyAssignment && hasIfGearReady && hasPrintJourney && hasPrintNotAllGear) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Excellent! Your plan is set!",
      description: `
        <p>In the next task we'll look at <strong>functions with parametres</strong> and <strong>explore some new concepts we've not yet looked at!</strong></p>
        <p><strong>On their journey home, the adventurers discover a secret underground cave filled with glowing crystals and a lot of gold! They decide to split the treasure evenly but they need help splitting it... thats where you come in!</strong></p>
        <p>Try making a function <strong>divide_treasure()</strong> that <strong>takes in the amount of gold and the number of adventurers... then splits it and prints out the number each adventurer gets! For example:</strong></p>
        <strong><pre><code>def divide_treasure(total_gold, no_adventurers):
  share_each = total_gold / no_adventurers
  print("each adventurers share is " + share_each)</code></pre></strong>
      `,
      img: mathDuckGuy,  
      buttonText: "Next",
      onClose: function() {
        workspace.clear();
        overlay.style.display = "none";
        lesson4Step = 1;
        hideTutorialTooltip();
        createBlocklyWorkspace();
        startLevel4Task2();  
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_4') {
      decrementScore("level_4");
    }
    showModal(
      "Your code isn't set up correctly. Make sure you:" +
      "<strong><pre><code>" +
        "gear_ready = True\n\n" +
        "def begin_journey():\n" +
        "    if gear_ready:\n" +
        "        print(\"The journey begins!\")" +
        "    else:" + 
        "        print(\"Get all your things together!\")" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start Task 2
function startLevel4Task2() {
  showTooltipNextToElement(
    "procedures_defnoreturn",
    "<strong>1.</strong> Add a <strong>function</strong> block, name it <strong>divide_treasure</strong>, and add parameters <strong>total_gold</strong> and <strong>no_adventurers</strong> (use gear icon)<br><br>" +
    "<strong>2.</strong> Inside it, set <strong>share_each = total_gold ÷ no_adventurers</strong><br><br>" +
    "<strong>3.</strong> Add <strong>print</strong> block and connect <strong>'create text with'</strong><br><br>" +
    "<strong>4.</strong> Use this to make: <br><strong> 'each adventurer’s share is '</strong> + <strong>share_each</strong>"
  );
}


// Check user code for divide treasure task
function checkDivideTreasureTask() {
  let userCode = Blockly.Python.workspaceToCode(workspace);
  // Remove any None assignments
  userCode = userCode.replace(/=\s*None/g, "").trim();
  
  const lowerCode = userCode.toLowerCase();
  const hasFunctionDef = lowerCode.includes("def divide_treasure(total_gold, no_adventurers):");
  
  const hasDivision = lowerCode.includes("share_each = total_gold / no_adventurers");
  
  function normalize(text) {
    return text.replace(/[^\w\s]/g, "").toLowerCase();
  }
  const normalisedCode = normalize(lowerCode);
  
  const hasPrintConcatenation = normalisedCode.includes("printeach adventurers share is") &&
                                normalisedCode.includes("strshare_each");
  
  if (hasFunctionDef && hasDivision && hasPrintConcatenation) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Excellent! You helped divide the treasure evenly!",
      description: `
      <p><strong>You've mastered basic functions, and now you'll see that functions can also return values!</strong></p>
      <p><strong>As the adventurers continue their journey home, they stumble upon a huge cliff they cannot climb!</strong> Then, one of them has a wild idea: <strong>use the scrap metal and the glowing crystals they found in the cave to build a machine that will help them!</strong></p>
      <p><strong>In the next task, define a function called build_machine(scrap, crystalsFound) that uses a loop that calculates whether they can build the machine!</strong></p>
      <p>For example, your code should look like this:</p>
      <strong><pre><code>def build_machine(scrap, crystalsFound):
  machine_power = 0
  jetpack_ready = False
  for crystalPower in crystalsFound:
      machine_power = machine_power + crystalPower
  if machine_power > 100:
      print("You've got enough power to fly the machine!")
      jetpack_ready = True
return jetpack_ready</code></pre></strong>
        `,
      img: penguinInGold,  
      buttonText: "Next",
      onClose: function() {
        workspace.clear();
        overlay.style.display = "none";
        lesson4Step = 2;
        createBlocklyWorkspace();
        hideTutorialTooltip();
        startLevel4Task3(); 
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_4') {
      decrementScore("level_4");
    }
    showModal(
      "Your code isn't set up correctly. Ensure you:" +
      "<strong><pre><code>" +
        "def divide_treasure(total_gold, no_adventurers):\n" +
        "    share_each = total_gold / no_adventurers\n" +
        "    print(\"each adventurers share is \" + str(share_each))" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start Task 3
function startLevel4Task3() {
  showTooltipNextToElement(
    "procedures_defreturn",
    "<strong>1.</strong> Add <strong>function</strong> block, name it <strong>build_machine</strong> with parameters <strong>scrap</strong> and <strong>crystalsFound</strong><br><br>" +
    "<strong>2.</strong> Inside it, set <strong>machine_power = 0</strong> and <strong>jetpack_ready = false</strong><br><br>" +
    "<strong>3.</strong> Add a <strong>for each</strong> loop, change it to <strong> for each item crystalPower in list crystalsFound</strong><br><br>" +
    "Inside loop: <br><strong>machine_power = machine_power + crystalPower</strong><br><br>" +
    "<strong>4.</strong> Outside loop, add <br><strong>if machine_power > 100</strong><br>" +
    "→ Print <strong>'You've got enough power to fly the machine!'</strong><br>" +
    "→ Set <strong>jetpack_ready = true</strong><br><br>" +
    "<strong>5.</strong> Return <strong>jetpack_ready</strong>"
  );
}


// Check Build Machine Task
function checkBuildMachineTask() {
  let userCode = Blockly.Python.workspaceToCode(workspace);

  userCode = userCode.replace(/=\s*None/g, "").trim();
  
  const lowerCode = userCode.toLowerCase();

  function normalize(text) {
    return text.replace(/[^\w\s]/g, "").toLowerCase();
  }
  const normalisedCode = normalize(lowerCode);
  
  const hasFunctionDef = lowerCode.includes("def build_machine(") &&
                         lowerCode.includes("scrap") &&
                         lowerCode.includes("crystalsfound");
  
  const hasMachinePowerInit = lowerCode.includes("machine_power = 0");
  const hasJetpackReadyInit = lowerCode.includes("jetpack_ready = false");
  const hasForLoop = lowerCode.includes("for") && lowerCode.includes("in crystalsfound");
  const hasAddition = lowerCode.includes("machine_power = machine_power +");
  const hasIfCheck = lowerCode.includes("if machine_power > 100");
  
  const hasPrintMessage = normalisedCode.includes("printyouve got enough power to fly the machine");
  const hasReturnTrue = normalisedCode.includes("return jetpack_ready");
  
  if (hasFunctionDef && hasMachinePowerInit && hasJetpackReadyInit && hasForLoop && hasAddition && hasIfCheck && hasPrintMessage && hasReturnTrue) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "They made it! Thanks to you!",
      description: `
        <p><strong>After overcoming countless challenges together, our brave team now finds themselves at a bittersweet crossroads. Full of memories and gratitude for the journey shared, two of our adventurers are forced to part ways, leaving the final hero to continue the quest home...</strong></p>
        <p><strong>Note on Arrays: In an array, the first item is at index 0, not 1. This means that if you have an array with 3 names, they are at positions 0, 1, and 2 respectively.</strong></p>
        <p>Now, it's time to say goodbye. <strong>Create a function say_goodbye() which loops through an array to print farewell messages for each adventurer except the last...</strong></p>
        <p>For example, your code should look like this:</p>
        <strong><pre><code>def say_goodbye():
  adventurers = ["Name1", "Name2", "Name3"]
  i = 0
  while i &lt; len(adventurers) - 1:
      print(adventurers[i] + " says goodbye to the adventurers!")
      i += 1
return adventurers[i]</code></pre></strong>
      `,
      img: Jetpack,  
      buttonText: "Next",
      onClose: function() {
        workspace.clear();
        overlay.style.display = "none";
        lesson4Step = 3;
        createBlocklyWorkspace();
        hideTutorialTooltip();
        startLevel4Task4();  
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_4') {
      decrementScore("level_4");
    }
    showModal(
      "Your code isn't set up correctly. Make sure you do the following:" +
      "<strong><pre><code>" +
        "def build_machine(scrap, crystalsFound):\n" +
        "    machine_power = 0\n" +
        "    jetpack_ready = False\n" +
        "    for crystal in crystalsFound:\n" +
        "        machine_power += crystal\n" +
        "    if machine_power > 100:\n" +
        "        print(\"You've got enough power to fly the machine!\")\n" +
        "        jetpack_ready = True\n" +
        "return jetpack_ready" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start Task 4
function startLevel4Task4() {
  showTooltipNextToElement(
    "procedures_defreturn",
    "<strong>1.</strong> Create a <strong>function</strong> named <strong>say_goodbye</strong><br><br>" +
    "<strong>2.</strong> Inside, create an <strong>array 'adventurers'</strong> with 3 names using the <strong>text block</strong><br><br>" +
    "<strong>3.</strong> Set <strong>index = 0</strong>, then add a <strong>while loop</strong> with condition:<br>" +
    "<strong>index &lt; length(adventurers) - 1</strong> (use <strong>=</strong> and <strong>math block</strong>)<br><br>" +
    "<strong>4.</strong> Inside loop:<br>" +
    "• Use <strong>text join</strong> + <strong>'in list adventurers get # index'</strong><br>" +
    "→ <strong>'Name' says goodbye to the adventurers!'</strong><br>" +
    "• Then set <strong>index = index + 1</strong><br><br>" +
    "<strong>5.</strong> Return the final name using <strong>'in list adventurers get # index'</strong>"
  );
}


// Check Say Goodbye Task
function checkSayGoodbyeTask() {
  let userCode = Blockly.Python.workspaceToCode(workspace);
  userCode = userCode.replace(/=\s*None/g, "").trim();
  
  const lowerCode = userCode.toLowerCase();
  
  function normalize(text) {
    return text.replace(/[^\w\s]/g, "").toLowerCase();
  }
  const normalisedCode = normalize(lowerCode);
  
  const hasFunctionDef = lowerCode.includes("def say_goodbye(");
  const hasAdventurersArray = lowerCode.includes("adventurers") && lowerCode.includes("[") && lowerCode.includes("]");
  const threeNamesMatch = (lowerCode.match(/["'][^"']+["']/g) || []).length >= 3;
  
  const hasWhileLoop = lowerCode.includes("while") && lowerCode.includes("len(adventurers)") && lowerCode.includes("- 1");
  
  const hasFarewellPrint = normalisedCode.includes("says goodbye to the adventurers");
  
  const hasReturnStatement = lowerCode.includes("return");

  if (hasFunctionDef && hasAdventurersArray && threeNamesMatch && hasWhileLoop && hasFarewellPrint && hasReturnStatement) {
    overlay.style.display = "block";
    workspace.clear();
    showLessonModal({
      heading: "Great Work! The Friends bid their Final Farewell",
      description: `
        <p><strong>After facing countless challenges, sharing moments of joy and tears, and overcoming every obstacle together, our adventurers come together for one last embrace!</strong></p>
        <p><strong>They look to you with gratitude, knowing that you were the guiding light that helped them conquer their fears and grow along the way!</strong></p>
        <p><strong>Thank you for being their hero in this grand adventure!</strong></p>
        <p><strong>However as grateful as they are for your help, you're not quite finished yet!</strong></p>
        <p><strong>Your final task is to help the final remaining adventurer home:</strong></p>
        <strong><pre><code>def guide_home():
  made_it_home = False
  checkpoints = ["Forest", "River", "Village", "Home"]
  i = 0
  while i < len(checkpoints):
      print("Arrived at " + checkpoints[i])
      i = i + 1
  made_it_home = True
  print("Home at last!")
return made_it_home</code></pre></strong>
  `,
      img: Farewell,
      buttonText: "Next",
      onClose: function() {
        overlay.style.display = "none";
        lesson4Step = 4;
        createBlocklyWorkspace();
        startLevel4Task5();
      }
    }); 
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_4') {
      decrementScore("level_4");
    }
    showModal(
      "Your code isn't set up correctly. Ensure you:" +
      "<strong><pre><code>" +
        "def say_goodbye():\n" +
        "    adventurers = [\"Name1\", \"Name2\", \"Name3\"]\n" +
        "    index = 0\n" +
        "    while index < len(adventurers) - 1:\n" +
        "        print(adventurers[index] + \"Says goodbye to the adventurers\")\n" +
        "        index = index + 1\n" +
        "return adventurers[index]" +
      "</code></pre></strong>",
      () => {}
    );
  }
}

// Start Task 5
function startLevel4Task5() {
  showTooltipNextToElement(
    "procedures_defreturn",
    "<strong>1.</strong> Create <strong>function</strong> <strong>guide_home</strong><br><br>" +
    "<strong>2.</strong> Inside: <br>set <strong>made_it_home = false</strong> and create <strong>array 'checkpoints'</strong> with:<br>" +
    "<strong>[\"Forest\", \"River\", \"Village\", \"Home\"]</strong> (use gear icon to add items)<br><br>" +
    "<strong>3.</strong> Set <strong>i = 0</strong> and add a <strong>while loop</strong> with condition:<br>" +
    "<strong>i &lt; length(checkpoints)</strong><br><br>" +
    "<strong>4.</strong> Inside loop:<br>" +
    "• Use <strong>text join</strong> + <strong>'in list checkpoints get # i'</strong><br>" +
    "→ Print <strong>'Arrived at ' + in list checkpoints get # i</strong><br>" +
    "• Then do <strong>i = i + 1</strong><br><br>" +
    "<strong>5.</strong> Outside loop:<br>" +
    "• Set <strong>made_it_home = true</strong><br>" +
    "• Print <strong>'Home at last!'</strong><br>" +
    "• Return <strong>made_it_home</strong>"
  );
}

// Check user answer for final Guide Home Task
function checkGuideHomeTask() {
  let userCode = Blockly.Python.workspaceToCode(workspace).replace(/=\s*None/g, "").trim();
  const lowerCode = userCode.toLowerCase();

  const hasFunctionDef = lowerCode.includes("def guide_home(");
  const hasMadeItHomeInit = lowerCode.includes("made_it_home = false");
  const hasCheckpoints = lowerCode.includes("checkpoints") && lowerCode.includes("forest") && lowerCode.includes("home");
  const hasWhileLoop = lowerCode.includes("while") && lowerCode.includes("len(checkpoints)");
  const hasPrintArrived = lowerCode.includes("print") && lowerCode.includes("arrived at") && lowerCode.includes("checkpoints");
  const hasIncrement = lowerCode.includes("i = i + 1") || lowerCode.includes("i += 1");
  const hasMadeItHomeSet = lowerCode.includes("made_it_home = true");
  const hasPrintHome = lowerCode.includes("print") && lowerCode.includes("home at last");
  const hasReturn = lowerCode.includes("return made_it_home");

  if (hasFunctionDef && hasMadeItHomeInit && hasCheckpoints && hasWhileLoop &&
      hasPrintArrived && hasIncrement && hasMadeItHomeSet && hasPrintHome && hasReturn) {
    overlay.style.display = "block";
    showLessonModal({
      heading: "Journey Complete! Thank you for your help!",
      description: `
        <p>Outstanding work! You have helped the final adventurer return home, where he now rests in peace with his family!</p>
        <p><strong>He will always cherish the memories made along the way and will never forget your invaluable help.</strong></p>
        <p><strong>Thank you for playing and for being such a dedicated hero. I hope you had fun and learned a lot about programming along the journey!</strong></p>
        <p><strong>Try out the Free Play and Quiz levels to test what you have learned!</strong>
      `,
      img: HomeFinish,
      score: lesson4Score,
      buttonText: "Finish Lesson",
      onClose: function() {
        // On close, update user score and progress
        overlay.style.display = "none";
        fetch("/update-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level: "level_4", score: lesson4Score })
        })
        .then(response => response.json())
        .then(data => {
          // Navigate back to gameLobby
          window.location.href = "/gameLobby";
          sessionStorage.setItem("level4Completed", "true");
        })
        .catch(error => console.error("Error updating progress:", error));
      }
    });
  } else {
    // Handle incorrect answer and decrement score
    if (currentLevel === 'level_4') {
      decrementScore("level_4");
    }
    showModal(
      "Your code isn't set up correctly. Ensure you:" +
      "<strong><pre><code>" +
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
      "</code></pre></strong>",
      () => {}
    );
  }
}












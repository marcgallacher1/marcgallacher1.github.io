// Fallback in case Blockly.Xml.textToDom doesn't exist
if (typeof Blockly.Xml.textToDom !== 'function') {
    Blockly.Xml.textToDom = function(xmlText) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      return xmlDoc.documentElement;
    };
  }
  
  // Load pre-loaded solutions with XML, dependant on the lesson step
  function loadSolutionLevel1(step) {
    switch (step) {
      case 1:
        // Task 1: Set myFavNum to a number
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="variables_set" x="20" y="20">
          <field name="VAR">myFavNum</field>
          <value name="VALUE">
            <block type="math_number">
              <field name="NUM">55</field>
            </block>
          </value>
        </block>
       </xml>
      `);
        break;
      case 2:
        // Task 2: Set amIExcited to True or False
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="variables_set" x="20" y="20">
            <field name="VAR">amIExcited</field>
            <value name="VALUE">
              <block type="logic_boolean">
                <field name="BOOL">TRUE</field>
              </block>
            </value>
          </block>
        </xml>
        `);
        break;
      case 3:
        // Task 3: Set secondInteger to a number
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="variables_set" x="20" y="20">
          <field name="VAR">secondInteger</field>
          <value name="VALUE">
            <block type="math_number">
              <field name="NUM">32</field>
            </block>
          </value>
        </block>
       </xml>
        `);
        break;
      case 4:
        // Task 4: Add secondInteger and myFavNum, store in result
        loadXMLSolution(`
            <xml xmlns="https://developers.google.com/blockly/xml">
              <block type="variables_set" x="20" y="20">
                <field name="VAR">secondInteger</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">32</field>
                  </block>
                </value>
                <next>
                  <block type="variables_set">
                    <field name="VAR">myFavNum</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">55</field>
                      </block>
                    </value>
                    <next>
                      <block type="variables_set">
                        <field name="VAR">result</field>
                        <value name="VALUE">
                          <block type="math_arithmetic">
                            <field name="OP">ADD</field>
                            <value name="A">
                              <block type="variables_get">
                                <field name="VAR">secondInteger</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="variables_get">
                                <field name="VAR">myFavNum</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </xml>
          `);
        break;
      case 5:
        // Task 5: Concatenate firstString and secondString into result
        loadXMLSolution(`
            <xml xmlns="https://developers.google.com/blockly/xml">
              <block type="variables_set" x="20" y="20">
                <field name="VAR">firstString</field>
                <value name="VALUE">
                  <block type="text">
                    <field name="TEXT">hello</field>
                  </block>
                </value>
                <next>
                  <block type="variables_set">
                    <field name="VAR">secondString</field>
                    <value name="VALUE">
                      <block type="text">
                        <field name="TEXT">World</field>
                      </block>
                    </value>
                    <next>
                      <block type="variables_set">
                        <field name="VAR">result</field>
                        <value name="VALUE">
                          <block type="math_arithmetic">
                            <field name="OP">ADD</field>
                            <value name="A">
                              <block type="variables_get">
                                <field name="VAR">firstString</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="variables_get">
                                <field name="VAR">secondString</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </xml>
          `);
        break;
      default:
        // If step doesn't match any case
        console.error("No solution available for Level 1 step", step);
    }
  }
  
  // Load pre-loaded solutions with XML, dependant on the lesson step
  function loadSolutionLevel2(step) {
    switch (step) {
      case 0:
        // Task 0 (Weather Task)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="variables_set" x="20" y="20">
            <field name="VAR">weather_is_clear</field>
            <value name="VALUE">
              <block type="logic_boolean">
                <field name="BOOL">FALSE</field>
              </block>
            </value>
            <next>
              <block type="controls_if">
                <mutation else="0"></mutation>
                <value name="IF0">
                  <block type="logic_compare">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR">weather_is_clear</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="logic_boolean">
                        <field name="BOOL">TRUE</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO0">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">It is safe to start your adventure!</field>
                      </block>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </xml>
        `);
        break;
      case 1:
        // Task 1 (Dragon Task)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="variables_set" x="20" y="20">
            <field name="VAR">dragon_is_near</field>
            <value name="VALUE">
              <block type="logic_boolean">
                <field name="BOOL">FALSE</field>
              </block>
            </value>
            <next>
              <block type="controls_if">
                <mutation else="1"></mutation>
                <value name="IF0">
                  <block type="logic_compare">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR">dragon_is_near</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="logic_boolean">
                        <field name="BOOL">TRUE</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO0">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">Run away!</field>
                      </block>
                    </value>
                  </block>
                </statement>
                <statement name="ELSE">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">Proceed on your adventure!</field>
                      </block>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </xml>
        `);
        break;
      case 2:
        // Task 2 (River Task)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="variables_set" x="20" y="20">
            <field name="VAR">has_boat</field>
            <value name="VALUE">
              <block type="logic_boolean">
                <field name="BOOL">FALSE</field>
              </block>
            </value>
            <next>
              <block type="variables_set">
                <field name="VAR">has_rope</field>
                <value name="VALUE">
                  <block type="logic_boolean">
                    <field name="BOOL">FALSE</field>
                  </block>
                </value>
                <next>
                  <block type="controls_if">
                    <mutation elseif="1" else="1"></mutation>
                    <value name="IF0">
                      <block type="logic_compare">
                        <field name="OP">EQ</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR">has_boat</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="logic_boolean">
                            <field name="BOOL">TRUE</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <statement name="DO0">
                      <block type="text_print">
                        <value name="TEXT">
                          <block type="text">
                            <field name="TEXT">Row across the river!</field>
                          </block>
                        </value>
                      </block>
                    </statement>
                    <value name="IF1">
                      <block type="logic_compare">
                        <field name="OP">EQ</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR">has_rope</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="logic_boolean">
                            <field name="BOOL">TRUE</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <statement name="DO1">
                      <block type="text_print">
                        <value name="TEXT">
                          <block type="text">
                            <field name="TEXT">Swing across the river!</field>
                          </block>
                        </value>
                      </block>
                    </statement>
                    <statement name="ELSE">
                      <block type="text_print">
                        <value name="TEXT">
                          <block type="text">
                            <field name="TEXT">Find a shallow spot to walk through!</field>
                          </block>
                        </value>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>
        `);
        break;
      case 3:
        // Task 3 (Sword Task)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="variables_set" x="20" y="20">
            <field name="VAR">goldenSwordCost</field>
            <value name="VALUE">
              <block type="math_number">
                <field name="NUM">500</field>
              </block>
            </value>
            <next>
              <block type="controls_if">
                <mutation else="1"></mutation>
                <value name="IF0">
                  <block type="logic_compare">
                    <field name="OP">GTE</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR">treasureValue</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="variables_get">
                        <field name="VAR">goldenSwordCost</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO0">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">Go back and get that sword!</field>
                      </block>
                    </value>
                  </block>
                </statement>
                <statement name="ELSE">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">Keep looking for more treasure!</field>
                      </block>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </xml>
        `);
        break;
      case 4:
        // Task 4 (Creator Task)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="variables_set" x="20" y="20">
            <field name="VAR">found_creator</field>
            <value name="VALUE">
              <block type="logic_boolean">
                <field name="BOOL">FALSE</field>
              </block>
            </value>
            <next>
              <block type="controls_if">
                <mutation elseif="1" else="1"></mutation>
                <!-- IF: found_creator = True AND gold >= 20 -->
                <value name="IF0">
                  <block type="logic_operation">
                    <field name="OP">AND</field>
                    <value name="A">
                      <block type="logic_compare">
                        <field name="OP">EQ</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR">found_creator</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="logic_boolean">
                            <field name="BOOL">TRUE</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <value name="B">
                      <block type="logic_compare">
                        <field name="OP">GTE</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR">gold</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="math_number">
                            <field name="NUM">20</field>
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
                        <field name="TEXT">The creator offers to fix and upgrade the sword!</field>
                      </block>
                    </value>
                  </block>
                </statement>
                <!-- ELSE-IF: found_creator = True and gold < 20 -->
                <value name="IF1">
                  <block type="logic_operation">
                    <field name="OP">AND</field>
                    <value name="A">
                      <block type="logic_compare">
                        <field name="OP">EQ</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR">found_creator</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="logic_boolean">
                            <field name="BOOL">TRUE</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <value name="B">
                      <block type="logic_compare">
                        <field name="OP">LT</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR">gold</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="math_number">
                            <field name="NUM">20</field>
                          </block>
                        </value>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO1">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">The creator fixes the sword!</field>
                      </block>
                    </value>
                  </block>
                </statement>
                <!-- ELSE -->
                <statement name="ELSE">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">The adventurers keep looking for the creator!</field>
                      </block>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </xml>
        `);
        break;
      default:
        // If step number doesn't match anything
        console.error("No solution available for Level 2 step", step);
    }
  }

  // Load pre-loaded solutions with XML, dependant on the lesson step
  function loadSolutionLevel3(step) {
    switch (step) {
        case 1:
            // Task 1 (Loot List)
            loadXMLSolution(`
            <xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" x="20" y="20">
                <field name="VAR">Loot</field>
                <value name="VALUE">
                    <block type="lists_create_with">
                    <mutation items="3"></mutation>
                    <value name="ADD0">
                        <block type="variables_get">
                        <field name="VAR">gold</field>
                        </block>
                    </value>
                    <value name="ADD1">
                        <block type="variables_get">
                        <field name="VAR">ancient_key</field>
                        </block>
                    </value>
                    <value name="ADD2">
                        <block type="variables_get">
                        <field name="VAR">healing_potion</field>
                        </block>
                    </value>
                    </block>
                </value>
                </block>
            </xml>
            `);
            break;
        case 2:
            // Task 2 (Check for ancient_key)
            loadXMLSolution(`
            <xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" x="20" y="20">
                <field name="VAR">Loot</field>
                <value name="VALUE">
                    <block type="lists_create_with">
                    <mutation items="3"></mutation>
                    <value name="ADD0">
                        <block type="variables_get">
                        <field name="VAR">gold</field>
                        </block>
                    </value>
                    <value name="ADD1">
                        <block type="variables_get">
                        <field name="VAR">ancient_key</field>
                        </block>
                    </value>
                    <value name="ADD2">
                        <block type="variables_get">
                        <field name="VAR">healing_potion</field>
                        </block>
                    </value>
                    </block>
                </value>
                <next>
                    <block type="controls_forEach" x="20" y="150">
                    <field name="VAR">i</field>
                    <value name="LIST">
                        <block type="variables_get">
                        <field name="VAR">Loot</field>
                        </block>
                    </value>
                    <statement name="DO">
                        <block type="controls_if">
                        <mutation else="0"></mutation>
                        <value name="IF0">
                            <block type="logic_compare">
                            <field name="OP">EQ</field>
                            <value name="A">
                                <block type="variables_get">
                                <field name="VAR">i</field>
                                </block>
                            </value>
                            <value name="B">
                                <block type="variables_get">
                                <field name="VAR">ancient_key</field>
                                </block>
                            </value>
                            </block>
                        </value>
                        <statement name="DO0">
                            <block type="text_print">
                            <value name="TEXT">
                                <block type="text">
                                <field name="TEXT">Gate unlocked!</field>
                                </block>
                            </value>
                            </block>
                        </statement>
                        </block>
                    </statement>
                    </block>
                </next>
                </block>
            </xml>
            `);
        break;   
      case 3:
        // Task 3 (Avoid red/blue doors)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <!-- Set up the "doors" array -->
          <block type="variables_set" x="20" y="20">
            <field name="VAR">doors</field>
            <value name="VALUE">
              <block type="lists_create_with">
                <mutation items="3"></mutation>
                <value name="ADD0">
                  <block type="variables_get">
                    <field name="VAR">red_door</field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="variables_get">
                    <field name="VAR">black_door</field>
                  </block>
                </value>
                <value name="ADD2">
                  <block type="variables_get">
                    <field name="VAR">blue_door</field>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <!-- For each door in the "doors" array -->
              <block type="controls_forEach" x="20" y="120">
                <field name="VAR">i</field>
                <value name="LIST">
                  <block type="variables_get">
                    <field name="VAR">doors</field>
                  </block>
                </value>
                <statement name="DO">
                  <block type="controls_if">
                    <mutation else="1"></mutation>
                    <value name="IF0">
                      <block type="logic_operation">
                        <field name="OP">OR</field>
                        <value name="A">
                          <block type="logic_compare">
                            <field name="OP">EQ</field>
                            <value name="A">
                              <block type="variables_get">
                                <field name="VAR">i</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="variables_get">
                                <field name="VAR">red_door</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <value name="B">
                          <block type="logic_compare">
                            <field name="OP">EQ</field>
                            <value name="A">
                              <block type="variables_get">
                                <field name="VAR">i</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="variables_get">
                                <field name="VAR">blue_door</field>
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
                            <field name="TEXT">Don't go down there!</field>
                          </block>
                        </value>
                      </block>
                    </statement>
                    <statement name="ELSE">
                      <block type="text_print">
                        <value name="TEXT">
                          <block type="text">
                            <field name="TEXT">You are safe to continue on your quest!</field>
                          </block>
                        </value>
                      </block>
                    </statement>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </xml>
        `);
        break;
      case 4:
        // Task 4 (Trap door warning)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <!-- Set trap_door_open to True -->
          <block type="variables_set" x="20" y="20">
            <field name="VAR">trap_door_open</field>
            <value name="VALUE">
              <block type="logic_boolean">
                <field name="BOOL">TRUE</field>
              </block>
            </value>
            <next>
              <!-- While loop: repeat while trap_door_open = False -->
              <block type="controls_whileUntil" x="20" y="100">
                <field name="MODE">WHILE</field>
                <value name="BOOL">
                  <block type="logic_compare">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR">trap_door_open</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="logic_boolean">
                        <field name="BOOL">FALSE</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">RUN!</field>
                      </block>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </xml>
        `);
        break;
      default:
        // If step number isn't recognised
        console.error("No solution available for Level 3 step", step);
    }
  }

  // Load pre-loaded solutions with XML, dependant on the lesson step
  function loadSolutionLevel4(step) {
    switch(step) {
        case 0:
            // Task 0 (Start journey)
            loadXMLSolution(`
            <xml xmlns="https://developers.google.com/blockly/xml">
                <block type="procedures_defnoreturn" x="20" y="20">
                <field name="NAME">begin_journey</field>
                <statement name="STACK">
                    <block type="variables_set">
                    <field name="VAR">gear_ready</field>
                    <value name="VALUE">
                        <block type="logic_boolean">
                        <field name="BOOL">TRUE</field>
                        </block>
                    </value>
                    <next>
                        <block type="controls_if">
                        <mutation else="1"></mutation>
                        <value name="IF0">
                            <block type="variables_get">
                            <field name="VAR">gear_ready</field>
                            </block>
                        </value>
                        <statement name="DO0">
                            <block type="text_print">
                            <value name="TEXT">
                                <block type="text">
                                <field name="TEXT">The journey begins!</field>
                                </block>
                            </value>
                            </block>
                        </statement>
                        <statement name="ELSE">
                            <block type="text_print">
                            <value name="TEXT">
                                <block type="text">
                                <field name="TEXT">Get all your things together!</field>
                                </block>
                            </value>
                            </block>
                        </statement>
                        </block>
                    </next>
                    </block>
                </statement>
                <mutation></mutation>
                </block>
            </xml>
            `);
        break;
        case 1:
            // Task 1 (Divide treasure)
            loadXMLSolution(`
            <xml xmlns="https://developers.google.com/blockly/xml">
                <block type="procedures_defnoreturn" x="20" y="20">
                <mutation>
                    <arg name="total_gold"></arg>
                    <arg name="no_adventurers"></arg>
                </mutation>
                <field name="NAME">divide_treasure</field>
                <statement name="STACK">
                    <!-- Compute share_each = total_gold ÷ no_adventurers -->
                    <block type="variables_set">
                    <field name="VAR">share_each</field>
                    <value name="VALUE">
                        <block type="math_arithmetic">
                        <field name="OP">DIVIDE</field>
                        <value name="A">
                            <block type="variables_get">
                            <field name="VAR">total_gold</field>
                            </block>
                        </value>
                        <value name="B">
                            <block type="variables_get">
                            <field name="VAR">no_adventurers</field>
                            </block>
                        </value>
                        </block>
                    </value>
                    <next>
                        <!-- Print statement with text join -->
                        <block type="text_print">
                        <value name="TEXT">
                            <block type="text_join">
                            <mutation items="2"></mutation>
                            <value name="ADD0">
                                <block type="text">
                                <field name="TEXT">each adventurers share is </field>
                                </block>
                            </value>
                            <value name="ADD1">
                                <block type="variables_get">
                                <field name="VAR">share_each</field>
                                </block>
                            </value>
                            </block>
                        </value>
                        </block>
                    </next>
                    </block>
                </statement>
                </block>
            </xml>
            `);
            break;
            case 2:
                // Task 2 (Build machine)
                loadXMLSolution(`
                  <xml xmlns="https://developers.google.com/blockly/xml">
                    <block type="procedures_defreturn" x="20" y="20">
                        <mutation has_return="true">
                        <arg name="scrap"></arg>
                        <arg name="crystalsFound"></arg>
                        </mutation>
                        <field name="NAME">build_machine</field>
                        <statement name="STACK">
                        <!-- Set machine_power = 0 -->
                        <block type="variables_set">
                            <field name="VAR">machine_power</field>
                            <value name="VALUE">
                            <block type="math_number">
                                <field name="NUM">0</field>
                            </block>
                            </value>
                            <next>
                            <!-- Set jetpack_ready = False -->
                            <block type="variables_set">
                                <field name="VAR">jetpack_ready</field>
                                <value name="VALUE">
                                <block type="logic_boolean">
                                    <field name="BOOL">FALSE</field>
                                </block>
                                </value>
                                <next>
                                <!-- For each crystalPower in crystalsFound -->
                                <block type="controls_forEach">
                                    <field name="VAR">crystalPower</field>
                                    <value name="LIST">
                                    <block type="variables_get">
                                        <field name="VAR">crystalsFound</field>
                                    </block>
                                    </value>
                                    <statement name="DO">
                                    <block type="variables_set">
                                        <field name="VAR">machine_power</field>
                                        <value name="VALUE">
                                        <block type="math_arithmetic">
                                            <field name="OP">ADD</field>
                                            <value name="A">
                                            <block type="variables_get">
                                                <field name="VAR">machine_power</field>
                                            </block>
                                            </value>
                                            <value name="B">
                                            <block type="variables_get">
                                                <field name="VAR">crystalPower</field>
                                            </block>
                                            </value>
                                        </block>
                                        </value>
                                    </block>
                                    </statement>
                                    <next>
                                    <!-- IF machine_power > 100 -->
                                    <block type="controls_if">
                                        <mutation else="0"></mutation>
                                        <value name="IF0">
                                        <block type="logic_compare">
                                            <field name="OP">GT</field>
                                            <value name="A">
                                            <block type="variables_get">
                                                <field name="VAR">machine_power</field>
                                            </block>
                                            </value>
                                            <value name="B">
                                            <block type="math_number">
                                                <field name="NUM">100</field>
                                            </block>
                                            </value>
                                        </block>
                                        </value>
                                        <statement name="DO0">
                                        <block type="text_print">
                                            <value name="TEXT">
                                            <block type="text">
                                                <field name="TEXT">You've got enough power to fly the machine!</field>
                                            </block>
                                            </value>
                                            <next>
                                            <block type="variables_set">
                                                <field name="VAR">jetpack_ready</field>
                                                <value name="VALUE">
                                                <block type="logic_boolean">
                                                    <field name="BOOL">TRUE</field>
                                                </block>
                                                </value>
                                            </block>
                                            </next>
                                        </block>
                                        </statement>
                                    </block>
                                    </next>
                                </block>
                                </next>
                            </block>
                            </next>
                        </block>
                        </statement>
                        <value name="RETURN">
                        <block type="variables_get">
                            <field name="VAR">jetpack_ready</field>
                        </block>
                        </value>
                    </block>
                    </xml>
                `);
            break;   
      case 3:
        // Task 3 (Say goodbye loop)
        loadXMLSolution(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="procedures_defreturn" x="20" y="20">
            <field name="NAME">say_goodbye</field>
            <mutation></mutation>
            <statement name="STACK">
              <!-- Create adventurers array -->
              <block type="variables_set">
                <field name="VAR">adventurers</field>
                <value name="VALUE">
                  <block type="lists_create_with">
                    <mutation items="3"></mutation>
                    <value name="ADD0">
                      <block type="text">
                        <field name="TEXT">Alice</field>
                      </block>
                    </value>
                    <value name="ADD1">
                      <block type="text">
                        <field name="TEXT">Bob</field>
                      </block>
                    </value>
                    <value name="ADD2">
                      <block type="text">
                        <field name="TEXT">Charlie</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <!-- Set index = 0 -->
                  <block type="variables_set">
                    <field name="VAR">index</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">0</field>
                      </block>
                    </value>
                    <next>
                      <!-- While loop: index < (lists_length(adventurers) - 1) -->
                      <block type="controls_whileUntil">
                        <field name="MODE">WHILE</field>
                        <value name="BOOL">
                          <block type="logic_compare">
                            <field name="OP">LT</field>
                            <value name="A">
                              <block type="variables_get">
                                <field name="VAR">index</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="math_arithmetic">
                                <field name="OP">MINUS</field>
                                <value name="A">
                                  <block type="lists_length">
                                    <value name="VALUE">
                                      <block type="variables_get">
                                        <field name="VAR">adventurers</field>
                                      </block>
                                    </value>
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
                        </value>
                        <statement name="DO">
                          <!-- Print current adventurer says goodbye -->
                          <block type="text_print">
                            <value name="TEXT">
                              <block type="text_join">
                                <mutation items="2"></mutation>
                                <value name="ADD0">
                                  <block type="lists_getIndex">
                                    <mutation at="true" statement="false"></mutation>
                                    <field name="MODE">GET</field>
                                    <field name="WHERE">FROM_START</field>
                                    <value name="VALUE">
                                      <block type="variables_get">
                                        <field name="VAR">adventurers</field>
                                      </block>
                                    </value>
                                    <value name="AT">
                                      <block type="variables_get">
                                        <field name="VAR">index</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <value name="ADD1">
                                  <block type="text">
                                    <field name="TEXT"> says goodbye to the adventurers!</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <!-- Increment index = index + 1 -->
                              <block type="variables_set">
                                <field name="VAR">index</field>
                                <value name="VALUE">
                                  <block type="math_arithmetic">
                                    <field name="OP">ADD</field>
                                    <value name="A">
                                      <block type="variables_get">
                                        <field name="VAR">index</field>
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
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <!-- Return the final adventurer (the one at index) -->
            <value name="RETURN">
              <block type="lists_getIndex">
                <mutation at="true" statement="false"></mutation>
                <field name="MODE">GET</field>
                <field name="WHERE">FROM_START</field>
                <value name="VALUE">
                  <block type="variables_get">
                    <field name="VAR">adventurers</field>
                  </block>
                </value>
                <value name="AT">
                  <block type="variables_get">
                    <field name="VAR">index</field>
                  </block>
                </value>
              </block>
            </value>
            <mutation></mutation>
          </block>
        </xml>
        `);
        break;
        case 4:
            // Task 4 (Guide home through checkpoints)
            loadXMLSolution(`
            <xml xmlns="https://developers.google.com/blockly/xml">
                <block type="procedures_defreturn" x="20" y="20">
                <mutation has_return="true"></mutation>
                <field name="NAME">guide_home</field>
                <statement name="STACK">
                    <!-- Set made_it_home = False -->
                    <block type="variables_set">
                    <field name="VAR">made_it_home</field>
                    <value name="VALUE">
                        <block type="logic_boolean">
                        <field name="BOOL">FALSE</field>
                        </block>
                    </value>
                    <next>
                        <!-- Create checkpoints array -->
                        <block type="variables_set">
                        <field name="VAR">checkpoints</field>
                        <value name="VALUE">
                            <block type="lists_create_with">
                            <mutation items="4"></mutation>
                            <value name="ADD0">
                                <block type="text">
                                <field name="TEXT">Forest</field>
                                </block>
                            </value>
                            <value name="ADD1">
                                <block type="text">
                                <field name="TEXT">River</field>
                                </block>
                            </value>
                            <value name="ADD2">
                                <block type="text">
                                <field name="TEXT">Village</field>
                                </block>
                            </value>
                            <value name="ADD3">
                                <block type="text">
                                <field name="TEXT">Home</field>
                                </block>
                            </value>
                            </block>
                        </value>
                        <next>
                            <!-- Set i = 0 -->
                            <block type="variables_set">
                            <field name="VAR">i</field>
                            <value name="VALUE">
                                <block type="math_number">
                                <field name="NUM">0</field>
                                </block>
                            </value>
                            <next>
                                <!-- While loop: i < lists_length(checkpoints) -->
                                <block type="controls_whileUntil">
                                <field name="MODE">WHILE</field>
                                <value name="BOOL">
                                    <block type="logic_compare">
                                    <field name="OP">LT</field>
                                    <value name="A">
                                        <block type="variables_get">
                                        <field name="VAR">i</field>
                                        </block>
                                    </value>
                                    <value name="B">
                                        <block type="lists_length">
                                        <value name="VALUE">
                                            <block type="variables_get">
                                            <field name="VAR">checkpoints</field>
                                            </block>
                                        </value>
                                        </block>
                                    </value>
                                    </block>
                                </value>
                                <statement name="DO">
                                    <!-- Print "Arrived at " + checkpoints[i] -->
                                    <block type="text_print">
                                    <value name="TEXT">
                                        <block type="text_join">
                                        <mutation items="2"></mutation>
                                        <value name="ADD0">
                                            <block type="text">
                                            <field name="TEXT">Arrived at </field>
                                            </block>
                                        </value>
                                        <value name="ADD1">
                                            <block type="lists_getIndex">
                                            <mutation at="true" statement="false"></mutation>
                                            <field name="MODE">GET</field>
                                            <field name="WHERE">FROM_START</field>
                                            <value name="VALUE">
                                                <block type="variables_get">
                                                <field name="VAR">checkpoints</field>
                                                </block>
                                            </value>
                                            <value name="AT">
                                                <block type="variables_get">
                                                <field name="VAR">i</field>
                                                </block>
                                            </value>
                                            </block>
                                        </value>
                                        </block>
                                    </value>
                                    <next>
                                        <!-- Increment i = i + 1 -->
                                        <block type="variables_set">
                                        <field name="VAR">i</field>
                                        <value name="VALUE">
                                            <block type="math_arithmetic">
                                            <field name="OP">ADD</field>
                                            <value name="A">
                                                <block type="variables_get">
                                                <field name="VAR">i</field>
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
                                <next>
                                    <!-- Outside the while loop: set made_it_home = True -->
                                    <block type="variables_set">
                                    <field name="VAR">made_it_home</field>
                                    <value name="VALUE">
                                        <block type="logic_boolean">
                                        <field name="BOOL">TRUE</field>
                                        </block>
                                    </value>
                                    <next>
                                        <!-- Print "Home at last!" -->
                                        <block type="text_print">
                                        <value name="TEXT">
                                            <block type="text">
                                            <field name="TEXT">Home at last!</field>
                                            </block>
                                        </value>
                                        </block>
                                    </next>
                                    </block>
                                </next>
                                </block>
                            </next>
                            </block>
                        </next>
                        </block>
                    </next>
                    </block>
                </statement>
                <!-- Return made_it_home -->
                <value name="RETURN">
                    <block type="variables_get">
                    <field name="VAR">made_it_home</field>
                    </block>
                </value>
                </block>
            </xml>
            `);
            break;
      default:
        // If step number doesn't match anything
        console.error("No solution available for Level 4 step", step);
    }
  }
  
  // Clear existing blocks and spawn in solution
  function loadXMLSolution(xmlText) {
    workspace.clear();
    const xmlDom = Blockly.Xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xmlDom, workspace);
    centerBlocks();
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
      const pos = block.getRelativeToSurfaceXY();
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      const blockHW = block.getHeightWidth();
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

  
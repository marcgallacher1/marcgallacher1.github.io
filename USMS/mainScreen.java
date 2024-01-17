import java.sql.*;
import java.util.*;
import java.security.SecureRandom;
import java.util.regex.*;
import java.time.*;
import java.time.format.*;

public class mainScreen {

    // Establishes a connection to the SQL database.
    static Connection sqlConn = databaseConnection.getMySqlConnection();

    // Scanner object to read user inputs.
    static Scanner scanInput = new Scanner(System.in);

    // Main method - entry point of the application.
    public static void main(String[] args) throws SQLException {
        // Label for the outer while loop for easy navigation.
        loginOrSignUp:
        while (true) {
            // Prompt user to choose between login and signup.
            System.out.println("Would you like to login or sign up? Type 'LOGIN' or 'SIGNUP': ");
            String ls = scanInput.next().toUpperCase();

            // Switch statement to handle user's choice.
            switch (ls) {
                case "LOGIN":
                    // Nested loop for user role selection in login process.
                    while (true) {
                        // Prompt for user role: student, lecturer, or manager.
                        System.out.println("Are you a student, lecturer or manager? Type 'STUDENT', 'LECTURER' or 'MANAGER'");
                        String role = scanInput.next().toUpperCase();

                        // Switch statement to handle different roles.
                        switch (role) {
                            case "STUDENT", "LECTURER", "MANAGER":
                                // Calls the login method with the selected role.
                                login(role);
                                // Breaks out of the outer loop upon successful login.
                                break loginOrSignUp;

                            default:
                                // Handles invalid role input.
                                System.out.println("Please enter either 'STUDENT', 'LECTURER', or 'MANAGER' to continue...\n");
                        }
                    }

                case "SIGNUP":
                    // Nested loop for role selection in signup process.
                    while (true) {
                        // Prompt for user role: student or lecturer.
                        System.out.println("Are you a student or lecturer? Type 'STUDENT' or 'LECTURER'");
                        String role = scanInput.next().toUpperCase();

                        // Switch statement to handle different roles for signup.
                        switch (role) {
                            case "STUDENT":
                                // Calls the student signup method.
                                studentSignup();
                                // Breaks out of the outer loop after signup.
                                break loginOrSignUp;

                            case "LECTURER":
                                // Calls the lecturer signup method.
                                lecturerSignup();
                                // Breaks out of the outer loop after signup.
                                break loginOrSignUp;

                            default:
                                // Handles invalid role input during signup.
                                System.out.println("Please enter either 'STUDENT', or 'LECTURER' to continue...\n");
                        }
                    }

                default:
                    // Handles invalid input for login or signup choice.
                    System.out.println("Please enter either 'LOGIN' or 'SIGNUP' to continue...\n");
            }
        }
    }

    // Method for student signup process.
    public static void studentSignup() throws SQLException {
        // Variables to store user input for student details.
        String firstname, surname, gender, email, DOB;
        Scanner signup = new Scanner(System.in);

        // Validate and collect student's first name.
        do {
            System.out.println("Enter firstname:");
            firstname = signup.next();
        } while (!lengthCheck(firstname, 255)); // Checks if the length is within the limit.

        // Validate and collect student's surname.
        do {
            System.out.println("Enter surname:"); // Checks if the length is within the limit.
            surname = signup.next();
        } while (!lengthCheck(surname, 255));

        // Validate and collect student's gender.
        do {
            System.out.println("Enter gender (male/female):"); // Checks if the gender input is valid.
            gender = signup.next();
        } while (!isGender(gender));

        // Validate and collect student's email.
        do {
            System.out.println("Enter email:");
            email = signup.next();
        } while (!isValidEmail(email) || isEmailTaken(email)); // Checks for valid email format and if it's already taken.

        // Validate and collect student's date of birth.
        do {
            System.out.println("Enter DOB (dd/mm/yyyy):");
            DOB = signup.next();
        } while (!isDateFormat(DOB)); // Checks if the DOB input is in the correct format.

        // Generate a random password for the new student.
        String generatedPassword = generatePassword();

        // Create a new student object with the collected details.
        Student newStudent = new Student(null, firstname, surname, gender, email, DOB, generatedPassword);

        // Generate a unique ID for the new student.
        generateID(newStudent);

        // Display the new student's ID and generated password.
        System.out.println("Your details are - Student ID: " + newStudent.getID() + ", Password: " + generatedPassword + "\nYou can update your password once you have been approved.");

        // Prepare SQL query to insert the new student into the approvals table.
        String sqlQuery = "INSERT INTO approvals(userID, forename, surname, gender, email, dateOfBirth, qualification, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);

        // Set parameters for the prepared statement with the new student's details.
        ps.setString(1, newStudent.getID());
        ps.setString(2, newStudent.getForename());
        ps.setString(3, newStudent.getSurname());
        ps.setString(4, newStudent.getGender());
        ps.setString(5, newStudent.getEmail());
        ps.setString(6, newStudent.getDob());
        ps.setString(7, null);
        ps.setString(8, newStudent.getPassword());

        // Execute the update and provide feedback on the success of the operation.
        int rowsAffected = ps.executeUpdate();

        if (rowsAffected > 0) {
            System.out.println("You are currently awaiting approval. If approved by the manager, you will be able to log in with the details provided above.");
        } else {
            System.out.println("There was an issue inserting the student data.");
        }

    }

    // Method for lecturer signup process.
    public static boolean lecturerSignup() throws SQLException {

        // Flag to indicate successful signup.
        boolean signedUp = false;
        String firstname, surname, gender, email, DOB, qualification;

        // New Scanner instance for user input.
        Scanner signup = new Scanner(System.in);

        // Loop to validate and input lecturer's first name.
        do {
            System.out.println("Enter firstname:");
            firstname = signup.next();
        } while (!lengthCheck(firstname, 255)); // Checks if the length is within the limit.

        // Loop to validate and input lecturer's surname.
        do {
            System.out.println("Enter surname:");
            surname = signup.next();
        } while (!lengthCheck(surname, 255)); // Checks if the length is within the limit.

        // Loop to validate and input lecturer's gender.
        do {
            System.out.println("Enter gender (male/female):");
            gender = signup.next();
        } while (!isGender(gender)); // Checks if the gender input is valid.

        // Loop to validate and input lecturer's email.
        do {
            System.out.println("Enter email:");
            email = signup.next();
        } while (!isValidEmail(email) || isEmailTaken(email)); // Checks for valid email format and if it's already taken.

        // Loop to validate and input lecturer's date of birth.
        do {
            System.out.println("Enter DOB (dd/mm/yyyy):");
            DOB = signup.next();
        } while (!isDateFormat(DOB)); // Checks if the DOB input is in the correct format.

        // Loop to validate and input lecturer's qualification.
        do {
            System.out.println("Enter qualification (PhD, MSc, BSc, BEng):");
            qualification = signup.next();
        } while (!isQualification(qualification)); // Checks if the qualification input is valid.

        // Generate a random password for the new lecturer.
        String generatedPassword = generatePassword();

        // Create a new Lecturer object with the provided details.
        Lecturer newLecturer = new Lecturer(null, firstname, surname, gender, email, DOB, qualification, generatedPassword);

        // Generate a unique ID for the new lecturer.
        generateID(newLecturer);

        // Display the generated lecturer ID and password.
        System.out.println("Your details are - Lecturer ID: " + newLecturer.getID() + ", Password: " + generatedPassword + "\nYou can update your password once you have been approved.");

        // Prepare SQL query to insert new lecturer details into the approvals table.
        String sqlQuery = "INSERT INTO approvals(userID, forename, surname, gender, email, dateOfBirth, qualification, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);

        // Set parameters for the SQL query.
        ps.setString(1, newLecturer.getID());
        ps.setString(2, newLecturer.getForename());
        ps.setString(3, newLecturer.getSurname());
        ps.setString(4, newLecturer.getGender());
        ps.setString(5, newLecturer.getEmail());
        ps.setString(6, newLecturer.getDob());
        ps.setString(7, newLecturer.getQualification());
        ps.setString(8, newLecturer.getPassword());

        // Execute the update and check the number of rows affected.
        int rowsAffected = ps.executeUpdate();

        // Check if the insert operation was successful.
        if (rowsAffected > 0) {
            signedUp = true; // Set flag to true if the insertion was successful.
            System.out.println("You are currently awaiting approval. If approved by the manager, you will be able to log in with the details provided above.");
        } else {
            // Display message if there was an issue during insertion.
            System.out.println("There was an issue inserting the lecturer data.");
        }

        // Return the status of the signup operation.
        return signedUp;
    }

    // Method for login process.
    public static void login(String role) throws SQLException {
        // Declaration of variables for ID, password, SQL query, PreparedStatement, and ResultSet.
        String ID, password, sqlQuery;
        PreparedStatement ps;
        ResultSet rs;
        boolean validCredentials;

        // Placeholder objects for different user roles.
        Student currentStudent = null;
        Lecturer currentLecturer = null;
        Manager currentManager = null;

        // Switch statement based on the role passed to the method.
        switch (role) {
            case "STUDENT":
                // Flag to keep track of valid login credentials.
                validCredentials = false;
                while (!validCredentials) {
                    // Prompting and reading student ID.
                    System.out.println("Please enter an ID:");
                    ID = scanInput.next();

                    // SQL query to check if student exists and is activated.
                    sqlQuery = "SELECT * FROM student WHERE studentID = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, ID);
                    rs = ps.executeQuery();

                    // Check if the student is activated.
                    if (rs.next()) {
                        if (rs.getInt("activated") == 0) {
                            System.out.println("Student with ID = " + ID + " is not activated...\n");
                            mainScreen.main(new String[]{});
                        }
                    }

                    // Prompting and reading password.
                    System.out.println("Please enter your password:");
                    password = scanInput.next();

                    // SQL query to authenticate student.
                    sqlQuery = "SELECT * FROM student WHERE studentID = ? AND password = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, ID);
                    ps.setString(2, password);
                    rs = ps.executeQuery();

                    // Check if credentials are valid and create a student object.
                    if (rs.next()) {
                        validCredentials = true;
                        currentStudent = new Student(rs.getString("studentID"), rs.getString("forename"), rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getString("dateOfBirth"), rs.getString("password"));
                    } else {
                        System.out.println("Invalid ID or password. Please try again.");
                    }

                    rs.close();
                }
                // Welcome message and calling method for student-specific functionalities.
                System.out.println("Welcome back " + currentStudent.getForename() + " " + currentStudent.getSurname() + ".");
                loginStudent(currentStudent);
                break;
            case "LECTURER":
                // Flag to keep track of valid login credentials.
                validCredentials = false;
                while (!validCredentials) {
                    // Prompting and reading lecturer ID.
                    System.out.println("Please enter an ID:");
                    ID = scanInput.next();

                    // SQL query to check if lecturer exists and is activated.
                    sqlQuery = "SELECT * FROM lecturer WHERE lecturerID = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, ID);
                    rs = ps.executeQuery();

                    // Check if the lecturer is activated.
                    if (rs.next()) {
                        if (rs.getInt("activated") == 0) {
                            System.out.println("Lecturer with ID = " + ID + " is not activated...\n");
                            mainScreen.main(new String[]{});
                        }
                    }

                    // Prompting and reading password.
                    System.out.println("Please enter your password:");
                    password = scanInput.next();

                    // SQL query to authenticate lecturer.
                    sqlQuery = "SELECT * FROM lecturer WHERE lecturerID = ? AND password = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, ID);
                    ps.setString(2, password);
                    rs = ps.executeQuery();

                    // Check if credentials are valid and create a lecturer object.
                    if (rs.next()) {
                        validCredentials = true;
                        currentLecturer = new Lecturer(rs.getString("lecturerID"), rs.getString("forename"), rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getString("dateOfBirth"), rs.getString("qualification"), rs.getString("password"));
                    } else {
                        System.out.println("Invalid ID or password. Please try again.");
                    }

                    rs.close();
                }
                // Welcome message and calling method for lecturer-specific functionalities.
                System.out.println("Welcome back " + currentLecturer.getForename() + " " + currentLecturer.getSurname() + ".");
                loginLecturer(currentLecturer);
                break;
            case "MANAGER":
                // Flag to keep track of valid login credentials.
                validCredentials = false;
                while (!validCredentials) {
                    // Prompting and reading manager ID and password.
                    System.out.println("Please enter an ID:");
                    ID = scanInput.next();
                    System.out.println("Please enter your password:");
                    password = scanInput.next();

                    // SQL query to check if manager exists.
                    sqlQuery = "SELECT * FROM manager WHERE managerID = ? AND password = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, ID);
                    ps.setString(2, password);
                    rs = ps.executeQuery();

                    // Check if credentials are valid and create a manager object.
                    if (rs.next()) {
                        validCredentials = true;
                        currentManager = new Manager(rs.getString("managerID"), rs.getString("forename"), rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getString("dateOfBirth"), rs.getString("password"));
                    } else {
                        System.out.println("Invalid ID or password. Please try again.");
                    }

                    rs.close();
                }
                // Welcome message and calling method for manager-specific functionalities.
                System.out.println("Welcome back " + currentManager.getForename() + " " + currentManager.getSurname() + ".");
                loginManager(currentManager);
                break;
        }

    }

    // This is the student's main GUI
    public static void loginStudent(Student currentStudent) {
        // Display options for student-specific functionalities.
        System.out.println("Please Select an Option:\n 1. Update Password\n 2. View Marks\n 3. Download Notes\n 4. View Decision\n 5. Quit\n");
        int studentChoice = scanInput.nextInt();

        // Switch statement to handle the chosen option.
        switch (studentChoice) {
            case 1:
                // Option 1: Update Password.
                System.out.println("Enter current password:");
                String oldPass = scanInput.next();

                System.out.println("Enter new password:");
                String newPass = scanInput.next();

                System.out.println("Confirm new password:");
                String confirmPass = scanInput.next();

                // Call to updatePassword method of the currentStudent object.
                currentStudent.updatePassword(oldPass, newPass, confirmPass);
                break;

            case 2:
                // Option 2: View Marks.
                // Call to viewMarks method of the currentStudent object.
                currentStudent.viewMarks();
                break;

            case 3:
                // Option 3: Download Notes.
                // Clearing the input buffer before taking a new line input.
                scanInput.nextLine();
                System.out.println("Enter module name you would like to download a note from:");
                String moduleName = scanInput.nextLine();

                System.out.println("Would you like to download a lecture note or lab note? (TYPE 'Lecture' or 'Lab'):");
                String lecOrLab = scanInput.nextLine().toUpperCase();

                // Loop to ensure the user enters either 'Lecture' or 'Lab'.
                while (!(lecOrLab.equals("LECTURE") || lecOrLab.equals("LAB"))) {
                    System.out.println("Please enter either lecture or lab: ");
                    lecOrLab = scanInput.nextLine().toUpperCase();
                }

                System.out.println("What week would you like to download the note from?");
                int weekNo = scanInput.nextInt();

                // Call to downloadNote method with the specified module, note type, and week number.
                currentStudent.downloadNote(moduleName, lecOrLab, weekNo);
                break;

            case 4:
                // Option 4: View Decision.
                // Call to viewDecision method of the currentStudent object.
                currentStudent.viewDecision();
                break;

            case 5:
                // Option 5: Quit - exits the method.
                return;

            default:
                // Handling invalid choice input.
                System.out.println("Invalid choice. Please select a number between 1 and 4.");
        }

        // Recursive call to allow the student to select another option without exiting.
        mainScreen.loginStudent(currentStudent);
    }


    // This is the lecturer's main GUI
    public static void loginLecturer(Lecturer currentLecturer) throws SQLException {
        // Displaying options available for the lecturer.
        System.out.println("Please Select an Option:\n 1. Update Password\n 2. Update Module Info\n 3. Upload or Update Material\n 4. Display Enrolled Student\n 5. Update Exam Record\n 6. Quit\n");
        int lecturerChoice = scanInput.nextInt();

        // Variables to hold inputs for different options.
        String input = "";
        String lecOrLab = "";
        String newNote = "";
        int weekNo = 0;

        // Switch statement based on the lecturer's choice.
        switch (lecturerChoice) {
            case 1:
                // Option 1: Update Password.
                // Prompting and obtaining current, new, and confirmation passwords from the lecturer.
                System.out.println("Enter current password:");
                String oldPass = scanInput.next();

                System.out.println(("Enter new password:"));
                String newPass = scanInput.next();

                System.out.println(("Confirm new password:"));
                String confirmPass = scanInput.next();

                // Updating the lecturer's password.
                currentLecturer.updatePassword(oldPass, newPass, confirmPass);
                // Recursively calling the loginLecturer method to display options again.
                mainScreen.loginLecturer(currentLecturer);
                break;

            case 2:
                // Option 2: Update Module Info.
                // Prompting the lecturer to choose which field of a module to update.
                System.out.println("Enter what field you would like to update\n 1. Module Name\n 2. Credit Points\n 3. Semester\n 4. Quit\n");
                int fieldChange = scanInput.nextInt();

                switch (fieldChange) {

                    case 1:

                        System.out.println("Enter the new module name: ");
                        input = scanInput.next();
                        break;

                    case 2:

                        System.out.println("Please enter the credit points for your module: ");
                        input = scanInput.next();
                        break;

                    case 3:
                        System.out.println("Please enter the semester(s) ('1', '1&2', '2'): ");
                        input = scanInput.next();

                        while (!(input.equals("1") || input.equals("1&2") || input.equals("2"))) {
                            System.out.println("Please enter ('1', '1&2', '2'): ");
                            input = scanInput.next();
                        }

                        break;

                    case 4:
                        break;

                    default:
                        System.out.println("Invalid option.");

                }

                // Updating the module information based on the lecturer's input.
                currentLecturer.updateModuleInfo(fieldChange, input);
                break;

            case 3:
                // Option 3: Upload or Update Material.
                // Prompting the lecturer to choose between uploading and updating material.
                System.out.println("Would you like to upload or update material?\n 1. Upload\n 2. Update\n 3. Quit");
                int UU = scanInput.nextInt();

                while (!(UU == 1 || UU == 2 || UU == 3)) {
                    System.out.println("Please enter a valid number...");
                    System.out.println("Would you like to upload or update material?\n 1. Upload\n 2. Update\n 3. Quit");
                    UU = scanInput.nextInt();
                }

                // Depending on the choice, lecturer either uploads new material or updates existing material.
                switch (UU) {

                    case 1:
                        System.out.println("Would you like to upload a lecture note or lab note? (TYPE 'Lecture' or 'Lab'):");
                        lecOrLab = scanInput.next().toUpperCase();

                        while (!(lecOrLab.equals("LECTURE") || lecOrLab.equals("LAB"))) {
                            System.out.println("Please enter either lecture or lab: ");
                            lecOrLab = scanInput.next().toUpperCase();
                        }

                        switch (lecOrLab) {

                            case "LECTURE":
                                System.out.println("What week would you like to upload the lecture note to?");
                                weekNo = scanInput.nextInt();

                                scanInput.nextLine();
                                System.out.println("Enter note");
                                newNote = scanInput.nextLine();

                                break;

                            case "LAB":
                                System.out.println("What week would you like to upload the lab note to?");
                                weekNo = scanInput.nextInt();

                                scanInput.nextLine();
                                System.out.println("Enter note");
                                newNote = scanInput.nextLine();

                                break;
                        }

                        break;

                    case 2:
                        System.out.println("Would you like to update a lecture note or lab note? (TYPE 'Lecture' or 'Lab'):");
                        lecOrLab = scanInput.next().toUpperCase();

                        while (!(lecOrLab.equals("LECTURE") || lecOrLab.equals("LAB"))) {
                            System.out.println("Please enter either lecture or lab: ");
                            lecOrLab = scanInput.next().toUpperCase();
                        }

                        switch (lecOrLab) {

                            case "LECTURE":
                                System.out.println("What week would you like to update the lecture note?");
                                weekNo = scanInput.nextInt();

                                scanInput.nextLine();
                                System.out.println("Enter note");
                                newNote = scanInput.nextLine();

                                break;

                            case "LAB":
                                System.out.println("What week would you like to update the lab note?");
                                weekNo = scanInput.nextInt();

                                scanInput.nextLine();
                                System.out.println("Enter note");
                                newNote = scanInput.nextLine();

                                break;

                        }

                        break;

                    case 3:
                        break;

                }

                // Calling the uploadOrUpdateMaterial method with the details of the material.
                currentLecturer.uploadOrUpdateMaterial(UU, lecOrLab, weekNo, newNote);
                break;

            case 4:
                // Option 4: Display Enrolled Students.
                // Displaying the list of students enrolled in the lecturer's module.
                currentLecturer.displayEnrolledStudents();
                break;

            case 5:
                // Option 5: Update Exam Record.
                // Updating exam records for the lecturer's module.
                currentLecturer.updateExamRecord();
                break;

            case 6:
                // Option 6: Quit.
                // Exiting the method.
                return;

            default:
                // Handling invalid input for options.
                System.out.println("Invalid choice. Please select a number between 1 and 5.");
        }

        // Recursively calling the loginLecturer method to display options again.
        mainScreen.loginLecturer(currentLecturer);
    }

    // This is the manager's main GUI
    public static void loginManager(Manager currentManager) throws SQLException {
        // Displaying options available for the manager.
        System.out.println("Please Select an Option:\n 1. Update Password\n 2. View Workflow\n 3. Approve Users\n 4. Manage Accounts\n 5. Assign Module To Lecturer\n 6. Enrol Students\n 7. Issue Decision\n 8. Add Business Rule\n 9. Add New Course\n 10. Add Modules\n 11. Assign Module to Course\n 12. Display Course Details\n 13. Display Module Details\n 14. Update Course Information\n 15. Quit\n");

        // Reading the manager's choice.
        int managerChoice = scanInput.nextInt();

        // Switch statement to handle the chosen option.
        switch (managerChoice) {
            case 1:
                // Option 1: Update Manager's Password.
                // Prompting and obtaining current, new, and confirmation passwords from the manager.
                System.out.println("Enter current password:");
                String oldPass = scanInput.next();

                System.out.println("Enter new password:");
                String newPass = scanInput.next();

                System.out.println("Confirm new password:");
                String confirmPass = scanInput.next();

                // Updating the manager's password.
                currentManager.updatePassword(oldPass, newPass, confirmPass);
                break;

            case 2:
                // Option 2: View Manager's Workflow.
                // Displaying the workflow related details.
                currentManager.viewWorkflow();
                break;

            case 3:
                // Option 3: Approve Users.
                // Retrieving and displaying users awaiting approval.
                String sqlQuery = "SELECT * FROM approvals";
                PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
                ResultSet rs = ps.executeQuery();

                List<Map<String, String>> users = new ArrayList<>();
                int count = 1;

                System.out.println("Users waiting approval:\n");

                while (rs.next()) {

                    Map<String, String> user = new HashMap<>();
                    user.put("userID", rs.getString("userID"));
                    user.put("forename", rs.getString("forename"));
                    user.put("surname", rs.getString("surname"));
                    user.put("gender", rs.getString("gender"));
                    user.put("email", rs.getString("email"));
                    user.put("dateOfBirth", rs.getString("dateOfBirth"));
                    user.put("password", rs.getString("password"));

                    if (rs.getString("qualification") == null) {
                        System.out.println(count + ". " + "Student Name: " + user.get("forename") + " " + user.get("surname"));
                    } else {
                        user.put("qualification", rs.getString("qualification"));
                        System.out.println(count + ". " + "Lecturer Name: " + user.get("forename") + " " + user.get("surname"));
                        System.out.println("Qualification: " + user.get("qualification"));
                    }

                    System.out.println("Gender: " + user.get("gender"));
                    System.out.println("Email: " + user.get("email"));
                    System.out.println("DOB: " + user.get("dateOfBirth"));
                    System.out.println("\n");

                    users.add(user);

                    count++;
                }

                if (users.isEmpty()) {
                    System.out.println("No users waiting for approval...");
                    break;
                }

                // Handling user selection and approval/disapproval action.
                System.out.println("Please type a number you would like to select, or 'exit' to exit:");
                String inputNum = scanInput.next().toUpperCase();

                if (inputNum.equals("EXIT")) {
                    return;
                }

                int index = Integer.parseInt(inputNum) - 1;

                if (index >= 0 && index < users.size()) {
                    System.out.println("Would you like to approve or disprove this user? ('approve' or 'disprove'): ");
                    String inputApproval = scanInput.next().toUpperCase();

                    currentManager.approveUsers(users, index, inputApproval);
                } else {
                    System.out.println("Invalid selection. Please enter a valid number or 'exit'.");
                }

                break;

            case 4:
                // Option 4: Manage Accounts (activate, deactivate, password reset).
                // Prompting and handling account management options.
                System.out.println("Is the user a student or lecturer?: ");
                String userType = scanInput.next().toUpperCase();

                while (!(userType.equals("STUDENT") || userType.equals("LECTURER"))) {
                    System.out.println("Invalid user type...\n");
                    System.out.println("Is the user a student or lecturer?: ");
                    userType = scanInput.next().toUpperCase();
                }

                System.out.println("Do you want to activate, deactivate or do a password reset? (Enter 'activate', 'deactivate', 'password'): ");
                String action = scanInput.next().toUpperCase();

                if (!(action.equals("ACTIVATE") || action.equals("DEACTIVATE") || action.equals("PASSWORD"))) {
                    System.out.println("Invalid action. Please enter 'activate', 'deactivate' or 'password'");
                    return;
                }

                System.out.println("Please enter the user ID: ");
                String userId = scanInput.next().toUpperCase();

                // Executing the account management actions.
                currentManager.manageAccounts(userType, action, userId);

                break;

            case 5:
                // Option 5: Assign Module To Lecturer.
                // Prompting for lecturer ID and module code, and assigning the module.
                System.out.println("Please enter the lecturer ID:");
                String lecturerID = scanInput.next();

                scanInput.nextLine();
                System.out.println("Please enter the module code:");
                String moduleID = scanInput.nextLine();

                currentManager.assignModuleToLecturer(lecturerID, moduleID);
                break;

            case 6:
                // Option 6: Enrol Students in Courses.
                // Prompting for student ID and course ID, and enrolling the student.
                scanInput.nextLine();
                System.out.println("Enter Student ID: ");
                String studentID = scanInput.nextLine();

                System.out.println("Enter the course ID of the course you want to enroll in: ");
                int courseID = scanInput.nextInt();

                currentManager.enrolStudents(studentID, courseID);
                break;

            case 7:
                // Option 7: Issue Decision.
                // Handling decisions like award, resit, or withdraw for students.
                currentManager.issueDecision();
                break;

            case 8:
                // Option 8: Add Business Rule.
                // Adding a new business rule.
                currentManager.addBusinessRule();
                break;

            case 9:
                // Option 9: Add New Course.
                // Adding a new course to the system.
                currentManager.addNewCourse();
                break;

            case 10:
                // Option 10: Add Modules.
                // Adding new modules to the system.
                currentManager.addModule();
                break;

            case 11:
                // Option 11: Assign Module to Course.
                // Assigning a module to a course.
                currentManager.assignModuleToCourse();
                break;

            case 12:
                // Option 12: Display Course Details.
                // Displaying details of a specific course.
                currentManager.displayCourseDetails();
                break;

            case 13:
                // Option 13: Display Module Details.
                // Displaying details of a specific module.
                currentManager.displayModuleDetails();
                break;

            case 14:
                // Option 14: Update Course Information.
                // Updating information of a specific course.
                currentManager.updateCourseInfo();
                break;

            case 15:
                // Option 15: Quit.
                // Exiting the method.
                return;

            default:
                // Handling invalid input for options.
                System.out.println("Invalid choice. Please select a number between 1 and 15.");
        }

        // Recursively calling the loginManager method to display options again.
        mainScreen.loginManager(currentManager);
    }


    public static String generatePassword() {
        // String containing all possible characters for the password.
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

        // SecureRandom instance for generating cryptographically strong random values.
        SecureRandom random = new SecureRandom();

        // StringBuilder to build the password efficiently.
        StringBuilder password = new StringBuilder();

        // Loop to generate a 12-character password.
        for (int i = 0; i < 12; i++) {
            // Generate a random index and append the character at that index to the password.
            int randomIndex = random.nextInt(chars.length());
            password.append(chars.charAt(randomIndex));
        }

        // Convert the StringBuilder to String and return it.
        return password.toString();
    }

    public static void generateID(User user) {
        // Random object for generating random numbers.
        Random random = new Random();
        // Generate a random four-digit number.
        int fourDigitNumber = 1000 + random.nextInt(9000);

        // Retrieve the date of birth from the user object.
        String dob = user.getDob();
        // Concatenate the four-digit number and formatted DOB to create the ID.
        String ID = fourDigitNumber + dob.replace("/", "");

        // Set the generated ID back to the user object.
        user.setID(ID);
    }

    public static boolean lengthCheck(String value, int length) {
        // Check if the length of the given string is less than or equal to the specified length.
        boolean isCheck = value.length() <= length;

        // Print a warning message if the length exceeds the limit.
        if (!isCheck) {
            System.out.println("Value cannot exceed " + length + " characters");
        }

        // Return the result of the length check.
        return isCheck;
    }

    public static boolean isValidEmail(String email) {
        // Regex pattern for validating email format.
        String EMAIL_PATTERN = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

        // Compile the regex pattern.
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        // Match the given email against the pattern.
        Matcher matcher = pattern.matcher(email);

        // Check if the email matches the pattern.
        boolean isValid = matcher.matches();

        // Print a warning message if the email format is invalid.
        if (!isValid) {
            System.out.println("Value must be in an email format...");
        }

        // Return the result of the email validation.
        return isValid;
    }

    public static boolean isGender(String gender) {
        // Convert the gender string to uppercase for case-insensitive comparison.
        gender = gender.toUpperCase();

        // Check if the gender is either 'MALE' or 'FEMALE'.
        if (gender.equals("MALE") || gender.equals("FEMALE")) {
            return true;
        }

        // Print a warning message if the gender input is invalid.
        System.out.println("Value must be either male or female");
        return false;
    }

    public static boolean isDateFormat(String dob) {
        // Check if the length of the DOB string is exactly 10 characters (format dd/mm/yyyy).
        if (dob.length() != 10) {
            System.out.println("Value must be in the format (dd/mm/yyyy)...");
            return false;
        }

        // Validate the format of the date.
        for (int i = 0; i < 10; i++) {
            if ((i == 2 || i == 5) && dob.charAt(i) != '/') {
                System.out.println("Value must be in the format (dd/mm/yyyy)...");
                return false;
            }
            if ((i != 2 && i != 5) && !Character.isDigit(dob.charAt(i))) {
                System.out.println("Value must be in the format (dd/mm/yyyy)...");
                return false;
            }
        }

        // Parse the date to check if it's a valid date and within reasonable bounds.
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            LocalDate dateOfBirth = LocalDate.parse(dob, formatter);
            LocalDate currentDate = LocalDate.now();

            if (dateOfBirth.isBefore(currentDate.minusYears(150)) || dateOfBirth.isAfter(currentDate)) {
                System.out.println("DOB cannot be more than 150 years ago or in the future.");
                return false;
            }
        } catch (DateTimeParseException e) {
            System.out.println("Invalid date format.");
            return false;
        }

        return true;
    }

    public static boolean isQualification(String qual) {
        // Convert the qualification string to uppercase for case-insensitive comparison.
        qual = qual.toUpperCase();

        // Check if the qualification is one of the specified values.
        if (qual.equals("PHD") || qual.equals("MSC") || qual.equals("BSC") || qual.equals("BENG")) {
            return true;
        }

        // Print a warning message if the qualification input is invalid.
        System.out.println("Value must be either PhD, MSc, BSc or BEng");
        return false;
    }

    private static boolean isEmailTaken(String email) throws SQLException {
        // SQL query to check if the email already exists in the database.
        String checkEmailQuery = "SELECT COUNT(*) FROM student WHERE email = ?";
        PreparedStatement psEmailCheck = sqlConn.prepareStatement(checkEmailQuery);
        psEmailCheck.setString(1, email);

        // Execute the query and retrieve the result.
        ResultSet resultSet = psEmailCheck.executeQuery();

        // Check if the email is already taken.
        if (resultSet.next()) {
            int count = resultSet.getInt(1);
            if (count > 0) {
                System.out.println("This email is already taken. Please use another email.");
                return true;
            }
        }

        return false;
    }


}
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

// Define a class named 'Manager' which extends the 'User' class.
public class Manager extends User {

    // Declare a 'Manager' object named 'currentManager'.
    Manager currentManager;

    // Constructor for 'Manager' class with parameters for manager details.
    public Manager(String ID, String forename, String surname, String gender, String email, String dob, String password) {
        // Set manager's details using the setter methods inherited from the 'User' class.
        setID(ID);
        setForename(forename);
        setSurname(surname);
        setGender(gender);
        setEmail(email);
        setDob(dob);
        setPassword(password);
    }

    // Method to update the password of the manager.
    public void updatePassword(String oldPass, String newPass, String confirmPass) {
        // Re-instantiate the 'currentManager' object with the manager's current details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        try {
            // Prepare SQL query to select a manager with a specific ID and password.
            String sqlQuery = "SELECT * FROM manager WHERE managerID = ? AND password = ?";
            PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
            // Set parameters in the prepared statement.
            ps.setString(1, getID());
            ps.setString(2, oldPass);
            // Execute the query and store the result.
            ResultSet rs = ps.executeQuery();

            // Check if a manager with the given ID and password exists.
            if (rs.next()) {
                // Verify if the new password matches the confirmed password.
                if (!confirmPass.equals(newPass)) {
                    System.out.println("Confirmed password does not match the new password entered...");
                } else {
                    // Prepare SQL query to update the password of the manager.
                    sqlQuery = "UPDATE manager SET password = ? WHERE managerID = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, newPass);
                    ps.setString(2, getID());
                    // Execute the update and store the number of rows affected.
                    int rowsUpdated = ps.executeUpdate();
                    // Check if the password was successfully updated.
                    if (rowsUpdated > 0) {
                        System.out.println("Password updated successfully!");
                    } else {
                        System.out.println("Password update failed");
                    }
                }
            } else {
                System.out.println("Invalid current password.");
            }
        } catch (Exception e) {
            // Catch and display any exceptions that occur during the process.
            System.out.println("An error occurred: " + e.getMessage());
        }
    }

    // Method to view the workflow.
    public void viewWorkflow() throws SQLException {
        // Re-instantiate the 'currentManager' object with the manager's current details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prepare SQL query to select all entries from the 'approvals' table.
        String sqlQuery = "SELECT * FROM approvals";
        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
        // Execute the query and store the result.
        ResultSet rs = ps.executeQuery();

        // Print the header for the output.
        System.out.println("Users waiting approval:\n");

        // Iterate through the result set.
        while (rs.next()) {
            // Check if the 'qualification' field is null to determine if the user is a student.
            if (rs.getString("qualification") == null) {
                // Print student details.
                System.out.println("Student Name: " + rs.getString("forename") + " " + rs.getString("surname"));
                System.out.println("Gender: " + rs.getString("gender"));
                System.out.println("Email: " + rs.getString("email"));
                System.out.println("DOB: " + rs.getString("dateOfBirth"));
            } else {
                // Print lecturer details (including qualification).
                System.out.println("Lecturer Name: " + rs.getString("forename") + " " + rs.getString("surname"));
                System.out.println("Gender: " + rs.getString("gender"));
                System.out.println("Email: " + rs.getString("email"));
                System.out.println("DOB: " + rs.getString("dateOfBirth"));
                System.out.println("Qualification: " + rs.getString("qualification"));
            }
            // Print a blank line for separating entries.
            System.out.print("\n");
        }
    }

    // Method to approve or disapprove users based on the given input.
    public void approveUsers(List<Map<String, String>> users, int index, String inputApproval) throws SQLException {
        // Initialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Retrieve the selected user's details from the list based on the given index.
        Map<String, String> selectedUser = users.get(index);

        // Declare variables for prepared statements and SQL queries.
        PreparedStatement psApprove;
        PreparedStatement psDisprove;
        String approveQuery;
        String disproveQuery;

        // Use a switch statement to handle different approval inputs.
        switch (inputApproval) {
            case "APPROVE":
                // Check if the user is a student (no 'qualification' key).
                if (!users.get(index).containsKey("qualification")) {
                    // Prepare SQL query to insert a new student record.
                    approveQuery = "INSERT INTO student (studentID, forename, surname, gender, email, dateOfBirth, password, managerID, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    psApprove = sqlConn.prepareStatement(approveQuery);

                    // Set parameters for the student insert query.
                    // Set each field value using the selected user's details.
                    psApprove.setString(1, selectedUser.get("userID"));
                    psApprove.setString(2, selectedUser.get("forename"));
                    psApprove.setString(3, selectedUser.get("surname"));
                    psApprove.setString(4, selectedUser.get("gender"));
                    psApprove.setString(5, selectedUser.get("email"));
                    psApprove.setString(6, selectedUser.get("dateOfBirth"));
                    psApprove.setString(7, selectedUser.get("password"));
                    psApprove.setString(8, getID());
                    psApprove.setBoolean(9, true);

                    // Execute the update for student approval.
                    psApprove.executeUpdate();
                } else {
                    // Prepare SQL query to insert a new lecturer record, including qualification.
                    approveQuery = "INSERT INTO lecturer (lecturerID, forename, surname, gender, email, dateOfBirth, qualification, password, managerID, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    psApprove = sqlConn.prepareStatement(approveQuery);

                    // Set parameters for the lecturer insert query.
                    // Set each field value using the selected user's details.
                    psApprove.setString(1, selectedUser.get("userID"));
                    psApprove.setString(2, selectedUser.get("forename"));
                    psApprove.setString(3, selectedUser.get("surname"));
                    psApprove.setString(4, selectedUser.get("gender"));
                    psApprove.setString(5, selectedUser.get("email"));
                    psApprove.setString(6, selectedUser.get("dateOfBirth"));
                    psApprove.setString(7, selectedUser.get("qualification"));
                    psApprove.setString(8, selectedUser.get("password"));
                    psApprove.setString(9, getID());
                    psApprove.setBoolean(10, true);

                    // Execute the update for lecturer approval.
                    psApprove.executeUpdate();
                }

                // Prepare and execute query to remove the user from the 'approvals' table.
                String deleteQuery = "DELETE FROM approvals WHERE userID = ?";
                PreparedStatement psDelete = sqlConn.prepareStatement(deleteQuery);
                psDelete.setString(1, selectedUser.get("userID"));
                psDelete.executeUpdate();

                // Notify that the user has been approved.
                System.out.println("User has been approved!\n");
                break;

            case "DISPROVE":
                // Prepare and execute query to remove the user from the 'approvals' table for disapproval.
                disproveQuery = "DELETE FROM approvals WHERE userID = ?";
                psDisprove = sqlConn.prepareStatement(disproveQuery);
                psDisprove.setString(1, selectedUser.get("userID"));
                psDisprove.executeUpdate();

                // Notify that the user has been disproved.
                System.out.println("User has been disproved.\n");
                break;

            default:
                // Handle invalid approval input.
                System.out.println("Invalid choice. Please select 'approve' or 'disprove'.");
        }
    }

    // Method to manage user accounts based on the specified action.
    public void manageAccounts(String userType, String action, String id) throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Declare variables to hold query results and prepare statements.
        int rowsAffected;
        PreparedStatement ps;
        ResultSet rs;

        // Prepare SQL query to check if a user is activated or not.
        String checkActiveQuery = "SELECT activated FROM " + userType.toLowerCase() + " WHERE " + userType.toLowerCase() + "ID = ?";
        ps = sqlConn.prepareStatement(checkActiveQuery);
        ps.setString(1, id);
        rs = ps.executeQuery();

        // Check if the user exists in the database.
        if (!rs.next()) {
            System.out.println("User not found...");
            return;
        }

        // Retrieve the 'activated' status of the user.
        int activated = rs.getInt("activated");

        // Switch statement to handle different actions: ACTIVATE, DEACTIVATE, PASSWORD.
        switch (action) {
            case "ACTIVATE":
                // Check if the user is currently deactivated.
                if (activated == 0) {
                    // Prepare SQL query to activate the user.
                    String activateQuery = "UPDATE " + userType.toLowerCase() + " SET activated = 1 WHERE " + userType.toLowerCase() + "ID = ?";
                    ps = sqlConn.prepareStatement(activateQuery);
                    ps.setString(1, id);
                    rowsAffected = ps.executeUpdate();

                    // Check if the user activation was successful.
                    if (rowsAffected > 0) {
                        System.out.println("User activated!\n");
                    } else {
                        System.out.println("Error activating user...\n");
                    }
                } else {
                    System.out.println("User already activated.");
                }
                break;

            case "DEACTIVATE":
                // Check if the user is currently activated.
                if (activated == 1) {
                    // Prepare SQL query to deactivate the user.
                    String deactivateQuery = "UPDATE " + userType.toLowerCase() + " SET activated = 0 WHERE " + userType.toLowerCase() + "ID = ?";
                    ps = sqlConn.prepareStatement(deactivateQuery);
                    ps.setString(1, id);
                    rowsAffected = ps.executeUpdate();

                    // Check if the user deactivation was successful.
                    if (rowsAffected > 0) {
                        System.out.println("User deactivated!\n");
                    } else {
                        System.out.println("Error deactivating user...\n");
                    }
                } else {
                    System.out.println("User already deactivated.");
                }
                break;

            case "PASSWORD":
                // Generate a new password (assuming mainScreen.generatePassword() is a method to generate a password).
                String newPassword = mainScreen.generatePassword();
                // Prepare SQL query to reset the user's password.
                String updatePassQuery = "UPDATE " + userType.toLowerCase() + " SET password = ? WHERE " + userType.toLowerCase() + "ID = ?";
                ps = sqlConn.prepareStatement(updatePassQuery);
                ps.setString(1, newPassword);
                ps.setString(2, id);
                rowsAffected = ps.executeUpdate();

                // Check if the password reset was successful.
                if (rowsAffected > 0) {
                    System.out.println("User's password has been reset. The new password is: " + newPassword + "\n");
                } else {
                    System.out.println("Error resetting user password...\n");
                }
                break;
        }
    }

    // Method to assign a module to a lecturer.
    public void assignModuleToLecturer(String lecturerID, String moduleID) throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prepare SQL query to check if the lecturer is activated.
        String activatedQuery = "SELECT activated FROM lecturer WHERE lecturerID = ?";
        PreparedStatement ps = sqlConn.prepareStatement(activatedQuery);
        ps.setString(1, lecturerID);
        ResultSet rs = ps.executeQuery();

        // Check if the lecturer exists and is activated.
        if (rs.next() && rs.getBoolean("activated")) {
            // Prepare SQL query to check if the module exists.
            String getModuleQuery = "SELECT moduleName FROM module WHERE moduleID = ?";
            ps = sqlConn.prepareStatement(getModuleQuery);
            ps.setString(1, moduleID);
            rs = ps.executeQuery();

            // Check if the module exists.
            if (rs.next()) {
                // Prepare SQL query to assign the module to the lecturer.
                String moduleToLecturerQuery = "UPDATE lecturer SET moduleID = ? WHERE lecturerID = ?";
                PreparedStatement insertPs = sqlConn.prepareStatement(moduleToLecturerQuery);
                insertPs.setString(1, moduleID);
                insertPs.setString(2, lecturerID);
                int affectedRows = insertPs.executeUpdate();

                // Check if the module assignment was successful.
                if (affectedRows > 0) {
                    System.out.println("The module has been assigned successfully.");
                } else {
                    System.out.println("The module could not be assigned.");
                }
            } else {
                // Notify if the module code was not found.
                System.out.println("Error: Module code not found...");
            }
        } else {
            // Notify if the lecturer is not activated or not found.
            System.out.println("Error: Lecturer not activated or not found...");
        }
    }

    // Method to enroll students in a specified course.
    public void enrolStudents(String studentID, int courseID) throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prepare SQL query to check if the student is activated.
        String activatedQuery = "SELECT activated FROM student WHERE studentID = ?";
        PreparedStatement ps = sqlConn.prepareStatement(activatedQuery);
        ps.setString(1, studentID);
        ResultSet rs = ps.executeQuery();

        // Check if the student exists and is activated.
        if (rs.next() && rs.getBoolean("activated")) {
            // Prepare SQL query to check if the course exists.
            String getCourseQuery = "SELECT courseName FROM course WHERE courseID = ?";
            ps = sqlConn.prepareStatement(getCourseQuery);
            ps.setInt(1, courseID);
            rs = ps.executeQuery();

            // Check if the course exists.
            if (rs.next()) {
                // Prepare SQL query to enroll the student in the course.
                String sqlUpdate = "UPDATE student SET courseID = ? WHERE studentID = ? AND courseID IS NULL";
                PreparedStatement updatePs = sqlConn.prepareStatement(sqlUpdate);
                updatePs.setInt(1, courseID);
                updatePs.setString(2, studentID);

                // Execute the update and check if the enrollment was successful.
                int rowsAffected = updatePs.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("Enrollment Successful!");
                } else {
                    System.out.println("Enrollment Unsuccessful. The student might already be enrolled or IDs are incorrect.");
                }
            } else {
                // Notify if the course ID is not found or invalid.
                System.out.println("Error: Course ID not found or invalid.");
            }
        } else {
            // Notify if the student account is not activated or not found.
            System.out.println("Error: Student account not activated or not found...");
        }
    }

    // Method to issue a decision for a student.
    public void issueDecision() throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Declare variables for the student ID and activation status.
        String SID;
        boolean isActive;

        // Enter a loop to get a valid student ID.
        while (true) {
            System.out.println("Enter Student ID: ");
            SID = scanInput.next();  // Assuming scanInput is a Scanner object for input.

            // Prepare SQL query to check if the student is activated.
            String checkActive = "SELECT activated FROM student WHERE studentID = ?";

            // Use try for auto-closing the PreparedStatement.
            try (PreparedStatement psActive = sqlConn.prepareStatement(checkActive)) {
                psActive.setString(1, SID);
                ResultSet rs = psActive.executeQuery();

                // Check if the student exists and retrieve their activation status.
                if (rs.next()) {
                    isActive = rs.getInt("activated") == 1;
                    if (!isActive) {
                        System.out.println("Student ID " + SID + " is not activated. Please enter a valid Student ID.");
                        continue;
                    }
                } else {
                    System.out.println("Student ID does not exist. Please enter a valid Student ID.");
                    continue;
                }
            }
            // Exit the loop if the student is active.
            if (isActive) {
                break;
            }
        }

        // Get the decision from the user.
        scanInput.nextLine();  // Clear the input buffer.
        System.out.println("Please enter student decision: award, resit, or withdraw.");
        String decision = scanInput.nextLine().toUpperCase();

        // Prepare SQL query to update the student's decision.
        String sqlUpdate = "UPDATE student SET studentDecision = ? WHERE studentID = ?";

        // Use try for auto-closing the PreparedStatement.
        try (PreparedStatement ps = sqlConn.prepareStatement(sqlUpdate)) {
            // Handle different valid decisions.
            switch (decision) {
                case "AWARD", "RESIT", "WITHDRAW":
                    ps.setString(1, decision);
                    ps.setString(2, SID);
                    break;
                default:
                    // Handle invalid decisions.
                    System.out.println("Invalid decision. Please enter 'award', 'resit', or 'withdraw'.");
                    return;
            }

            // Execute the update and check if the decision was updated successfully.
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Decision '" + decision + "' updated successfully for Student ID: " + SID);
            } else {
                System.out.println("Decision update unsuccessful. Please check the Student ID and try again.");
            }
        } catch (SQLException e) {
            // Handle SQL exceptions.
            System.out.println("Decision update failed: " + e.getMessage());
        }
    }

    // Method to add a new business rule.
    public void addBusinessRule() {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prompt the user to enter a short description of the business rule.
        System.out.println("Enter a short description of your business rule: ");
        String description = scanInput.nextLine(); // Assuming scanInput is a Scanner object for input.

        // Prepare SQL query to insert the new business rule.
        String sqlInsert = "INSERT INTO businessRule (description) VALUES (?)";

        // Use try for auto-closing the PreparedStatement.
        try (PreparedStatement ps = sqlConn.prepareStatement(sqlInsert)) {
            // Set the description in the prepared statement.
            ps.setString(1, description);

            // Execute the insert query and check if the row was added successfully.
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Insert Successful!");
            }
        } catch (SQLException e) {
            // Handle SQL exceptions.
            System.out.println("Insert unsuccessful : " + e.getMessage());
        }
    }

    // Method to add a new course to the system.
    public void addNewCourse() throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prompt for and retrieve the course ID.
        System.out.println("Enter the Course ID:");
        int courseID = scanInput.nextInt();

        // Prompt for and retrieve the course name.
        System.out.println("Enter Course Name:");
        String courseName = scanInput.next();

        // Prompt for and retrieve the department ID.
        System.out.println("Enter the Department ID:");
        int departmentID = scanInput.nextInt();

        // Clear the input buffer before reading the next line.
        scanInput.nextLine();
        // Prompt for and retrieve the course description.
        System.out.println("Enter the Course Description:");
        String description = scanInput.nextLine();

        // Enter a loop to get a valid graduation level (Undergrad or Postgrad).
        gradLoop:
        while (true) {
            System.out.println("Enter course grad - Undergrad or Postgrad:");
            String grad = scanInput.next().toUpperCase();

            String sqlQuery;
            PreparedStatement ps;
            int rowsAffected;

            // Handle different graduation levels.
            switch (grad) {
                case "UNDERGRAD":
                    // Prepare SQL query to insert an undergraduate course.
                    sqlQuery = "INSERT INTO course (courseID, courseName, grad, departmentID, description) VALUES(?, ?, ?, ?, ?)";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setInt(1, courseID);
                    ps.setString(2, courseName);
                    ps.setString(3, "Undergraduate");
                    ps.setInt(4, departmentID);
                    ps.setString(5, description);

                    // Execute the insert query and check if the row was added successfully.
                    rowsAffected = ps.executeUpdate();
                    if (rowsAffected > 0) {
                        System.out.println("Insert Successful!");
                    }
                    break gradLoop;

                case "POSTGRAD":
                    // Prepare SQL query to insert a postgraduate course.
                    sqlQuery = "INSERT INTO course (courseID, courseName, grad, departmentID, description) VALUES(?, ?, ?, ?, ?)";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setInt(1, courseID);
                    ps.setString(2, courseName);
                    ps.setString(3, "Postgraduate");
                    ps.setInt(4, departmentID);
                    ps.setString(5, description);

                    // Execute the insert query and check if the row was added successfully.
                    rowsAffected = ps.executeUpdate();
                    if (rowsAffected > 0) {
                        System.out.println("Insert Successful!");
                    }
                    break gradLoop;

                default:
                    // Handle invalid graduation level input.
                    System.out.println("Error must be either Undergrad or Postgrad..." + grad);
            }
        }
    }

    // Method to add a new module to the system.
    public void addModule() throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prompt for and retrieve the module ID.
        System.out.println("Enter the module code:");
        int moduleID = scanInput.nextInt();

        // Prompt for and retrieve the module name.
        System.out.println("Enter the module name:");
        String moduleName = scanInput.next();

        // Prompt for and retrieve the credit points.
        System.out.println("Enter the credit points:");
        int creditPoints = scanInput.nextInt();

        // Prompt for and retrieve the rule ID.
        System.out.println("Enter the rule ID:");
        int ruleID = scanInput.nextInt();

        // Prompt for and retrieve the semester information.
        System.out.println("Is the module over semester 1, 2 or 1&2?");
        String semester = scanInput.next();

        // Ensure that the entered semester value is valid.
        while (!(semester.equals("1") || semester.equals("1&2") || semester.equals("2"))) {
            System.out.println("Please enter 1, 1&2 or 2: ");
            semester = scanInput.next();
        }

        // Prepare SQL query to insert the new module.
        String sqlQuery = "INSERT INTO module (moduleID, moduleName, creditPoints, ruleID, semester) VALUES(?, ?, ?, ?, ?)";
        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
        ps.setInt(1, moduleID);
        ps.setString(2, moduleName);
        ps.setInt(3, creditPoints);
        ps.setInt(4, ruleID);
        ps.setString(5, semester);

        // Execute the insert query and check if the row was added successfully.
        int rowsAffected = ps.executeUpdate();
        if (rowsAffected > 0) {
            System.out.println("Insert Successful!");
        }
    }

    // Method to assign a module to a course.
    public void assignModuleToCourse() {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prompt for and retrieve the module ID.
        System.out.println("Enter the module ID of the module you would like to assign:");
        String moduleID = scanInput.next();

        // SQL queries to check if the module and course exist and to update the association.
        String selectModuleSQL = "SELECT * FROM module WHERE moduleID = ?";
        String selectCourseSQL = "SELECT * FROM course WHERE courseID = ?";
        String updateAssocSQL = "INSERT INTO cmAssociation (courseID, moduleID) VALUES (?, ?)";

        PreparedStatement ps;
        ResultSet rs;

        try {
            // Check if the module ID exists.
            ps = sqlConn.prepareStatement(selectModuleSQL);
            ps.setString(1, moduleID);
            rs = ps.executeQuery();

            if (!rs.next()) {
                System.out.println("Error: module ID not found");
                return;
            }

            // Prompt for and retrieve the course ID.
            System.out.println("Enter the course ID you would like to assign module (" + moduleID + ") to:");
            String courseID = scanInput.next();

            // Check if the course ID exists.
            ps = sqlConn.prepareStatement(selectCourseSQL);
            ps.setString(1, courseID);
            rs = ps.executeQuery();

            if (!rs.next()) {
                System.out.println("Error: course ID not found");
                return;
            }

            // Associate the module with the course.
            ps = sqlConn.prepareStatement(updateAssocSQL);
            ps.setString(1, courseID);
            ps.setString(2, moduleID);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated > 0) {
                System.out.println("Module assigned to course successfully.");
            } else {
                System.out.println("Module was not assigned. Please check your data.");
            }

        } catch (SQLException e) {
            // Handle SQL exceptions.
            System.out.println("SQL Error: " + e.getMessage());
        }
    }

    // Method to display the details of a specific course, including its associated modules.
    public void displayCourseDetails() throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Data structure to store module details.
        ArrayList<ArrayList<String>> modules = new ArrayList<>();

        // Prompt for and retrieve the course ID.
        System.out.println("Enter the course ID of the course you would like to display the details of:");
        String courseID = scanInput.next();
        String courseName = "";

        // SQL query to get course details.
        String sqlQuery = "SELECT * FROM course WHERE courseID = ?";
        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
        ps.setString(1, courseID);
        ResultSet rs = ps.executeQuery();

        // Retrieve and store the course name if the course is found.
        if (rs.next()) {
            courseName = rs.getString("courseName");
        } else {
            System.out.println("Couldn't find a course with that course ID");
            return;
        }

        // SQL query to get associated module IDs from cmAssociation table.
        sqlQuery = "SELECT moduleID FROM cmAssociation WHERE courseID = ?";
        ps = sqlConn.prepareStatement(sqlQuery);
        ps.setString(1, courseID);
        rs = ps.executeQuery();

        // Retrieve and process each module associated with the course.
        while (rs.next()) {
            // SQL query to get module details.
            String moduleQuery = "SELECT * FROM module WHERE moduleID = ?";
            PreparedStatement modulePs = sqlConn.prepareStatement(moduleQuery);

            modulePs.setInt(1, rs.getInt("moduleID"));
            ResultSet moduleRs = modulePs.executeQuery();

            // Store module details if found.
            if (moduleRs.next()) {
                String moduleName = moduleRs.getString("moduleName");
                String semester = moduleRs.getString("semester");

                ArrayList<String> module = new ArrayList<>();
                module.add(moduleName);
                module.add(semester);

                modules.add(module);
            }
        }

        // Display the course and its modules.
        if (modules.isEmpty()) {
            System.out.println("Course has no modules...\n");
        } else {
            System.out.println(courseName);
            for (ArrayList<String> module : modules) {
                if (module.get(1).equals("1&2")) {
                    System.out.println("\t" + module.get(0) + " " + "Semester 1 & Semester 2");
                } else {
                    System.out.println("\t" + module.get(0) + " " + "Semester " + module.get(1));
                }
            }
            System.out.println("\n");
        }
    }

    // Method to update the description of a specific course.
    public void updateCourseInfo() {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        try {
            // Prompt for and retrieve the course ID to be updated.
            System.out.println("Enter the Course ID of the course you want to update:");
            int courseID = scanInput.nextInt();

            // SQL query to select the current course description.
            String selectQuery = "SELECT description FROM course WHERE courseID = ?";
            PreparedStatement psSelect = sqlConn.prepareStatement(selectQuery);
            psSelect.setInt(1, courseID);
            ResultSet rs = psSelect.executeQuery();

            // Check if the course exists and retrieve its current description.
            if (rs.next()) {
                String currentDescription = rs.getString("description");
                System.out.println("Current Course Description: " + currentDescription + "\n");

                // Prompt for the new course description.
                scanInput.nextLine();  // Clear the input buffer.
                System.out.println("Enter new course description:");
                String newDescription = scanInput.nextLine();

                // SQL query to update the course description.
                String updateQuery = "UPDATE course SET description = ? WHERE courseID = ?";
                PreparedStatement psUpdate = sqlConn.prepareStatement(updateQuery);
                psUpdate.setString(1, newDescription);
                psUpdate.setInt(2, courseID);

                // Execute the update and check if the description was updated successfully.
                int affectedRows = psUpdate.executeUpdate();
                if (affectedRows > 0) {
                    System.out.println("Course description updated successfully!");
                } else {
                    System.out.println("Course description update failed. No changes were made.");
                }
            } else {
                System.out.println("No course found with ID: " + courseID);
            }

            // Close the prepared statement and result set.
            psSelect.close();
            rs.close();
        } catch (SQLException e) {
            // Handle SQL exceptions.
            System.out.println("An error occurred updating the course description: " + e.getMessage());
        }
    }

    // Method to display the details of a specific module.
    public void displayModuleDetails() throws SQLException {
        // Reinitialize 'currentManager' with the current manager's details.
        currentManager = new Manager(this.ID, this.forename, this.surname, this.gender, this.dob, this.email, this.password);

        // Prompt for and retrieve the module ID.
        System.out.println("Enter the moduleID of the module you would like to display the details of:");
        String moduleID = scanInput.next();

        // SQL query to select the details of the module.
        String sqlQuery = "SELECT * FROM module WHERE moduleID = ?";
        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
        ps.setString(1, moduleID);
        ResultSet rs = ps.executeQuery();

        // Check if the module exists and retrieve its details.
        if (rs.next()) {
            // Retrieve and display the module details.
            String modCode = rs.getString("moduleID");
            String modName = rs.getString("moduleName");
            int credPoints = rs.getInt("creditPoints");

            System.out.println("Module Code: " + modCode);
            System.out.println("Module Name: " + modName);
            System.out.println("Credit Points: " + credPoints);
        } else {
            System.out.println("Couldn't find the module with moduleID: " + moduleID);
        }

        System.out.println("\n");
    }
}
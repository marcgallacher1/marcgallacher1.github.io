import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

// Extends the User class to include specific attributes and behaviors for a Lecturer.
public class Lecturer extends User {

    private String qualification; // Qualification of the lecturer.
    Lecturer currentLecturer; // Reference to the current lecturer instance.

    // Constructor to initialize a Lecturer object with given parameters.
    public Lecturer(String ID, String forename, String surname, String gender, String email, String dob, String qualification, String password) {
        // Setters inherited from the User class to initialize fields.
        setID(ID);
        setForename(forename);
        setSurname(surname);
        setGender(gender);
        setEmail(email);
        setDob(dob);
        setQualification(qualification);
        setPassword(password);
    }

    // Getter for qualification.
    public String getQualification() {
        return qualification;
    }

    // Setter for qualification.
    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    // Method to update the password of the lecturer.
    public void updatePassword(String oldPass, String newPass, String confirmPass) {
        // Re-instantiating currentLecturer
        currentLecturer = new Lecturer(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.qualification, this.password);

        try {
            // SQL query to check existing password.
            String sqlQuery = "SELECT * FROM lecturer WHERE lecturerID = ? AND password = ?";
            PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
            ps.setString(1, getID());
            ps.setString(2, oldPass);
            ResultSet rs = ps.executeQuery();

            // Check if old password matches and new passwords are the same.
            if (rs.next()) {
                if (confirmPass.equals(newPass)) {
                    // SQL query to update the password.
                    sqlQuery = "UPDATE lecturer SET password = ? WHERE lecturerID = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, newPass);
                    ps.setString(2, getID());
                    int rowsUpdated = ps.executeUpdate();

                    // Confirm password update.
                    if (rowsUpdated > 0) {
                        System.out.println("Password updated successfully!");
                    } else {
                        System.out.println("Password update failed");
                    }
                } else {
                    System.out.println("Confirmed password does not match the new password entered...");
                }
            } else {
                System.out.println("Invalid current password.");
            }
        } catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());
        }
    }

    // Method to update module information.
    public void updateModuleInfo(int fieldChange, String input) throws SQLException {

        // Re-instantiating currentLecturer
        currentLecturer = new Lecturer(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.qualification, this.password);

        try {
            // SQL query to get module ID.
            String sqlQuery = "SELECT moduleID FROM lecturer WHERE lecturerID = ?";
            PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
            ps.setString(1, getID());
            ResultSet rs = ps.executeQuery();

            // Process if the lecturer has a module assigned.
            if (rs.next()) {
                int moduleID = rs.getInt("moduleID");

                // Handling the case where the lecturer is not assigned any module.
                if (rs.getString("moduleID") == null) {
                    System.out.println("You haven't been assigned a module yet.");
                } else {
                    String updateQuery;
                    int rowsUpdated;
                    // Switch case based on what field needs to be changed.
                    switch (fieldChange) {
                        case 1:

                            // SQL query to update module name.
                            updateQuery = "UPDATE module SET moduleName = ? WHERE moduleID = ?";
                            ps = sqlConn.prepareStatement(updateQuery);
                            ps.setString(1, input);
                            ps.setInt(2, moduleID);
                            rowsUpdated = ps.executeUpdate();
                            break;

                        case 2:

                            // SQL query to update module credit points.
                            updateQuery = "UPDATE module SET creditPoints = ? WHERE moduleID = ?";
                            ps = sqlConn.prepareStatement(updateQuery);
                            ps.setInt(1, Integer.parseInt(input));
                            ps.setInt(2, moduleID);
                            rowsUpdated = ps.executeUpdate();
                            break;

                        case 3:

                            // SQL query to update module semester.
                            updateQuery = "UPDATE module SET semester = ? WHERE moduleID = ?";
                            ps = sqlConn.prepareStatement(updateQuery);
                            ps.setString(1, input);
                            ps.setInt(2, moduleID);
                            rowsUpdated = ps.executeUpdate();
                            break;

                        case 4:
                            // Option to return without making any changes.
                            return;

                        default:
                            System.out.println("Invalid option.");
                            return;
                    }

                    // Confirm update status.
                    if (rowsUpdated > 0) {
                        System.out.println("Update successful!");
                    } else {
                        System.out.println("Update failed.");
                    }
                }
            } else {
                System.out.println("No modules found for the lecturer.");
            }
        } catch (SQLException e) {
            // Catch SQL specific exceptions.
            e.printStackTrace();
            System.out.println("An error occurred while updating the module.");
        } catch (NumberFormatException e) {
            // Catch number format exceptions.
            e.printStackTrace();
            System.out.println("Invalid number format.");
        } catch (Exception e) {
            // Catch all other exceptions.
            e.printStackTrace();
            System.out.println("An unexpected error occurred.");
        }
    }
    // Method for uploading or updating educational material for a module.
    public void uploadOrUpdateMaterial(int UU, String lecOrLab, int weekNo, String newNote) throws SQLException {
        // Re-instantiating the current lecturer.
        currentLecturer = new Lecturer(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.qualification, this.password);

        // SQL query to fetch the module ID associated with the lecturer.
        String sqlQuery = "SELECT moduleID FROM lecturer WHERE lecturerID = ?";
        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
        ps.setString(1, getID());
        ResultSet rs = ps.executeQuery();

        // Check if the lecturer is associated with a module.
        if (rs.next()) {

            int moduleID = rs.getInt("moduleID");
            String uploadQuery;
            String updateQuery;
            int rowsAffected;

            // Loop to handle upload (1) or update (2) operations.
            uploadUpdateLoop:
            while (true) {
                switch (UU) {

                    case 1:

                        switch (lecOrLab) {

                            case "LECTURE": // Uploading lecture materials.

                                uploadQuery = "INSERT INTO material (moduleID, type, week, note) VALUES (?, ?, ?, ?)";
                                ps = sqlConn.prepareStatement(uploadQuery);
                                ps.setInt(1, moduleID);
                                ps.setString(2, "lecture");
                                ps.setInt(3, weekNo);
                                ps.setString(4, newNote);
                                rowsAffected = ps.executeUpdate();

                                if (rowsAffected > 0) {
                                    System.out.println("Uploaded successfully!\n");

                                    String studentInModuleQuery = "SELECT * FROM student, cmAssociation WHERE student.courseID = cmAssociation.courseID AND moduleID = ?";
                                    ps = sqlConn.prepareStatement(studentInModuleQuery);
                                    ps.setInt(1, moduleID);
                                    rs = ps.executeQuery();

                                    while (rs.next()) {
                                        Student student = new Student(rs.getString("studentID"), rs.getString("forename"), rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getString("dateOfBirth"), rs.getString("password"));
                                        student.notifyMe(newNote, "uploaded");
                                    }

                                } else {
                                    System.out.println("Upload unsuccessful...\n");
                                }

                                break uploadUpdateLoop;

                            case "LAB": // Uploading lab materials.

                                uploadQuery = "INSERT INTO material (moduleID, type, week, note) VALUES (?, ?, ?, ?)";
                                ps = sqlConn.prepareStatement(uploadQuery);
                                ps.setInt(1, moduleID);
                                ps.setString(2, "lab");
                                ps.setInt(3, weekNo);
                                ps.setString(4, newNote);

                                rowsAffected = ps.executeUpdate();

                                if (rowsAffected > 0) {
                                    System.out.println("Uploaded successfully!\n");

                                    String studentInModuleQuery = "SELECT * FROM student, cmAssociation WHERE student.courseID = cmAssociation.courseID AND moduleID = ?";
                                    ps = sqlConn.prepareStatement(studentInModuleQuery);
                                    ps.setInt(1, moduleID);
                                    rs = ps.executeQuery();

                                    while (rs.next()) {
                                        Student student = new Student(rs.getString("studentID"), rs.getString("forename"), rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getString("dateOfBirth"), rs.getString("password"));
                                        student.notifyMe(newNote, "uploaded");
                                    }

                                } else {
                                    System.out.println("Upload unsuccessful...\n");
                                }

                                break uploadUpdateLoop;

                            default:
                                System.out.println("Please enter either 'LECTURE' or 'LAB' to continue...\n");
                        }

                    case 2:

                        switch (lecOrLab) {

                            case "LECTURE": // Updating lecture materials.

                                updateQuery = "UPDATE material SET note = ? WHERE moduleID = ? AND type = ? AND week = ?";
                                ps = sqlConn.prepareStatement(updateQuery);
                                ps.setString(1, newNote);
                                ps.setInt(2, moduleID);
                                ps.setString(3, "lecture");
                                ps.setInt(4, weekNo);

                                rowsAffected = ps.executeUpdate();

                                if (rowsAffected > 0) {
                                    System.out.println("Updated successfully!\n");

                                    String studentInModuleQuery = "SELECT * FROM student, cmAssociation WHERE student.courseID = cmAssociation.courseID AND moduleID = ?";
                                    ps = sqlConn.prepareStatement(studentInModuleQuery);
                                    ps.setInt(1, moduleID);
                                    rs = ps.executeQuery();

                                    while (rs.next()) {
                                        Student student = new Student(rs.getString("studentID"), rs.getString("forename"), rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getString("dateOfBirth"), rs.getString("password"));
                                        student.notifyMe(newNote, "updated");
                                    }

                                } else {
                                    System.out.println("Update unsuccessful...\n");
                                }

                                break uploadUpdateLoop;

                            case "LAB": // Updating lab materials.

                                updateQuery = "UPDATE material SET note = ? WHERE moduleID = ? AND type = ? AND week = ?";
                                ps = sqlConn.prepareStatement(updateQuery);
                                ps.setString(1, newNote);
                                ps.setInt(2, moduleID);
                                ps.setString(3, "lab");
                                ps.setInt(4, weekNo);

                                rowsAffected = ps.executeUpdate();

                                if (rowsAffected > 0) {
                                    System.out.println("Updated successfully!\n");

                                    String studentInModuleQuery = "SELECT * FROM student, cmAssociation WHERE student.courseID = cmAssociation.courseID AND moduleID = ?";
                                    ps = sqlConn.prepareStatement(studentInModuleQuery);
                                    ps.setInt(1, moduleID);
                                    rs = ps.executeQuery();

                                    while (rs.next()) {
                                        Student student = new Student(rs.getString("studentID"), rs.getString("forename"), rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getString("dateOfBirth"), rs.getString("password"));
                                        student.notifyMe(newNote, "updated");
                                    }

                                } else {
                                    System.out.println("Update unsuccessful...\n");
                                }

                                break uploadUpdateLoop;

                            default:
                                System.out.println("Please enter either 'LECTURE' or 'LAB' to continue...\n");
                        }

                    case 3:
                        // Exiting the method in case of invalid input or completion.
                        return;

                    default:

                        System.out.println("Error: please type either upload or update...");


                }
            }

        }

    }
    // Method to display students enrolled in the lecturer's module.
    public void displayEnrolledStudents() throws SQLException {

        // Re-instantiating the current lecturer.
        currentLecturer = new Lecturer(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.qualification, this.password);

        // SQL query to get the module ID for the current lecturer.
        String sqlQuery = "SELECT moduleID FROM lecturer WHERE lecturerID = ?";
        PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
        ps.setString(1, getID());
        ResultSet rs = ps.executeQuery();

        // Check if a module is associated with the lecturer.
        if (rs.next()) {

            int moduleID = rs.getInt("moduleID");

            // SQL query to get details of students enrolled in the module.
            sqlQuery = "SELECT forename, surname FROM student, cmAssociation WHERE student.courseID = cmAssociation.courseID AND moduleID = ?";
            ps = sqlConn.prepareStatement(sqlQuery);
            ps.setInt(1, moduleID);
            rs = ps.executeQuery();

            boolean hasStudents = false;
            // Loop through each student and display their name.
            while (rs.next()) {
                hasStudents = true;
                String forename = rs.getString("forename");
                String surname = rs.getString("surname");
                System.out.println(" - " + forename + " " + surname);
            }
            // Message if no students are enrolled.
            if (!hasStudents) {
                System.out.println("No students enrolled in your module...");
            }

        }

        System.out.println("\n");

    }
    // Method to update exam records for students in the lecturer's module.
    public void updateExamRecord() throws SQLException {
        // Re-instantiating the current lecturer.
        currentLecturer = new Lecturer(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.qualification, this.password);

        // Continuously loop until an exit condition is met.
        while (true) {

            // SQL query to fetch module ID.
            String sqlQuery = "SELECT moduleID FROM lecturer WHERE lecturerID = ?";
            PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
            ps.setString(1, getID());
            ResultSet rs = ps.executeQuery();

            // Check if the lecturer is assigned to a module.
            if (rs.next()) {
                int moduleID = rs.getInt("moduleID");

                // SQL query to get a list of students enrolled in the module.
                sqlQuery = "SELECT studentID, forename, surname, gender, email, dateOfBirth FROM student, cmAssociation WHERE student.courseID = cmAssociation.courseID AND moduleID = ?";
                ps = sqlConn.prepareStatement(sqlQuery);
                ps.setInt(1, moduleID);
                rs = ps.executeQuery();
                List<Map<String, String>> students = new ArrayList<>();
                System.out.println("Students:\n");
                int count = 1;

                // Displaying each student's details.
                while (rs.next()) {
                    Map<String, String> currentStudent = new HashMap<>();
                    currentStudent.put("studentID", rs.getString("studentID"));
                    currentStudent.put("forename", rs.getString("forename"));
                    currentStudent.put("surname", rs.getString("surname"));
                    currentStudent.put("gender", rs.getString("gender"));
                    currentStudent.put("email", rs.getString("email"));
                    currentStudent.put("dateOfBirth", rs.getString("dateOfBirth"));

                    System.out.println(count + ". " + "Student Name: " + currentStudent.get("forename") + " " + currentStudent.get("surname"));
                    System.out.println("Gender: " + currentStudent.get("gender"));
                    System.out.println("Email: " + currentStudent.get("email"));
                    System.out.println("DOB: " + currentStudent.get("dateOfBirth"));
                    System.out.println("\n");

                    students.add(currentStudent);

                    count++;
                }

                // Loop to allow the lecturer to select a student and update their marks.
                System.out.println("Please type a number you would like to select, or 'exit' to exit:");
                String inputNum = scanInput.next().toUpperCase();

                if (inputNum.equals("EXIT")) {
                    break;
                }

                // Check if the selected index is within the range of the student list.
                int index = Integer.parseInt(inputNum) - 1;

                if (index >= 0 && index < students.size()) {
                    Map<String, String> selectedStudent = students.get(index);

                    // Prompt for entering lab and exam marks.
                    System.out.println("Enter the lab mark:");
                    String labMark = scanInput.next().toUpperCase();

                    System.out.println("Enter the exam mark:");
                    String examMark = scanInput.next().toUpperCase();

                    // SQL query to check if there's an existing record for the student.
                    String checkRecord = "SELECT * FROM examRecord WHERE studentID = ? AND moduleID = ?";
                    PreparedStatement recordPS = sqlConn.prepareStatement(checkRecord);
                    recordPS.setString(1, selectedStudent.get("studentID"));
                    recordPS.setInt(2, moduleID);
                    ResultSet recordRs = recordPS.executeQuery();

                    // Update or insert new exam record based on whether it already exists.
                    if (recordRs.next()) {
                        // Update existing record.
                        String markQuery = "UPDATE examRecord SET labMark = ?, examMark = ? WHERE studentID = ? AND moduleID = ?";
                        PreparedStatement markPS = sqlConn.prepareStatement(markQuery);

                        markPS.setString(1, labMark);
                        markPS.setString(2, examMark);
                        markPS.setString(3, selectedStudent.get("studentID"));
                        markPS.setInt(4, moduleID);
                        int rowsAffected = markPS.executeUpdate();

                        if (rowsAffected > 0) {
                            System.out.println("Lab and exam mark updated successfully!\n");
                        } else {
                            System.out.println("Error updating exam records...\n");
                        }
                        break;
                    } else {
                        // Insert new exam record.
                        String markQuery = "INSERT INTO examRecord (studentID, moduleID, labMark, examMark) VALUES (?, ?, ?, ?)";
                        PreparedStatement markPS = sqlConn.prepareStatement(markQuery);

                        markPS.setString(1, selectedStudent.get("studentID"));
                        markPS.setInt(2, moduleID);
                        markPS.setString(3, labMark);
                        markPS.setString(4, examMark);
                        int rowsAffected = markPS.executeUpdate();

                        if (rowsAffected > 0) {
                            System.out.println("Lab and exam mark updated successfully!\n");
                        } else {
                            System.out.println("Error updating exam records...\n");
                        }
                        break;
                    }
                } else {
                    System.out.println("Invalid selection. Please enter a valid number or 'exit'.");
                }
            }

        }

    }

}

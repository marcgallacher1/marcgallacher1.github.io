import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;

// Student class extending User, representing a student in an educational system.
public class Student extends User {

    Student currentStudent;

    // Constructor to initialize a new Student object with personal and account information.
    public Student(String ID, String forename, String surname, String gender, String email, String dob, String password) {
        setID(ID);
        setForename(forename);
        setSurname(surname);
        setGender(gender);
        setEmail(email);
        setDob(dob);
        setPassword(password);
    }

    // Method to notify the student about updates or uploads of materials.
    public void notifyMe(String note, String uploadOrUpdate) {
        System.out.println("Student with ID(" + this.getID() + ") " +
                "Please note that materials were " + uploadOrUpdate + " with note: '"
                + note + "'");
    }

    // Method to update the password of the student.
    public void updatePassword(String oldPass, String newPass, String confirmPass) {
        // Reusing the current student's data to create a new Student object.
        currentStudent = new Student(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.password);

        try {
            // SQL query to check if the old password matches the one in the database.
            String sqlQuery = "SELECT * FROM student WHERE studentID = ? AND password = ?";
            PreparedStatement ps = sqlConn.prepareStatement(sqlQuery);
            ps.setString(1, getID());
            ps.setString(2, oldPass);
            ResultSet rs = ps.executeQuery();

            // Check if the old password is correct and new passwords match.
            if (rs.next()) {
                if (!confirmPass.equals(newPass)) {
                    System.out.println("Confirmed password does not match the new password entered...");
                } else {
                    // SQL query to update the password in the database.
                    sqlQuery = "UPDATE student SET password = ? WHERE studentID = ?";
                    ps = sqlConn.prepareStatement(sqlQuery);
                    ps.setString(1, newPass);
                    ps.setString(2, getID());
                    int rowsUpdated = ps.executeUpdate();
                    if (rowsUpdated > 0) {
                        System.out.println("Password updated successfully!");
                    } else {
                        System.out.println("Password update failed!");
                    }
                }
            } else {
                System.out.println("Invalid current password.");
            }
        } catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());
        }
    }

    // Method for a student to view their marks.
    public void viewMarks() {
        // Creating a new instance of Student for the current session.
        currentStudent = new Student(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.password);

        PreparedStatement ps;
        ResultSet rs;

        try {
            // SQL query to check for exam records of the student.
            String checkExamRecord = "SELECT * FROM examRecord WHERE studentID = ?";
            ps = sqlConn.prepareStatement(checkExamRecord);
            ps.setString(1, getID());
            ResultSet rsRecords = ps.executeQuery();

            if (!rsRecords.next()) {
                System.out.println("No marks have been released...\n");
                return;
            }

            // SQL query to get the course name associated with the student.
            String courseNameQuery = "SELECT courseName FROM course, student WHERE course.courseID = student.courseID AND student.studentID = ?";
            ps = sqlConn.prepareStatement(courseNameQuery);
            ps.setString(1, getID());
            rs = ps.executeQuery();

            // Processing each course and its marks.
            while (rs.next()) {
                String courseName = rs.getString("courseName");
                System.out.println("Course Name: " + courseName);

                PreparedStatement marksPs = null;
                ResultSet marksRs = null;
                try {
                    // Query to get module ID, lab mark, and exam mark for each course.
                    String getMarksQuery = "SELECT moduleID, labMark, examMark FROM examRecord WHERE studentID =?";
                    marksPs = sqlConn.prepareStatement(getMarksQuery);
                    marksPs.setString(1, getID());
                    marksRs = marksPs.executeQuery();

                    // Displaying marks for each module.
                    while (marksRs.next()) {
                        String moduleID = marksRs.getString("moduleID");
                        int labMark = marksRs.getInt("labMark");
                        int examMark = marksRs.getInt("examMark");
                        String lab = Integer.toString(labMark);
                        String exam = Integer.toString(examMark);
                        if (labMark == 0) {
                            lab = "You have not been assigned a lab mark...\n";
                        }
                        if (examMark == 0) {
                            exam = "You have not been assigned an exam mark...\n";
                        }
                        System.out.println("Module ID: " + moduleID + ", Lab Mark: " + lab + ", Exam Mark: " + exam + "\n");
                    }
                } catch (SQLException e) {
                    System.out.println("SQL Exception : " + e.getMessage());
                } finally {
                    // Closing the PreparedStatement and ResultSet.
                    try {
                        if (marksRs != null) marksRs.close();
                        if (marksPs != null) marksPs.close();
                    } catch (SQLException e) {
                        System.out.println("SQL Exception on close: " + e.getMessage());
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.getMessage());
        }
    }

    // Method for a student to download notes for a specific module.
    public void downloadNote(String moduleName, String lecOrLab, int weekNo) {
        try {
            // Query to find the module ID based on the module name.
            String moduleIDQuery = "SELECT moduleID FROM module WHERE moduleName =?";
            PreparedStatement ps = sqlConn.prepareStatement(moduleIDQuery);
            ps.setString(1, moduleName);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String moduleID = rs.getString("moduleID");

                String noteQuery = "";
                // Constructing different queries based on whether it's a lecture or lab.
                if ("LECTURE".equals(lecOrLab)) {
                    noteQuery = "SELECT note FROM material WHERE moduleID = ? AND type = 'Lecture' AND week = ?";
                } else if ("LAB".equals(lecOrLab)) {
                    noteQuery = "SELECT note FROM material WHERE moduleID = ? AND type = 'Lab' AND week = ?";
                }

                ps = sqlConn.prepareStatement(noteQuery);
                ps.setString(1, moduleID);
                ps.setInt(2, weekNo);

                rs = ps.executeQuery();

                // Displaying the note if found.
                if (rs.next()) {
                    String note = rs.getString("note");
                    System.out.println(note);
                } else {
                    System.out.println("No note found for the specified week and module.");
                }
            } else {
                System.out.println("No module found with that name.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Method to view the decision related to the student.
    public void viewDecision() {
        // Reusing current student's data.
        currentStudent = new Student(this.ID, this.forename, this.surname, this.gender, this.email, this.dob, this.password);

        PreparedStatement ps;
        ResultSet rs;

        try {
            // SQL query to retrieve the student's decision.
            String getDecisionQuery = "SELECT studentDecision FROM student WHERE studentID = ?";
            ps = sqlConn.prepareStatement(getDecisionQuery);
            ps.setString(1, getID());
            rs = ps.executeQuery();

            // Displaying the decision.
            if (rs.next()) {
                String decision = rs.getString("studentDecision");
                System.out.println("Student Decision: " + decision + "\n");
            } else {
                System.out.println("Decision not made.\n");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("An error occurred while fetching the student's decision.");
        }
    }
}

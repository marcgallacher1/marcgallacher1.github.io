import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ManagerTest {

    // Database connection and prepared statement declarations
    public static Connection mySqlConn;
    public static PreparedStatement ps;
    public static int rowsAffected;
    public static Manager currentManager;
    public static ResultSet rs;
    public static Student student;
    public static Lecturer lecturer;
    public static Student student2;

    // Setup before all tests: Establishes database connection and initializes test data
    @BeforeAll
    static void setup() throws SQLException {
        // Establishing connection to the database
        mySqlConn = databaseConnection.getMySqlConnection();

        // Creating a Manager object for testing
        currentManager = new Manager("1234", "Bob", "Harley", "male", "bob.harley27@gmail.com", "12/12/1995", "Password123");

        // Inserting a manager record into the database for testing
        String insertTest = "INSERT INTO manager (managerID, forename, surname, gender, email, dateOfBirth, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertTest);
        ps.setString(1, currentManager.getID());
        ps.setString(2, currentManager.getForename());
        ps.setString(3, currentManager.getSurname());
        ps.setString(4, currentManager.getGender());
        ps.setString(5, currentManager.getEmail());
        ps.setString(6, currentManager.getDob());
        ps.setString(7, currentManager.getPassword());
        rowsAffected = ps.executeUpdate();

        // Creating Student and Lecturer objects for testing
        student = new Student("123", "Student", "Test", "male", "test123@test.com", "24/10/2007", "pass123");
        lecturer = new Lecturer("321", "Lecturer", "Test", "female", "test321@test.com", "21/03/1985", "PhD", "pass321");
        student2 = new Student("124", "Student", "Test", "male", "test124@test.com", "16/12/2002", "pass124");

        // Inserting approval records into the database for testing
        String insertApprovalTest = "INSERT INTO approvals (userID, forename, surname, gender, email, dateOfBirth, qualification, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertApprovalTest);
        // Setting parameters for the first student
        ps.setString(1, student.getID());
        ps.setString(2, student.getForename());
        ps.setString(3, student.getSurname());
        ps.setString(4, student.getGender());
        ps.setString(5, student.getEmail());
        ps.setString(6, student.getDob());
        ps.setString(7, null);
        ps.setString(8, student.getPassword());
        // Setting parameters for the lecturer
        ps.setString(9, lecturer.getID());
        ps.setString(10, lecturer.getForename());
        ps.setString(11, lecturer.getSurname());
        ps.setString(12, lecturer.getGender());
        ps.setString(13, lecturer.getEmail());
        ps.setString(14, lecturer.getDob());
        ps.setString(15, lecturer.getQualification());
        ps.setString(16, lecturer.getPassword());
        // Setting parameters for the second student
        ps.setString(17, student2.getID());
        ps.setString(18, student2.getForename());
        ps.setString(19, student2.getSurname());
        ps.setString(20, student2.getGender());
        ps.setString(21, student2.getEmail());
        ps.setString(22, student2.getDob());
        ps.setString(23, null);
        ps.setString(24, student2.getPassword());
        ps.executeUpdate();
    }

    // Teardown after all tests: Cleans up database to prevent data pollution
    @AfterAll
    static void cleanUp() throws SQLException {
        // Deleting test data from the 'student' table
        String deleteStudents = "DELETE FROM student WHERE studentID = '123' OR studentID = '124' OR studentID = 'testManage'";
        ps = mySqlConn.prepareStatement(deleteStudents);
        ps.executeUpdate();

        // Deleting test data from the 'lecturer' table
        String deleteLecturer = "DELETE FROM lecturer WHERE lecturerID = '321'";
        ps = mySqlConn.prepareStatement(deleteLecturer);
        ps.executeUpdate();

        // Deleting test data from the 'approvals' table
        String deleteApprovals = "DELETE FROM approvals WHERE userID = '123' OR userID = '321' OR userID = '124'";
        ps = mySqlConn.prepareStatement(deleteApprovals);
        ps.executeUpdate();

        // Deleting test data from the 'manager' table
        String deleteManager = "DELETE FROM manager WHERE managerID = 1234";
        ps = mySqlConn.prepareStatement(deleteManager);
        ps.executeUpdate();
    }

    // Test for updating a manager's password
    @Test
    void updatePassword() throws SQLException {
        // Updating the manager's password and verifying the change
        currentManager.updatePassword("Password123", "Password321", "Password321");

        // Query to fetch the updated password from the database
        String passQuery = "SELECT * FROM manager WHERE managerID = ?";
        ps = mySqlConn.prepareStatement(passQuery);
        ps.setString(1, currentManager.getID());

        rs = ps.executeQuery();

        // Asserting that the password has been updated successfully
        if (rs.next()) {
            assertEquals(rs.getString("password"), "Password321");
        }
    }

    // Test for viewing the manager's workflow (approvals)
    @Test
    void viewWorkflowTest() throws SQLException {
        // Query to fetch approval records for testing
        String getApprovals = "SELECT * FROM approvals";
        ps = mySqlConn.prepareStatement(getApprovals);
        rs = ps.executeQuery();

        // Expected output format for approvals
        String expectedOutput = "Users waiting approval:\n\r\n";
        // Constructing the expected output string based on the query results
        while (rs.next()) {
            if (rs.getString("qualification") == null) {
                expectedOutput += "Student Name: " + rs.getString("forename") + " " + rs.getString("surname") + "\r\n"
                        + "Gender: " + rs.getString("gender") + "\r\n"
                        + "Email: " + rs.getString("email") + "\r\n"
                        + "DOB: " + rs.getString("dateOfBirth");
            } else {
                expectedOutput += "Lecturer Name: " + rs.getString("forename") + " " + rs.getString("surname") + "\r\n"
                        + "Gender: " + rs.getString("gender") + "\r\n"
                        + "Email: " + rs.getString("email") + "\r\n"
                        + "DOB: " + rs.getString("dateOfBirth") + "\r\n"
                        + "Qualification: " + rs.getString("qualification");
            }
            expectedOutput += "\r\n\n";
        }

        // Capturing the actual output for comparison
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent, true));

        // Executing the method to view the workflow
        currentManager.viewWorkflow();

        // Comparing the actual output with the expected output
        String actualOutput = outContent.toString();
        assertEquals(expectedOutput.trim(), actualOutput.trim());

        // Resetting the standard output stream
        System.setOut(originalOut);
    }

    // Test for approving user accounts
    @Test
    void approveUsers() throws SQLException {
        // Preparing user data for approval tests
        Map<String, String> studentMap = new HashMap<>();
        studentMap.put("userID", student.getID());
        studentMap.put("forename", student.getForename());
        studentMap.put("surname", student.getSurname());
        studentMap.put("gender", student.getGender());
        studentMap.put("email", student.getEmail());
        studentMap.put("dateOfBirth", student.getDob());
        studentMap.put("password", student.getPassword());

        Map<String, String> lecturerMap = new HashMap<>();
        lecturerMap.put("userID", lecturer.getID());
        lecturerMap.put("forename", lecturer.getForename());
        lecturerMap.put("surname", lecturer.getSurname());
        lecturerMap.put("gender", lecturer.getGender());
        lecturerMap.put("email", lecturer.getEmail());
        lecturerMap.put("dateOfBirth", lecturer.getDob());
        lecturerMap.put("qualification", lecturer.getQualification());
        lecturerMap.put("password", lecturer.getPassword());

        Map<String, String> student2Map = new HashMap<>();
        student2Map.put("userID", student2.getID());
        student2Map.put("forename", student2.getForename());
        student2Map.put("surname", student2.getSurname());
        student2Map.put("gender", student2.getGender());
        student2Map.put("email", student2.getEmail());
        student2Map.put("dateOfBirth", student2.getDob());
        student2Map.put("password", student2.getPassword());

        List<Map<String, String>> users = new ArrayList<>();
        users.add(studentMap);
        users.add(lecturerMap);
        users.add(student2Map);

        // Executing the approval process and verifying the results
        currentManager.approveUsers(users, 0, "APPROVE");
        currentManager.approveUsers(users, 1, "APPROVE");
        currentManager.approveUsers(users, 2, "DISPROVE");

        // Asserting the state of the database after approval operations
        String checkStudent = "SELECT * FROM student WHERE studentID = 123";
        ps = mySqlConn.prepareStatement(checkStudent);
        rs = ps.executeQuery();
        assertTrue(rs.next());

        String checkLecturer = "SELECT * FROM lecturer WHERE lecturerID = 321";
        ps = mySqlConn.prepareStatement(checkLecturer);
        rs = ps.executeQuery();
        assertTrue(rs.next());

        String checkStudent2 = "SELECT * FROM student WHERE studentID = 124";
        ps = mySqlConn.prepareStatement(checkStudent2);
        rs = ps.executeQuery();
        assertFalse(rs.next());

        String checkApproveUsers = "SELECT * FROM approvals WHERE userID = '123' or userID = '321' or userID = '124'";
        ps = mySqlConn.prepareStatement(checkApproveUsers);
        rs = ps.executeQuery();
        assertFalse(rs.next());
    }

    // Test for managing user accounts (activation, deactivation, password reset)
    @Test
    void manageAccounts() throws SQLException {
        // Inserting a test student for managing accounts
        String createTestStudent = "INSERT INTO student (studentID, forename, surname, gender, email, dateOfBirth, password, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String testStudentId = "testManage";
        ps = mySqlConn.prepareStatement(createTestStudent);
        ps.setString(1, testStudentId);
        ps.setString(2, "Test");
        ps.setString(3, "Student");
        ps.setString(4, "Male");
        ps.setString(5, "teststudent@test.com");
        ps.setString(6, "01/01/2000");
        ps.setString(7, "testPassword");
        ps.setInt(8, 0);
        ps.executeUpdate();

        // Executing account management operations (activate, deactivate, password reset)
        // and asserting the state of the database after account management operations
        currentManager.manageAccounts("STUDENT", "ACTIVATE", testStudentId);
        String checkActiveQuery = "SELECT activated FROM student WHERE studentID = ?";
        ps = mySqlConn.prepareStatement(checkActiveQuery);
        ps.setString(1, testStudentId);
        rs = ps.executeQuery();
        assertTrue(rs.next());
        assertEquals(1, rs.getInt("activated"));

        currentManager.manageAccounts("STUDENT", "DEACTIVATE", testStudentId);
        ps = mySqlConn.prepareStatement(checkActiveQuery);
        ps.setString(1, testStudentId);
        rs = ps.executeQuery();
        assertTrue(rs.next());
        assertEquals(0, rs.getInt("activated"));

        String originalPassword = "testPassword";
        currentManager.manageAccounts("STUDENT", "PASSWORD", testStudentId);
        String getPassword = "SELECT password FROM student WHERE studentID = ?";
        ps = mySqlConn.prepareStatement(getPassword);
        ps.setString(1, testStudentId);
        rs = ps.executeQuery();
        assertTrue(rs.next());
        String newPassword = rs.getString("password");
        assertNotEquals(originalPassword, newPassword);
    }
}

import org.junit.jupiter.api.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


import static org.junit.jupiter.api.Assertions.*;


class StudentTest {

    // Database connection and prepared statement declarations
    private static Connection mySqlConn;
    private static PreparedStatement ps;
    private static Student currentStudent;

    // Setup before all tests: Establishes database connection and prepares data
    @BeforeAll
    static void setupBeforeClass() throws SQLException {
        // Create a connection to the database
        mySqlConn = databaseConnection.getMySqlConnection();

        // Initialize a Student object for testing
        currentStudent = new Student("123", "Test", "Test", "male", "test@test.com", "01/01/2000", "testPassword");

        // Insert a course into the database for testing
        String insertCourse = "INSERT INTO course (courseID, courseName, grad, description) VALUES (?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertCourse);
        ps.setInt(1, 202);
        ps.setString(2, "Test Course");
        ps.setString(3, "Undergraduate");
        ps.setString(4, "Test Course");
        ps.executeUpdate();

        // Insert a student into the database for testing
        ps = mySqlConn.prepareStatement("INSERT INTO student (studentID, forename, surname, gender, email, dateOfBirth, password, courseID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        ps.setString(1, "123");
        ps.setString(2, "Test");
        ps.setString(3, "Student");
        ps.setString(4, "male");
        ps.setString(5, "test@test.com");
        ps.setString(6, "01/01/2000");
        ps.setString(7, "testPassword");
        ps.setInt(8, 202);
        ps.executeUpdate();

        // Insert a module into the database for testing
        ps = mySqlConn.prepareStatement("INSERT INTO module (moduleID, moduleName, creditPoints, ruleID, semester) VALUES (?, ?, ?, ?, ?)");
        ps.setInt(1, 101);
        ps.setString(2, "Test Module");
        ps.setInt(3, 10);
        ps.setInt(4, 1);
        ps.setInt(5, 1);
        ps.executeUpdate();

        // Insert material into the database for testing
        String insertNote = "INSERT INTO material (moduleID, type, week, note) VALUES (?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertNote);
        ps.setInt(1, 101);
        ps.setString(2, "Lecture");
        ps.setInt(3, 1);
        ps.setString(4, "Test Note Content");
        ps.executeUpdate();

        // Insert a course-module association into the database for testing
        String insertCmAssociation = "INSERT INTO cmAssociation (courseID, moduleID) VALUES (?, ?)";
        ps = mySqlConn.prepareStatement(insertCmAssociation);
        ps.setInt(1, 202);
        ps.setInt(2, 101);
        ps.executeUpdate();
    }

    // Teardown after all tests: Cleans up database to prevent data pollution
    @AfterAll
    static void tearDown() throws SQLException {
        // Delete test data from various tables to clean up after tests
        String deleteStudentQuery = "DELETE FROM student WHERE studentID = ?";
        try (PreparedStatement cleanupStudentPs = mySqlConn.prepareStatement(deleteStudentQuery)) {
            cleanupStudentPs.setString(1, "123");
            cleanupStudentPs.executeUpdate();
        }

        String deleteNoteQuery = "DELETE FROM material WHERE moduleID = ? AND type = ? AND week = ?";
        try (PreparedStatement cleanupNotePs = mySqlConn.prepareStatement(deleteNoteQuery)) {
            cleanupNotePs.setInt(1, 101);
            cleanupNotePs.setString(2, "Lecture");
            cleanupNotePs.setInt(3, 1);
            cleanupNotePs.executeUpdate();
        }

        String deleteAssociationQuery = "DELETE FROM cmAssociation WHERE courseID = ? AND moduleID = ?";
        try (PreparedStatement cleanupModulePs = mySqlConn.prepareStatement(deleteAssociationQuery)) {
            cleanupModulePs.setInt(1, 202);
            cleanupModulePs.setInt(2, 101);
            cleanupModulePs.executeUpdate();
        }

        String deleteModuleQuery = "DELETE FROM module WHERE moduleID = ?";
        try (PreparedStatement cleanupModulePs = mySqlConn.prepareStatement(deleteModuleQuery)) {
            cleanupModulePs.setInt(1, 101);
            cleanupModulePs.executeUpdate();
        }

        String deleteCourseQuery = "DELETE FROM course WHERE courseID = ?";
        try (PreparedStatement cleanupModulePs = mySqlConn.prepareStatement(deleteCourseQuery)) {
            cleanupModulePs.setInt(1, 202);
            cleanupModulePs.executeUpdate();
        }
    }

    // Test for notification functionality when materials are uploaded
    @Test
    void notifyMeUploaded() {
        // Setup for the test
        Student student = new Student("123", "Test", "Test", "male", "test@test.com", "2000-01-01", "test");

        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent, true));

        student.notifyMe("Test Title", "uploaded");

        String expectedOutput = "Student with ID(" + student.getID() + ") Please note that materials were uploaded with note: 'Test Title'";
        // Assert that the expected notification message is generated
        assertEquals(expectedOutput.trim(), outContent.toString().trim());

        // Reset the standard output to its original state
        System.setOut(originalOut);
    }

    // Test for notification functionality when materials are updated
    @Test
    void notifyMeUpdated() {
        // Similar setup and assertions as the previous test
        Student student = new Student("123", "Test", "Test", "male", "test@test.com", "2000-01-01", "test");

        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent, true));

        student.notifyMe("Test Title", "updated");

        String expectedOutput = "Student with ID(" + student.getID() + ") Please note that materials were updated with note: 'Test Title'";
        assertEquals(expectedOutput.trim(), outContent.toString().trim());

        System.setOut(originalOut);
    }

    // Test for updating the student's password
    @Test
    void updatePassword() throws SQLException {
        // Code to test the password update functionality
        currentStudent.updatePassword("testPassword", "Password321", "Password321");

        String passQuery = "SELECT * FROM student WHERE studentID = ?";
        ps = mySqlConn.prepareStatement(passQuery);
        ps.setString(1, currentStudent.getID());

        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            assertEquals("Password321", rs.getString("password"));
        }

    }

    // Test to view student's marks
    @Test
    void viewMarks() throws SQLException {
        // Insert marks into the database for testing
        String insertMarks = "INSERT INTO examRecord (studentID, moduleID, labMark, examMark) VALUES (?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertMarks);
        ps.setString(1, currentStudent.getID());
        ps.setInt(2, 101);
        ps.setInt(3, 85);
        ps.setInt(4, 90);
        ps.executeUpdate();

        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent, true));

        currentStudent.viewMarks();

        String expectedOutput = "Course Name: Test Course\r\nModule ID: 101, Lab Mark: 85, Exam Mark: 90\r\n";
        // Assert that the student can view the correct marks
        assertEquals(expectedOutput.trim(), outContent.toString().trim());

        // Reset the standard output and cleanup test data
        System.setOut(originalOut);

        System.setOut(System.out);
        String deleteMarksQuery = "DELETE FROM examRecord WHERE studentID = ?";
        try (PreparedStatement cleanupPs = mySqlConn.prepareStatement(deleteMarksQuery)) {
            cleanupPs.setString(1, currentStudent.getID());
            cleanupPs.executeUpdate();
        }
    }

    // Test to download a note
    @Test
    void downloadNoteTest() {
        // Setup for the test
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent, true));

        currentStudent.downloadNote("Test Module", "LECTURE", 1);

        String expectedOutput = "Test Note Content";
        // Assert that the correct note content is downloaded
        assertEquals(expectedOutput.trim(), outContent.toString().trim());

        // Reset the standard output to its original state
        System.setOut(originalOut);

    }

    // Test to view student's academic decision
    @Test
    void viewDecision() throws SQLException {
        // Update student decision in the database for testing
        String updateDecisionQuery = "UPDATE student SET studentDecision = ? WHERE studentID = ?";
        try (PreparedStatement updatePs = mySqlConn.prepareStatement(updateDecisionQuery)) {
            updatePs.setString(1, "award");
            updatePs.setString(2, currentStudent.getID());
            updatePs.executeUpdate();
        }

        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent, true));

        currentStudent.viewDecision();

        String expectedOutput = "Student Decision: award\r\n";
        // Assert that the student can view the correct decision
        assertEquals(expectedOutput.trim(), outContent.toString().trim());

        // Reset the standard output to its original state
        System.setOut(originalOut);
    }
}
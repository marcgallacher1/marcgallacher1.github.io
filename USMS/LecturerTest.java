import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

class LecturerTest {

    // Database connection and prepared statement declarations
    public static Connection mySqlConn;
    public static PreparedStatement ps;
    public static Lecturer currentLecturer;
    public static ResultSet rs;

    // Setup before all tests: Establishes database connection and prepares data
    @BeforeAll
    static void setup() throws SQLException {
        // Establish a connection to the database
        mySqlConn = databaseConnection.getMySqlConnection();

        // Initialize a Lecturer object for testing
        currentLecturer = new Lecturer("262427042003", "Tom", "Wallace", "male", "tom.wallace10@gmail.com", "1991-10-17", "PhD", "Password123");

        // Various insert statements to prepare the database for testing
        // Inserting module, course, lecturer, material, student and associations for setup
        String insertModule = "INSERT INTO module (moduleID, moduleName, creditPoints, lecturerID, ruleID, semester) VALUES (?, ?, ?, ?, ?, ?)";
        PreparedStatement ps = mySqlConn.prepareStatement(insertModule);
        ps.setInt(1, 321);
        ps.setString(2, "ModuleName");
        ps.setInt(3, 20);
        ps.setString(4, null);
        ps.setInt(5, 2);
        ps.setInt(6, 1);
        ps.executeUpdate();

        String insertCourse = "INSERT INTO course (courseID, courseName, grad, departmentID, description) VALUES (?, ?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertCourse);
        ps.setInt(1, 321);
        ps.setString(2, "CS321");
        ps.setString(3, "undergraduate");
        ps.setInt(4, 1);
        ps.setString(5, "this is very fun");
        ps.executeUpdate();

        String insertTest = "INSERT INTO lecturer (lecturerID, forename, surname, gender, email, dateOfBirth, qualification, password, moduleID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertTest);
        ps.setString(1, currentLecturer.getID());
        ps.setString(2, currentLecturer.getForename());
        ps.setString(3, currentLecturer.getSurname());
        ps.setString(4, currentLecturer.getGender());
        ps.setString(5, currentLecturer.getEmail());
        ps.setString(6, currentLecturer.getDob());
        ps.setString(7, currentLecturer.getQualification());
        ps.setString(8, currentLecturer.getPassword());
        ps.setInt(9, 321);
        ps.executeUpdate();

        String updateModule = "UPDATE module SET lecturerID = ? WHERE moduleID = ?";
        ps = mySqlConn.prepareStatement(updateModule);
        ps.setString(1, currentLecturer.getID());
        ps.setInt(2, 321);
        ps.executeUpdate();

        String addMaterial = "INSERT INTO material (moduleID, type, week, note) VALUES (?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(addMaterial);
        ps.setInt(1, 321);
        ps.setString(2, "lab");
        ps.setInt(3, 5);
        ps.setString(4, "Test Note");
        ps.executeUpdate();

        String insertStudent = "INSERT INTO student (studentID, forename, surname, gender, email, dateOfBirth, password, courseID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        ps = mySqlConn.prepareStatement(insertStudent);
        ps.setString(1, "42313234");
        ps.setString(2, "marc");
        ps.setString(3, "gallacher");
        ps.setString(4, "male");
        ps.setString(5, "marc.gallacher10@gmail.com");
        ps.setString(6, "17/10/2003");
        ps.setString(7, "Password123");
        ps.setInt(8, 321);
        ps.executeUpdate();

        String association = "INSERT INTO cmAssociation (courseID, moduleID) VALUES (?, ?)";
        ps = mySqlConn.prepareStatement(association);
        ps.setInt(1, 321);
        ps.setInt(2, 321);
        ps.executeUpdate();
    }

    // Teardown after all tests: Cleans up database to prevent data pollution
    @AfterAll
    static void cleanup() throws SQLException {
        // Cleanup operations to remove test data from the database
        // Deleting lecturer, module, course, etc.
        String deleteLecturerModule = "UPDATE lecturer SET moduleID = ? WHERE lecturerID = ?";
        ps = mySqlConn.prepareStatement(deleteLecturerModule);
        ps.setString(1, null);
        ps.setString(2, currentLecturer.getID());
        ps.executeUpdate();

        String deleteAssociation = "DELETE FROM cmAssociation WHERE courseID = ? AND moduleID = ?";
        PreparedStatement ps = mySqlConn.prepareStatement(deleteAssociation);
        ps.setInt(1, 321);
        ps.setInt(2, 321);
        ps.executeUpdate();

        String deleteStudent = "DELETE FROM student WHERE studentID = ?";
        ps = mySqlConn.prepareStatement(deleteStudent);
        ps.setString(1, "42313234");
        ps.executeUpdate();

        String deleteMaterial = "DELETE FROM material WHERE moduleID = ?";
        ps = mySqlConn.prepareStatement(deleteMaterial);
        ps.setInt(1, 321);
        ps.executeUpdate();

        String deleteModule = "DELETE FROM module WHERE moduleID = ?";
        ps = mySqlConn.prepareStatement(deleteModule);
        ps.setInt(1, 321);
        ps.executeUpdate();

        String deleteLecturer = "DELETE FROM lecturer WHERE lecturerID = ?";
        ps = mySqlConn.prepareStatement(deleteLecturer);
        ps.setString(1, "262427042003");
        ps.executeUpdate();

        String deleteCourse = "DELETE FROM course WHERE courseID = ?";
        ps = mySqlConn.prepareStatement(deleteCourse);
        ps.setInt(1, 321);
        ps.executeUpdate();
    }

    // Test for updating a lecturer's password
    @Test
    void updatePassword() throws SQLException {
        // Test the functionality of updating a lecturer's password
        currentLecturer.updatePassword("Password123", "Password321", "Password321");

        String passQuery = "SELECT * FROM lecturer WHERE lecturerID = ?";
        ps = mySqlConn.prepareStatement(passQuery);
        ps.setString(1, currentLecturer.getID());

        rs = ps.executeQuery();

        // Assertions to check if the password update was successful
        if (rs.next()) {
            assertEquals(rs.getString("password"), "Password321");
        }
    }

    // Test for updating module information like credits
    @Test
    void updateModuleInfoCredit() throws SQLException {
        // Test updating various module information such as name, credit points, and semester
        currentLecturer.updateModuleInfo(1, "Updated Module Name");

        String moduleNameTest = "SELECT moduleName FROM module WHERE moduleID = 312";
        ps = mySqlConn.prepareStatement(moduleNameTest);
        rs = ps.executeQuery();

        if (rs.next()) {
            assertEquals("Updated Module Name", rs.getString("moduleName"));
        }

        currentLecturer.updateModuleInfo(2, "30");

        String creditPointTest = "SELECT creditPoints FROM module WHERE moduleID = 312";
        ps = mySqlConn.prepareStatement(creditPointTest);
        rs = ps.executeQuery();

        if (rs.next()) {
            assertEquals(30, rs.getInt("creditPoints"));
        }

        currentLecturer.updateModuleInfo(3, "1");

        String semesterTest = "SELECT semester FROM module WHERE moduleID = 321";
        ps = mySqlConn.prepareStatement((semesterTest));
        rs = ps.executeQuery();
        if (rs.next()) {
            assertEquals("1", rs.getString("semester"));
        }
    }

    // Test for uploading or updating course material
    @Test
    void uploadOrUpdateMaterial() throws SQLException {
        // Test both uploading new material and updating existing material
        currentLecturer.uploadOrUpdateMaterial(1, "LECTURE", 5, "Upload Test");

        String uploadQuery = "SELECT note FROM material WHERE moduleID = ? AND type = ? AND week = ?";
        ps = mySqlConn.prepareStatement(uploadQuery);
        ps.setInt(1, 321);
        ps.setString(2, "lecture");
        ps.setInt(3, 5);
        rs = ps.executeQuery();

        if (rs.next()) {
            assertEquals("Upload Test", rs.getString("note"));
        }

        currentLecturer.uploadOrUpdateMaterial(2, "LAB", 5, "Updated Test Note");

        String updateQuery = "SELECT note FROM material WHERE moduleID = ? AND type = ? AND week = ?";
        ps = mySqlConn.prepareStatement(updateQuery);
        ps.setInt(1, 321);
        ps.setString(2, "lab");
        ps.setInt(3, 5);
        rs = ps.executeQuery();

        if (rs.next()) {
            assertEquals("Updated Test Note", rs.getString("note"));
        }
    }

    // Test to display students enrolled in a module
    @Test
    void displayEnrolledStudents() throws SQLException {
        // Setup to capture output stream for testing
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent, true));

        // Function call to display enrolled students
        currentLecturer.displayEnrolledStudents();

        // Assertions to check if the correct information is displayed
        String expectedOutput = " - marc gallacher";

        assertEquals(expectedOutput.trim(), outContent.toString().trim());

        // Reset the standard output to its original state
        System.setOut(originalOut);
    }
}

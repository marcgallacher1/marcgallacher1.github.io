import java.sql.Connection;
import java.sql.SQLException;
import java.util.Scanner;

// Abstract class 'User' that will be the base for different types of users in the system.
public abstract class User {

    // Protected variables accessible by child classes.
    protected Connection sqlConn = databaseConnection.getMySqlConnection(); // Connection to the SQL database.
    protected Scanner scanInput = new Scanner(System.in); // Scanner for reading user input.
    protected String ID; // User ID.
    protected String forename; // User's forename.
    protected String surname; // User's surname.
    protected String gender; // User's gender.
    protected String email; // User's email address.
    protected String dob; // User's date of birth.
    protected String password; // User's password.

    // Getter methods to access the protected properties.
    public String getID() {
        return ID;
    }

    public String getForename() {
        return forename;
    }

    public String getSurname() {
        return surname;
    }

    public String getGender() {
        return gender;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getDob() {
        return dob;
    }

    // Setter methods to modify the protected properties.
    public void setID(String ID) {
        this.ID = ID;
    }

    public void setForename(String forename) {
        this.forename = forename;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    // Abstract method 'updatePassword' to be implemented by child classes.
    public abstract void updatePassword(String newPass, String oldPass, String confirmPass) throws SQLException;

}
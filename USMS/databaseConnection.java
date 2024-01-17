import java.io.*;
import java.sql.*;
import java.util.*;

import static java.lang.System.exit;

// Class to manage the database connection.
public class databaseConnection {
    // Static variable for holding the database connection.
    private static Connection mySqlConn = null;

    static {
        // Default values for database connection details.
        String url = "jdbc:mysql://";
        String dbName = "";
        String user = "";
        String password = "";

        // Attempting to read database connection details from the provided file.
        try {
            // Opening the file specified by filePath.
            Scanner sc = new Scanner(new File("DbConnect.txt"));

            // Extracting connection details from the file.
            if (sc.hasNextLine()) url = url + sc.nextLine() + "/";
            if (sc.hasNextLine()) dbName = sc.nextLine();
            if (sc.hasNextLine()) user = sc.nextLine();
            if (sc.hasNextLine()) password = sc.nextLine();
            sc.close();
        } catch (FileNotFoundException e) {
            System.out.println("DbConnect.txt file not found at specified path.");
            e.printStackTrace();
            exit(-1); // Exit if the file is not found.
        }

        // Attempting to establish a connection to the database.
        try {
            // Loading the MySQL JDBC driver.
            Class.forName("com.mysql.cj.jdbc.Driver");
            // Establishing the connection with the database.
            mySqlConn = DriverManager.getConnection(url + dbName, user, password);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace(); // Printing error details if connection fails.
        }
    }

    // Method to retrieve the established MySQL connection.
    public static Connection getMySqlConnection() {
        return mySqlConn;
    }
}

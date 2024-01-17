import org.junit.jupiter.api.Test;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

class databaseConnectionTest {

    @Test
    void testGetMySqlConnection() {
        try {
            // Attempt to get a MySQL database connection
            Connection conn = databaseConnection.getMySqlConnection();

            // Check if the connection is not null (indicating a successful connection)
            assertNotNull(conn);

            // Check if the connection remains valid for 5 seconds
            assertTrue(conn.isValid(5));
        } catch (SQLException e) {
            // If an SQLException is thrown, fail the test with a message
            fail("SQLException should not be thrown");
        }
    }
}
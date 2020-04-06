package at.fhv.dbi4329.Servlets.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class JDBCManager {

    public Connection getConnection() throws SQLException {
        Connection connection ;
        Properties connectionProps = new Properties();
        connectionProps.put("database", "d031a965");
        connectionProps.put("user", "d031a965");
        connectionProps.put("password", "vvAatDLESJs5mXWC");
        connection = DriverManager.getConnection("jdbc:mysql://w0182181.kasserver.com:3306/" + connectionProps.getProperty("database"),
                connectionProps.getProperty("user"),
                connectionProps.getProperty("password"));
        return connection;
    }
}
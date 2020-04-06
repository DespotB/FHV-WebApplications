package at.fhv.dbi4329.Servlets.jdbc.broker;

import at.fhv.dbi4329.Servlets.jdbc.JDBCManager;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public abstract class BrokerBase<T> {
    JDBCManager _manager;
    Connection _connection;

    public BrokerBase() {
        _manager = new JDBCManager();
        try {
            _connection = _manager.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public abstract void save(T item);

    public abstract List<T> getAll();
}
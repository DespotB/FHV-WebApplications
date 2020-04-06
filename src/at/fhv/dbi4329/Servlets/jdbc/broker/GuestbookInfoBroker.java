package at.fhv.dbi4329.Servlets.jdbc.broker;


import at.fhv.dbi4329.Servlets.jdbc.model.GuestbookInfo;

import java.sql.*;
import java.util.LinkedList;
import java.util.List;

public class GuestbookInfoBroker extends BrokerBase<GuestbookInfo> {

    @Override
    public void save(GuestbookInfo info){
        try (Connection c = _connection) {
            PreparedStatement stmt = c.prepareStatement("INSERT INTO guestBook(name, mail, message) VALUES(?, ?, ?)");
            stmt.setString(1, info.getName());
            stmt.setString(2, info.getEmail());
            stmt.setString(3, info.getComment());
            stmt.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<GuestbookInfo> getAll() {
        List<GuestbookInfo> infos = new LinkedList<>();

        try(Connection c = _connection){
            Statement s = c.createStatement();
            ResultSet rs = s.executeQuery("SELECT * FROM guestBook");

            while (rs.next()) {
                GuestbookInfo info = new GuestbookInfo();
                info.setName(rs.getString("name"));
                info.setEmail(rs.getString("mail"));
                info.setComment(rs.getString("message"));
                infos.add(info);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return infos;
    }
}

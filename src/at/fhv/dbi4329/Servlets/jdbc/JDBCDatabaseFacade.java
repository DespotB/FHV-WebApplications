package at.fhv.dbi4329.Servlets.jdbc;

import at.fhv.dbi4329.Servlets.jdbc.broker.GuestbookInfoBroker;
import at.fhv.dbi4329.Servlets.jdbc.model.GuestbookInfo;

import java.util.List;

public class JDBCDatabaseFacade {

    public static List<GuestbookInfo> getAllGuestbookInfos(){
        return new GuestbookInfoBroker().getAll();
    }

    public static <T> void save(T info){
        if(info instanceof GuestbookInfo){
            new GuestbookInfoBroker().save((GuestbookInfo) info);
        }
    }
}

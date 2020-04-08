package at.fhv.dbi4329.Servlets.jdbc.model;

public class GuestbookInfo {

    private String _name = "";
    private String _email = "";
    private String _comment = "";


    public String getName() {
        return _name;
    }

    public void setName(String name) {
        _name = name;
    }

    public String getEmail() {
        return _email;
    }

    public void setEmail(String email) {
        _email = email;
    }

    public String getComment() {
        return _comment;
    }

    public void setComment(String comment) {
        _comment = comment;
    }


}
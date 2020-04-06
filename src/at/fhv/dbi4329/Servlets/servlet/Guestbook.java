package at.fhv.dbi4329.Servlets.servlet;


import at.fhv.dbi4329.Servlets.jdbc.JDBCDatabaseFacade;
import at.fhv.dbi4329.Servlets.jdbc.model.GuestbookInfo;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;


@WebServlet(urlPatterns = {"/guestbook"})
public class Guestbook extends HttpServlet{


    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("text/html");
        PrintWriter out = res.getWriter();

        //myHeader
        out.println("<html lang=\"en\"><head>\n" +
                "  <link rel=\"stylesheet\" href=\"css/background_navigationbar.css\"></link>\n" +
                "  <script src=\"http://code.jquery.com/jquery-1.11.1.min.js\"></script>\n" +
                "  <title>Guestbook</title>\n" +
                "  <style>\n" +
                "    ol {\n" +
                "      top: 250px;\n" +
                "    }\n" +
                "  </style>\n" +
                "</head>\n");


        //myBody and navigation bar
        out.println("<body>\n" +
                "<a href=\"./home.html\">\n" +
                "  <div class=\"image-blurred-edge-logo\"></div>\n" +
                "  <img src=\"./PhotoFunia-1583828295.jpg\" alt=\"Logo\">\n" +
                "</a>\n" +
                "\n" +
                "<div class=\"active\">\n" +
                "  <ul style=\"border: #111111\">\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./asteroids.html\">Play Asteroids</a></li>\n" +
                "    <br/>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./home.html\">Home</a></li>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./Gamecube.html\">Gamecube</a>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./Nintendo64.html\">Nintendo 64</a></li></li>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./404.html\">SEGA</a></li>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./404.html\">Gameboy Color</a></li>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./registration.html\">Registrieren</a></li>\n" +
                "    <br/>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./bild.html\">BILD</a></li>\n" +
                "    <li style=\"border-bottom: #111111\"><a href=\"./guestbook\">Guestbook</a></li>\n" +
                "  </ul>\n" +
                "</div>");

        //body
        //out.println("<body>");

        //form
        out.println("<form name='registration' action=\"guestbook\"  method=\"post\" >\n" +
                "  <ol>\n" +
                "    <li><label for=\"name\">Name:</label></li>\n" +
                "    <li><input type=\"text\" id=\"name\" name=\"name\" size=\"50\"/></li>\n" +
                "    <li><label for=\"mail\">Email:</label></li>\n" +
                "    <li><input type=\"text\" id=\"mail\" name=\"mail\" size=\"50\"/></li>\n" +
                "    <li><label for=\"message\">Kommentar:</label></li>\n" +
                "    <li><textarea name=\"message\" id=\"message\"></textarea></li>\n" +
                "    <li><input type=\"submit\" name=\"submit\" value=\"Submit\"/><input type=\"reset\" name=\"reset\" value=\"Reset\"/></li>\n" +
                "  </ol>" +
                "</form>");

        for(GuestbookInfo info : JDBCDatabaseFacade.getAllGuestbookInfos()){
            out.println(info.getName());
            out.println(info.getEmail());
            out.println(info.getComment());
        }

        out.println("</body></html>");

    }



    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        // new Guestbook info
        GuestbookInfo info = new GuestbookInfo();
        info.setName(req.getParameter("name"));
        info.setEmail(req.getParameter("mail"));
        info.setComment(req.getParameter("message"));
        JDBCDatabaseFacade.save(info);
        doGet(req,res);
    }


}

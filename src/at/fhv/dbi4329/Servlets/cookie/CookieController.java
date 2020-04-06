package at.fhv.dbi4329.Servlets.cookie;


import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;



@WebServlet(urlPatterns = {"/index.html"})
public class CookieController extends HttpServlet {

    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        Cookie[] cookies = req.getCookies();

        String lastPage = "/web_war_exploded/home.html";
        if(cookies != null){
            for(Cookie c : cookies){
                if(c.getName().equals("lastVisitiedSite")){
                    lastPage = c.getValue();
                }
            }
        }
        res.sendRedirect(lastPage);
    }
}
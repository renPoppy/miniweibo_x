package dao;

import org.springframework.orm.hibernate3.HibernateTemplate;
import pojo.User;
import sun.net.www.MimeTable;

import java.util.List;

public class userDAOImpl extends HibernateTemplate implements userDAO {
    @Override
    public List<User> list() {
        return find("from User");
    }

    @Override
    public void add(User user) {
        save(user);
    }

    @Override
    public void delete(User user) {
        super.delete(user);
    }

    @Override
    public void update(User user) {
        super.update(user);
    }

    @Override
    public User get(int id) {
        return (User)get(User.class,id);
    }

    @Override
    public List<User> searchByName(String name) {
        return find("from User u where u.userNikename like '%"+name+"%'");
    }

    @Override
    public int dayAddUser(String date) {
        String hql="select count(*) from User u where u.userTime > "+"'"+date+" 00:00:00 "+"'"+"and u.userTime < "+"'"+date+" 24:00:00 "+"'";
        Integer count = ((Number)find(hql).listIterator().next()).intValue();
        return count;
    }


}

// sql语句
var sqlMap = {
    // 用户
    user: {
        add: 'insert into user set name=? , age=?, address=?',
        select: 'select * from user  where name= ?' ,
        selectAll: 'select * from user',
        delete:'delete from user  where id=?',
        update: 'update user set  name=? , age=? , address=? where id=?'
    }
}
module.exports = sqlMap;
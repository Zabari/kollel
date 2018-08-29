import sqlite3


def create_table(cursor):
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS users (
            googleid TEXT DEFAULT NULL,
            first_name TEXT DEFAULT NULL,
            last_name TEXT DEFAULT NULL,
            email TEXT DEFAULT NULL,
            admin INTEGER DEFAULT NULL,
            id INTEGER PRIMARY KEY AUTOINCREMENT
        )
        '''
    )


def get_user_list():
    connection = sqlite3.connect('users.db')
    connection.row_factory = sqlite3.Row
    with connection:
        create_table(connection)
        all_users = connection.execute(
            '''
            SELECT id, email, first_name, last_name FROM users
            ''').fetchall()
        if (all_users):
            return [dict(user) for user in all_users]
        return False


def exists(user_object):
    connection = sqlite3.connect('users.db')
    connection.row_factory = sqlite3.Row
    with connection:
        create_table(connection)
        exists = connection.execute(
            '''
            SELECT id, admin FROM users WHERE googleid=:sub
            ''', user_object).fetchone()
        if (exists):
            return dict(exists)
        return False


def add_user(user_object):
    connection = sqlite3.connect('users.db')
    # print(user_object.keys())
    with connection:
        create_table(connection)
        connection.execute(
            '''
            INSERT INTO users (
                googleid, first_name,
                last_name, email
            )
            VALUES (
                :sub, :given_name,
                :family_name, :email
            )
            ''', user_object)
        return connection.execute(
            '''
            SELECT id FROM users WHERE googleid=:sub
            ''', user_object).fetchone()[0]

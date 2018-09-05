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
            hour_preference TEXT DEFAULT NULL,
            chevruta_preference TEXT DEFAULT NULL,
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


def is_survey_done(user_id):
    connection = sqlite3.connect('users.db')
    with connection:
        create_table(connection)
        # print(user_id)
        survey = connection.execute(
            '''
            SELECT hour_preference, chevruta_preference
            FROM users WHERE id = ?
            ''', (user_id,)).fetchone()
        print(survey[0])
        print(survey[0] is not None)
        return (survey[0] is not None)
        # if (plan):
        #     return plan[0]
        return False


def submit_survey(user_object):
    connection = sqlite3.connect('users.db')
    with connection:
        create_table(connection)
        print(user_object)
        connection.execute(
            '''
            UPDATE users SET hour_preference=:hours,
                chevruta_preference=:chevruta
            WHERE id = :user_id
            ''', user_object)
        return True
        # if (plan):
        #     return plan[0]
        return False

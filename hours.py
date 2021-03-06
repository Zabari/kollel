import sqlite3
import datetime
import json
from dateutil.parser import parse
from dateutil import relativedelta
import math
import pytz


DAYS_OF_WEEK = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]


def date_handler(obj):
    if isinstance(obj, (datetime.datetime, datetime.date)):
        obj.isoformat()
    else:
        None


def create_table(cursor):
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS learning_hours (
            start_time TEXT DEFAULT NULL,
            end_time TEXT DEFAULT NULL,
            seconds INTEGER DEFAULT NULL,
            minutes INTEGER DEFAULT NULL,
            hours INTEGER DEFAULT NULL,
            "date" TEXT DEFAULT NULL,
            day TEXT DEFAULT NULL,
            partner TEXT DEFAULT NULL,
            id INTEGER
        )
        '''
    )


def create_requested_table(cursor):
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS requested_learning_hours (
            start_time TEXT DEFAULT NULL,
            end_time TEXT DEFAULT NULL,
            seconds INTEGER DEFAULT NULL,
            minutes INTEGER DEFAULT NULL,
            hours INTEGER DEFAULT NULL,
            "date" TEXT DEFAULT NULL,
            day TEXT DEFAULT NULL,
            partner TEXT DEFAULT NULL,
            id INTEGER
        )
        '''
    )


def add_hours(user_id, start_time, end_time):
    connection = sqlite3.connect('hours.db')
    start_time = parse(start_time, tzinfos={pytz.timezone("US/Eastern")})
    end_time = parse(end_time, tzinfos={pytz.timezone("US/Eastern")})
    difference = relativedelta.relativedelta(end_time, start_time)
    input_dict = {
        "id": user_id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "date": start_time.strftime("%Y-%m-%d"),
        "day": DAYS_OF_WEEK[start_time.weekday()],
        "hours": difference.hours,
        "minutes": difference.minutes,
        "seconds": difference.seconds,
    }
    with connection:
        create_table(connection)
        connection.execute(
            '''
            INSERT INTO learning_hours (
                id, start_time,
                "date", day,
                end_time, hours,
                minutes, seconds
            )
            VALUES (
                :id, :start_time,
                :date, :day,
                :end_time, :hours,
                :minutes, :seconds
            )
            ''', input_dict)


def request_hours(user_id, start_time, end_time):
    connection = sqlite3.connect('hours.db')
    start_time = parse(start_time, tzinfos={pytz.timezone("US/Eastern")})
    end_time = parse(end_time, tzinfos={pytz.timezone("US/Eastern")})
    difference = relativedelta.relativedelta(end_time, start_time)
    input_dict = {
        "id": user_id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "date": start_time.strftime("%Y-%m-%d"),
        "day": DAYS_OF_WEEK[start_time.weekday()],
        "hours": difference.hours,
        "minutes": difference.minutes,
        "seconds": difference.seconds,
    }
    with connection:
        create_requested_table(connection)
        connection.execute(
            '''
            INSERT INTO requested_learning_hours (
                id, start_time,
                "date", day,
                end_time, hours,
                minutes, seconds
            )
            VALUES (
                :id, :start_time,
                :date, :day,
                :end_time, :hours,
                :minutes, :seconds
            )
            ''', input_dict)


def start_learning(user_id, start_time):
    connection = sqlite3.connect('hours.db')
    # start_time = datetime.datetime.now()
    input_dict = {
        "id": user_id,
        "start_time": start_time,
        "date": parse(start_time).strftime("%Y-%m-%d"),
        "day": DAYS_OF_WEEK[parse(start_time).weekday()],
    }
    with connection:
        create_table(connection)
        connection.execute(
            '''
            INSERT INTO learning_hours (
                id, start_time,
                "date", day
            )
            VALUES (
                :id, :start_time,
                :date, :day
            )
            ''', input_dict)


def get_log(user_id):
    connection = sqlite3.connect('hours.db')
    connection.row_factory = sqlite3.Row
    with connection:
        create_table(connection)
        hour_log = connection.execute(
            '''
            SELECT start_time, end_time, "date", day,
            hours, minutes, rowid FROM learning_hours
            WHERE id=? AND (end_time IS NOT NULL) ORDER BY start_time DESC
            ''',
            (user_id,)).fetchall()
        return hour_log


def get_request_log(user_id=False):
    connection = sqlite3.connect('hours.db')
    connection.row_factory = sqlite3.Row
    with connection:
        create_requested_table(connection)
        if (user_id):
            hour_log = connection.execute(
                '''
                SELECT id, start_time, end_time, "date", day,
                hours, minutes, rowid FROM requested_learning_hours
                WHERE id=? ORDER BY start_time DESC
                ''',
                (user_id,)).fetchall()
        else:
            hour_log = connection.execute(
                '''
                SELECT id, start_time, end_time, "date", day,
                hours, minutes, rowid FROM requested_learning_hours
                ORDER BY start_time DESC
                ''',
                ).fetchall()
        return hour_log


def get_totals(user_id):
    connection = sqlite3.connect('hours.db')
    connection.row_factory = sqlite3.Row
    with connection:
        create_table(connection)
        total_hours = connection.execute(
            '''
            SELECT SUM(hours) as hours, SUM(minutes) as minutes,
            SUM(seconds) as seconds
            FROM learning_hours WHERE id=?
            ''',
            (user_id,)).fetchone()
        if total_hours["seconds"]:
            total_hours = dict(total_hours)
            total_hours["minutes"] += round(total_hours["seconds"]/60)
            return total_hours
        else:
            return {"hours": 0, "minutes": 0}


def approve_request(rowid):
    connection = sqlite3.connect('hours.db')
    with connection:
        create_requested_table(connection)
        create_table(connection)
        connection.execute(
            '''
            INSERT INTO learning_hours SELECT * FROM
                requested_learning_hours WHERE ROWID = ?;
            ''',
            (rowid,))
        connection.execute(
            '''
                DELETE FROM requested_learning_hours WHERE ROWID = ?;
            ''',
            (rowid,))


def reject_request(rowid, user_id=False):
    connection = sqlite3.connect('hours.db')
    with connection:
        create_requested_table(connection)
        create_table(connection)
        if (user_id):
            connection.execute(
                '''
                DELETE FROM requested_learning_hours WHERE
                    ROWID=? AND id=?;
                ''',
                (rowid, user_id,))
        connection.execute(
            '''
            DELETE FROM requested_learning_hours WHERE ROWID = ?;
            ''',
            (rowid,))


def is_learning(user_id):
    connection = sqlite3.connect('hours.db')
    with connection:
        create_table(connection)
        learning = connection.execute(
            '''
            SELECT start_time FROM learning_hours WHERE
                id=? AND end_time is NULL
            ''', (user_id,)
        ).fetchone()
        return (learning and learning[0]) or False


def end_learning(user_id, start_time):
    connection = sqlite3.connect('hours.db')
    end_time = datetime.datetime.now(pytz.timezone("US/Eastern"))
    # print(end_time)
    start_time = parse(start_time)
    difference = relativedelta.relativedelta(end_time, start_time)
    input_dict = {
        "id": user_id,
        "end_time": end_time.isoformat(),
        "hours": difference.hours,
        "minutes": difference.minutes,
        "seconds": difference.seconds,
    }
    print(input_dict)
    with connection:
        create_table(connection)
        connection.execute(
            '''
            UPDATE learning_hours SET
                end_time=:end_time,
                hours=:hours,
                minutes=:minutes,
                seconds=:seconds
            WHERE
                id=:id AND end_time IS NULL
            ''', input_dict)

import sqlite3
import datetime
import json
from dateutil.parser import parse
from dateutil import relativedelta
import math


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
        total_hours = dict(total_hours)
        total_hours["minutes"] += round(total_hours["seconds"]/60)
        return total_hours


def end_learning(user_id, start_time):
    connection = sqlite3.connect('hours.db')
    end_time = datetime.datetime.now()
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

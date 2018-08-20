import sqlite3
import datetime
import json

DAYS_OF_WEEK = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]


date_handler = lambda obj: (
    obj.isoformat()
    if isinstance(obj, (datetime.datetime, datetime.date))
    else None
)

def create_table(cursor):
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS hours (
            start_time BLOB DEFAULT NULL,
            end_time BLOB DEFAULT NULL,
            minutes INTEGER DEFAULT NULL,
            hours INTEGER DEFAULT NULL,
            date TEXT DEFAULT NULL,
            day TEXT DEFAULT NULL,
            partner TEXT DEFAULT NULL,
            id INTEGER
        )
        '''
    )

def start_time(user_id):
    connection = sqlite3.connect('hours.db')
    start_time = datetime.datetime.now()
    input_dict = {
        "id": user_id,
        "start_time": json.dumps(start_time),
        "date": start_time.strftime("%Y-%m-%d"),
        "day": DAYS_OF_WEEK[start_time.weekday()],

    }
    with connection:
        create_table(connection)
        connection.execute(
            '''
            INSERT INTO hours (
                id, start_time,
                date, day
            )
            VALUES (
                :id, :start_time,
                :date, :day
            )
            '''
        , input_dict)
        return json.dumps(start_time, default=date_handler)


def end_time(user_id):
    connection = sqlite3.connect('hours.db')
    end_time = datetime.datetime.now()
    input_dict = {
        "id": user_id,
        "start_time": json.dumps(start_time),
        "date": start_time.strftime("%Y-%m-%d"),
        "day": DAYS_OF_WEEK[start_time.weekday()],

    }
    with connection:
        create_table(connection)
        connection.execute(
            '''
            UPDATE hours SET
                end_time=:end_time,
                hours=:hours,
                minutes=:minutes
            WHERE
                id=:id AND end_time=NULL
            '''
        , input_dict)
        return json.dumps(end_time, default=date_handler)

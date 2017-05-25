# -*- coding: utf-8 -*-
import pymysql
pymysql.install_as_MySQLdb()
import io
import os
from random import randint
import datetime
from calendar import monthrange
import time
import MySQLdb


db = MySQLdb.connect('37.139.0.36','grupp5','2ed68dda1fcde20797bb560864b23999','patientData' )
cursor = db.cursor()

def emptyDB(cursor, db):
	sql = "DELETE FROM Person WHERE True"
	try:
	   # Execute the SQL command
	   cursor.execute(sql)
	   # Commit your changes in the database
	   db.commit()
	except:
	   # Rollback in case there is any error
	   db.rollback()


def insert_person(values):
	startTime = time.strptime(values[1], "%Y-%m-%d")
	endTime = time.strptime(values[4], "%Y-%m-%d")
	assert startTime < endTime

	#sql = "INSERT INTO Person VALUES ('{}, {}')".format(*values[0:1])
	sql = "INSERT INTO Person VALUES (NULL, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')" % tuple(values)
	cursor.execute(sql)
	db.commit()


def randomPersonNumber():
	averageYears = 65
	percentMale = 70
	span = 10
	lastFour = list("0000")
	if randint(0, 100) <= percentMale:
		lastFour[2] = str(randint(1, 5) * 2 - 1);
	else:
		lastFour[2] = str(randint(0, 4) * 2);

	lastFour[0] = str(randint(0, 9))
	lastFour[1] = str(randint(0, 9))
	lastFour[3] = str(randint(0, 9))

	average = 2017 - averageYears;
	birth = str(average + randint(-10, 10));
	mon = str(randint(1,12))
	if len(mon) == 1:
		mon = "0" + mon

	day = str(randint(1, monthrange(int(birth), int(mon))[1]));
	if len(day) == 1:
		day = "0"+day
	birth = birth + mon + day;
	return '%s-%s' % (birth, ''.join(lastFour))


def random_date(date):
	mon = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr":"04", "Maj":"05",
		"Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Okt":"10", "Nov":"11",
		"Dec":"12"}
	day = str(randint(1,monthrange(int(date.split("-")[0]), int(mon[date.split("-")[1]]))[1]));
	if len(day) == 1:
		day = "0"+ day
	return date.split("-")[0] +"-"+ mon[date.split("-")[1]] + "-" + day

def add_days(date, daysToAdd):
	date_1 = datetime.datetime.strptime(date, "%Y-%m-%d")
	return (date_1 + datetime.timedelta(days=daysToAdd)).date()

emptyDB(cursor, db)

elements = 0
filePath = os.path.dirname(os.path.abspath(__file__))+"/data.txt"
with io.open(filePath ,'r',encoding='utf8') as f:
	for line in f.readlines():
		lineList = line.split("	")
		i = 0
		averageDays = int(int(lineList[10])/int(lineList[9]))
		while i < int(lineList[9]):
			date1 = random_date(lineList[0])
			insert_person([randomPersonNumber(), date1,
				lineList[1][0:5],lineList[2], str(add_days(date1, averageDays)),
				lineList[5][0:5], lineList[6], lineList[8]])
			elements += 1
			i+=1
db.close()

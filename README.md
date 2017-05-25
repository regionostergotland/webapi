# Example of simple API

## Installing and running
Navigate to project folder and type into console:

```
npm install
npm start
```
The API server will be availible on printed port on localhost

## Calls
| Route                                                     | HTTP Verb     | Description                                          |
| --------------------------------------------------------  |:-------------:| ----------------------------------------------------:|
| /persons                                                  | GET           | Get all persons in DB                                |
| /persons/:id                                              | GET           | Get a single person with id                          |

## Headers
| Route      | Key          | Expected values                                                                     | Description                                                       |
| ---------- |:------------:| :----------------------------------------------------------------------------------:| -----------------------------------------------------------------:|
| /persons   | filter       | personNumber, startDate, startJob, startCode, stopDate, stopJob, stopCode, svfType  | Only show the values declared in the filter, if no filter show all|
| /persons   | personNumber | A Swedish person number, example 19340404-2323                                      | Only show rows with the specified personNumber                    |
| /persons   | startDate    | Date, example 2017-01-01                                                            | Only show rows with the specified StartDate                       |
| /persons   | startJob     | Start job code, exemple 233                                                         | Only show rows with the specified StartJob                        |
| /persons   | startCode    | KVÅ-code, example AJ233                                                             | Only show rows with the specified StartCode                       |
| /persons   | stopDate     | ..............                                                                      | Only show rows with the specified stopDate                        |
| /persons   | stopJob      | ..............                                                                      | Only show rows with the specified stopJob                         |
| /persons   | stopCode     | ..............                                                                      | Only show rows with the specified stopCode                        |
| /persons   | svfType      | ..................                                                                  | Only show rows with the specified SVF                             |
| /persons   | minStartDate | Date, example 2017-01-01                                                            | Only show rows with startDate >= specified date                   |
| /persons   | maxStartDate | Date, example 2017-01-01                                                            | Only show rows with startDate < specified date                    |
| /persons   | minStopDate  | Date, example 2017-01-01                                                            | Only show rows with stopDate >= specified date                    |
| /persons   | maxStopDate  | Date, example 2017-01-01                                                            | Only show rows with stopDate < specified date                     |
| /persons   | sort         | personNumber, startDate, startJob, startCode, stopDate, stopJob, stopCode, svfType, personNumberD, startDateD, startJobD, startCodeD, stopDateD, stopJobD, stopCodeD, svfTypeD                                                           | Sort the values, startDate sorts by "smallest" date first and startDateD "largest" first.                 |

## Example
| HTTP Verb | URL                                                                                          | Description                                                          |
|-----------|:--------------------------------------------------------------------------------------------:| --------------------------------------------------------------------:|
| GET       | http://visualcare.sytes.net:8080/persons?filter=personNumber,stopDate&startDate=2015-10-03   | Shows person number and stop date where the start date == 2015-01-01 |
| GET       | http://visualcare.sytes.net:8080/persons?minStartDate=2016-01-02&maxStartDate=2016-01-15     | Show all person with 2016-01-02 <= startDate < 2016-01-15            |
| GET       | http://visualcare.sytes.net:8080/persons?startJob=VJ%                                        | Show all persons with startDate starting with VJ                     |
| GET       | http://visualcare.sytes.net:8080/persons?personNumber=1950-%-03                              | Show all persons born in 1950-XX-03                                  |
| GET       | http://visualcare.sytes.net:8080/persons?sort=personNumber                                   | Show all persons and sort by youngest first                          |


## Code Examples 
### Example 1
Get all data from db and print personNumber for every person. 
Note: jQuery must be added befor the script in the HTML file: 
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> 
```
```javascript
function initGet() {
	$.ajax({
		url: 'http://visualcare.sytes.net:8080/persons',
		type: 'GET',
		dataType: 'json',
		success: function(db_data) {
		    // Loop over every person
            for(var i = 0; i < db_data.length; i++){
                // Log the personNumber of the user
                console.log(db_data[i].personNumber);
            }
		}
	});
}
initGet();
```

### Example 2
Get and print startCode from persons with startDate >= 2016-01-01 and sort after startDate. 
Note: jQuery must be added befor the script in the HTML file: 
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> 
```
```javascript
function initGet() {
	$.ajax({
		url: 'http://visualcare.sytes.net:8080/persons?filter=startCode&minStartDate=2016-01-01&sort=startDate',
		type: 'GET',
		dataType: 'json',
		success: function(db_data) {
		    // Loop over every person
            for(var i = 0; i < db_data.length; i++){
                // Log the startCode of the user
                console.log(db_data[i].startCode);
            }
		}
	});
}
initGet();
```

### Example 3
Get start- & endJob where startJob like VJ% with the d3.json function. This will print the list of JSON-objects: 
```javascript
[{"stopJob":"VJ158","startJob":"VJ110"},{"stopJob":"VJ176","startJob":"VJ110"},...]
```

```javascript
d3.json("http://visualcare.sytes.net:8080/persons?filter=stopJob,startJob&startJob=VJ%", function(error, data) {
    console.log(data); 
});
```

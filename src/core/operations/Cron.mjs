/**
 * @author ransty [keano.porcaro@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation";
import OperationError from "../errors/OperationError";

/**
 * Cron operation
 */
class Cron extends Operation {

    /**
     * Cron constructor
     */
    constructor() {
        super();

        this.name = "Cron";
        this.module = "Default";
        this.description = "Convert an English statement to a CRON expression";
        this.infoURL = "https://en.wikipedia.org/wiki/Cron#CRON_expression";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "At every minute past hour 4 in February",
                type: "string",
                value: "* 4 * 2 *"
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const statement = args[0];

        var inputArray = input.toLowerCase().split(" ");
	if (inputArray.length != 5)
		return "not a valid CRON expression";
	var format = /[!@#$%^&()_+\=\[\]{};':"\\|.<>\/?a-zA-Z]/;
	for (var i = 0; i < inputArray.length; i++) {
		if (inputArray[i] == "" || format.test(inputArray[i]) == true) {
			return "not a valid CRON expression";
		}
	}	
	
	var minute = inputArray[0];
	var hour = inputArray[1];
	var dayOfMonth = inputArray[2];
	var month = inputArray[3];
	var day = inputArray[4];
	var returnStatement = "At";
	
	// Minute Controller
	if (minute != "*" && minute != "")
		if (parseInt(minute) > 59 || parseInt(minute) < 0)
			return "minute is not valid, please use between 0-59 or *";

	if (minute.length < 2 && hour.includes(",") == false)
		minute = "0" + minute;

	if (minute.includes("-")) {
		// Check if it actually has a legit range
		if (parseInt(minute.split('-').splice(0, 1)) >= parseInt(minute.split('-').splice(1, 1))) {
			return "not a valid CRON expression";
		} else if (minute.split('-').splice(0, 1) == "" || minute.split('-').splice(1, 1) == "") {
			return "not a valid CRON expression";
		}
	}
	
	var minuteArray = []
	if (minute.includes(",")) {
		// Since we can have multiple, split the whole into an array		
		minuteArray = minute.split(",");
		for (var i = 0; i < minuteArray.length; i++) {
			if (minuteArray[i] == "") {
				return "not a valid CRON expression";
			}
		}
	}

	// Hour Controller
	if (hour != "*" && hour != "") { 
		if (parseInt(hour) > 23 || parseInt(hour) < 0) { 
			return "hour is not valid, please use between 0-23 or *";
		}
	}
	if (hour.includes("-")) {
		if (parseInt(hour.split('-').splice(0, 1)) >= parseInt(hour.split('-').splice(1, 1))) {
			return "not a valid CRON expression";
		} else if (hour.split('-').splice(0, 1) == "" || hour.split('-').splice(1, 1) == "") {
			return "not a valid CRON expression";
		}
	}

	var hourArray = []
	if (hour.includes(",")) {
		hourArray = hour.split(",");
		for (var i = 0; i < hourArray.length; i++) {
			if (hourArray[i] == "") {
				return "not a valid CRON expression";
			}
		}
	}

	var hourMinute = "every minute";
	if (minuteArray != "" && hourArray == "") {
		hourMinute = "minute " + minuteArray.shift();
		for (var i = 0; i < minuteArray.length; i++) {
			if (minuteArray.length - 1 == i) {
				hourMinute = hourMinute + " and " + minuteArray[i];			
			} else {
				hourMinute = hourMinute + ", " + minuteArray[i];
			}
		}
		hourMinute = hourMinute + " past hour " + hour;
	} else if (minuteArray == "" && hourArray != "") {
		hourMinute = "minute " + minute + " past hour " + hourArray.shift();
		for (var i = 0; i < hourArray.length; i++) {
			if (hourArray.length - 1 == i) {
				hourMinute = hourMinute + " and " + hourArray[i];
			} else {
				hourMinute = hourMinute + ", " + hourArray[i];
			}
		}
	} else {
		if (minute != '*' && hour != '*' && minute.includes("-") == false && hour.includes("-") == false) {
			if (hour.length < 2) {
				hour = "0" + hour;
			}
			hourMinute = hour + ":" + minute;
		}
	       	if (minute != '*' && hour == '*') {
			hourMinute = "minute " + minute.replace('0', '');
		}
		if (minute == '*' && hour != '*') {
			hourMinute = "every minute past hour " + hour;
		}
		if (minute == '*' && hour == '*') {
			hourMinute = "every minute";
		}
		// check if there is a range included for minute
		if (minute.includes("-") && hour.includes("-") == false) {
			hourMinute = "every minute from " + minute.split('-').splice(0, 1) + " through " + minute.split('-').splice(1, 1) + " past hour " + hour;
		}
		if (hour.includes("-") && minute.includes("-") == false) {
			hourMinute = "minute " + minute + " past every hour from " + hour.split('-').splice(0, 1) + " through " + hour.split('-').splice(1, 1);
		}
		if (minute.includes("-") && hour.includes("-")) {
			hourMinute = "every minute from " + minute.split('-').splice(0, 1) + " through " + minute.split('-').splice(1, 1) + " past every hour from " + hour.split('-').splice(0, 1) + " through " + hour.split('-').splice(1, 1);
		}
	}
	returnStatement = returnStatement + " " + hourMinute;
	

	// Day of Month Controller
	var dayOfMonthStatement = "";
	if (dayOfMonth != "*") {
		if (parseInt(dayOfMonth) > 31 || parseInt(dayOfMonth) < 1)
			return "day-of-month is not valid, please use between 1 and 31 or *";
		if (dayOfMonth.includes("-")) {
			if ((parseInt(dayOfMonth.split('-').splice(0, 1)) >= parseInt(dayOfMonth.split('-').splice(1, 1)))) { 
				return "not a valid CRON expression";
			} else if ((dayOfMonth.split('-').splice(0, 1) == "" || dayOfMonth.split("-").splice(1, 1) == "")) {
				return "not a valid CRON expression";
			} else {
				dayOfMonthStatement = "on every day-of-month from " + dayOfMonth.split('-').splice(0, 1) + " through " + dayOfMonth.split('-').splice(1, 1);
			}
		} else {
			dayOfMonthStatement = "on day-of-month " + dayOfMonth;
		}
	}

		
	// Month controller
	var monthStatement = "";
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	if (month != "*") {
		if (parseInt(month) > 12 || parseInt(month) < 1)
			return "month is not valid, please use between 1 and 12 or *";
		if (month.includes("-")) {
			if (parseInt(month.split('-').splice(0, 1)) >= parseInt(month.split('-').splice(1, 1))) {
				return "not a valid CRON expression";
			}
			monthStatement = "in every month from " + months[parseInt(month.split('-').splice(0, 1))-1] + " through " + months[parseInt(month.split('-').splice(1, 1))-1];
		} else {
			monthStatement = "in " + months[parseInt(month)-1];
		}
	}

	// Day-of-week Controller
	var dayStatement = "";
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	if (day != "*") {
		if (parseInt(day) > 7 || parseInt(day) < 1)
			return "day is not valid, please use between 0 and 6 or *";
		dayStatement = "on ";
		if (day.includes("-")) { 
			if (parseInt(day.split('-').splice(0, 1)) >= parseInt(day.split('-').splice(1, 1))) {
				return "not a valid CRON expression";
			}
			dayStatement = "on every day-of-week from " + days[parseInt(day.split('-').splice(0, 1))] + " through " + days[parseInt(day.split('-').splice(1, 1))-1];
		} else {
			dayStatement = "on " + days[parseInt(day)-1];
		}
	}

	// Return statement Controller
	if (dayStatement != "" && monthStatement != "" && dayOfMonthStatement != "") {
		return returnStatement + " " + dayOfMonthStatement + " and " + dayStatement + " " + monthStatement; 
	} else if (dayStatement != "" && monthStatement != "" && dayOfMonthStatement == "") {
		return returnStatement + " " + dayStatement + " " + monthStatement;
	} else if (dayStatement!= "" && monthStatement == "" && dayOfMonthStatement == "") {
		return returnStatement + " " + dayStatement;
	} else if (hour != "" && monthStatement != "" && dayOfMonthStatement == "") {
		return returnStatement + " " + monthStatement + " " + dayStatement;
	} else {
		return returnStatement + " " + dayOfMonthStatement + " " + monthStatement + " " + dayStatement;
	}
    }
}

export default Cron;
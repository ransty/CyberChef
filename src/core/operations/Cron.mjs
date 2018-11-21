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
	var format = /[!@#$%^&()_+\=\[\]{};':"\\|,.<>\/?a-zA-Z]/;
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
		else if (minute.length < 2)
			minute = "0" + minute;
        
	// Hour Controller
	if (hour != "*" && hour != "")
		if (parseInt(minute) > 23 || parseInt(minute) < 0)
			return "hour is not valid, please use between 0-23 or *";

	var hourMinute = "every minute";
	if (minute != '*' && hour != '*' && minute.includes("-") == false && hour.includes("-") == false)
		if (hour.length < 2) {
			hour = "0" + hour;
		}
		hourMinute = hour + ":" + minute;
        if (minute != '*' && hour == '*')
		hourMinute = "minute " + minute.replace('0', '');
	if (minute == '*' && hour != '*')
		hourMinute = "every minute past hour " + hour;
	if (minute == '*' && hour == '*')
		hourMinute = "every minute";
	// check if there is a range included for minute
	if (minute.includes("-") && hour.includes("-") == false)
		hourMinute = "every minute from " + minute.split('-').splice(0, 1) + " through " + minute.split('-').splice(1, 1) + " past hour " + hour;
	if (hour.includes("-") && minute.includes("-") == false)
		if (parseInt(hour.split('-').splice(0, 1)) >= parseInt(hour.split('-').splice(1, 1)))
			return "not a valid CRON expression";
		hourMinute = "minute " + minute + " past every hour from " + hour.split('-').splice(0, 1) + " through " + hour.split('-').splice(1, 1);
	if (minute.includes("-") && hour.includes("-"))
		hourMinute = "every minute from " + minute.split('-').splice(0, 1) + " through " + minute.split('-').splice(1, 1) + " past every hour from " + hour.split('-').splice(0, 1) + " through " + hour.split('-').splice(1, 1);

	returnStatement = returnStatement + " " + hourMinute;

	// Day of Month Controller
	var dayOfMonthStatement = "";
	if (dayOfMonth != "*") {
		if (parseInt(dayOfMonth) > 31 || parseInt(dayOfMonth) < 1)
			return "day-of-month is not valid, please use between 1 and 31 or *";
		dayOfMonthStatement = "on day-of-month " + dayOfMonth;
	}

		
	// Month controller
	var monthStatement = "";
	if (month != "*")
		if (parseInt(month) > 12 || parseInt(month) < 1)
			return "month is not valid, please use between 1 and 12 or *";
		monthStatement = "in ";
		switch(parseInt(month)) {
    		case 1:
	        	monthStatement = monthStatement + "January";
        		break;
	    	case 2:
	        	monthStatement = monthStatement + "February";
	        	break;
	    	case 3:
	        	monthStatement = monthStatement + "March";
	        	break;
	    	case 4:
	        	monthStatement = monthStatement + "April";
	        	break;
	    	case 5:
	        	monthStatement = monthStatement + "May";
	        	break;
	    	case 6:
	        	monthStatement = monthStatement + "June";
	        	break;
	    	case 7:
	        	monthStatement = monthStatement + "July";
	        	break;
		case 8:
			monthStatement = monthStatement + "August";
			break;
		case 9: 
			monthStatement = monthStatement + "September";
			break;
		case 10:
			monthStatement = monthStatement + "October";
			break;
		case 11:
			monthStatement = monthStatement + "November";
			break;
		case 12:
			monthStatement = monthStatement + "December";
			break;
	    	default:
	        	monthStatement = "";
		} 

	// Day-of-week Controller
	var dayStatement = "";
	if (day != "*")
		if (parseInt(day) > 7 || parseInt(day) < 1)
			return "day is not valid, please use between 1 and 7 or *";
		dayStatement = "on ";
		switch(parseInt(day)) {
    		case 1:
	        	dayStatement = dayStatement + "Monday";
        		break;
	    	case 2:
	        	dayStatement = dayStatement + "Tuesday";
	        	break;
	    	case 3:
	        	dayStatement = dayStatement + "Wednesday";
	        	break;
	    	case 4:
	        	dayStatement = dayStatement + "Thursday";
	        	break;
	    	case 5:
	        	dayStatement = dayStatement + "Friday";
	        	break;
	    	case 6:
	        	dayStatement = dayStatement + "Saturday";
	        	break;
	    	case 7:
	        	dayStatement = dayStatement + "Sunday";
	        	break;
	    	default:
	        	dayStatement = "";
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

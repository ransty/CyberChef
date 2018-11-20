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
                name: "English Statement",
                type: "string",
                value: "At 00:00 on day-of-month 1 and 15 and on Wednesday"
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

	// work out how to stop anything but *, number, , and -
	//for (var j = 0; j < inputArray.length; j++) {
	//	if (/^\d+$/.test(inputArray[j]) == false) {
	//		return "That is a NOT a number";
	//	}
	//}

	var returnStatement = "At";

        if (inputArray.length < 5 || inputArray.length > 5)
		return "not a valid length for a CRON expression";
	
	// Minute Controller
	var minute = inputArray[0];
	if (minute != "*")
		if (parseInt(minute) > 59 || parseInt(minute) < 0)
			return "minute is not valid, please use between 0-59 or *";
		else if (minute.length < 2)
			minute = "0" + minute;
        
	// Hour Controller
	var hour = inputArray[1];
	if (hour != "*")
		if (parseInt(hour) > 23 || parseInt(hour) < 0)
			return "hour is not valid, please use between 0-23 or *";

	var hourMinute = "every minute";
	if (minute != '*' && hour != '*')
		hourMinute = hour + ":" + minute;
        if (minute != '*' && hour == '*')
		hourMinute = "minute " + minute.replace('0', '');
	if (minute == '*' && hour != '*')
		hourMinute = "every minute past hour " + hour;

	returnStatement = returnStatement + " " + hourMinute;

	// Day of Month Controller
	var dayOfMonth = inputArray[2];
	var dayOfMonthStatement = "";
	if (dayOfMonth != "*") {
		if (parseInt(dayOfMonth) > 31 || parseInt(dayOfMonth) < 1) { 
			return "day-of-month is not valid, please use between 1 and 31 or *";
		}
		dayOfMonthStatement = "on day-of-month " + dayOfMonth;
	}

	if (dayOfMonthStatement != "")
		returnStatement = returnStatement + " " + dayOfMonthStatement;
		
	// Month controller
	var month = inputArray[3];
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

	if (monthStatement != "")
		returnStatement = returnStatement + " " + monthStatement;

        return returnStatement;
    }

}

export default Cron;

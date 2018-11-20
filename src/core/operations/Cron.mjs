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
        // Parameters to use in statement
        // every, day-of-week, day-of-month, on, in,
        var inputArray = input.toLowerCase().split(" ");

	var returnStatement = "At";

        if (inputArray.length < 5 || inputArray.length > 6)
		return "not a valid length for a CRON expression";
	
	var minute = inputArray[0];
	if (minute != "*")
		if (parseInt(minute) > 59 || parseInt(minute) < 0)
			return "minute is not valid, please use between 0-59 or *";
		else if (minute.length < 2)
			minute = "0" + minute;
        
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

        return returnStatement;
    }

}

export default Cron;

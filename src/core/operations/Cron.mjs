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
        this.args = [{
            name: "At every minute past hour 4 in February",
            type: "string",
            value: "* 4 * 2 *"
        }, ];
    }

    /**
     * @description Compare input against lower and upper to make sure it's a valid CRON expression
     * @param {string} input
     * @param {int} lowerBound
     * @param {int} upperBound
     * @returns {boolean}
     */
    compareLengths(input, lowerBound, upperBound) {
        if (parseInt(input) > upperBound || parseInt(input) < lowerBound) {
            return true;
        }
        return false;
    }

    /**
     * @description Compare ranges from cron field to make sure it's invalid
     * @param {string} input
     * @returns {boolean}
     */
    compareRanges(input, lowerBound, upperBound) {
        var first = parseInt(input.split('-').splice(0, 1));
        var second = parseInt(input.split('-').splice(1, 1));
        if (first >= second || first == "" || second == "" || first > upperBound || first < lowerBound || second > upperBound || second < lowerBound) {
            return true;
        }
        return false;
    }

    /**
     * @description Generate ordinal numeral for a list of numbers with / contained
     * @param {string} list
     * @returns {string} ordinal
     */
    generateOrdinalNumerals(list) {
    	var secondNumber = parseInt(list.split("\/").splice(1, 1));
        var s = ["th", "st", "nd", "rd"], v = secondNumber % 100;
        return secondNumber + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    /**
     * @description Compare slash CRON expression and make sure it's within bounds
     * @param {string} input
     * @param {int} lowerBound
     * @param {int} upperBound
     * @returns {boolean}
     */
    compareSlashes(input, lowerBound, upperBound) {
        var secondNumber = input.split("\/").splice(1, 1);
        if (secondNumber == "" || secondNumber > upperBound || secondNumber < lowerBound) {
            return true;
        }
	return false;
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const statement = args[0];

        var inputArray = input.toLowerCase().split(" ");
        if (inputArray.length != 5) {
            return "invalid CRON expression";
        }

        var format = /[!@#$%^&()_+\=\[\]{};':"\\|.<>?a-zA-Z]/;
        for (var i = 0; i < inputArray.length; i++) {
            if (inputArray[i] == "" || format.test(inputArray[i]) == true) {
                return "invalid CRON expression";
            }
        }

        var minute = inputArray[0];
        var hour = inputArray[1];
        var dayOfMonth = inputArray[2];
        var month = inputArray[3];
        var day = inputArray[4];
        var returnStatement = "At";

        // Minute Controller
        if (minute != "*" && minute != "" && this.compareLengths(minute, 0, 59)) {
            return "invalid CRON expression";
        }

        if (minute.length < 2 && hour.includes(",") == false) {
            minute = "0" + minute;
        }

        if (minute.includes("-") && this.compareRanges(minute, 0, 59)) {
            return "invalid CRON expression";
        }

        if (minute.includes("\/") && this.compareSlashes(minute, 0, 59)) {
            return "invalid CRON expression";
        } else {
	    var secondMinute = minute.split("\/").splice(1, 1);
        }

        var minuteArray = []
        if (minute.includes(",")) {
            // Since we can have multiple, split the whole into an array
            minuteArray = minute.split(",");
            for (var i = 0; i < minuteArray.length; i++) {
                if (minuteArray[i] == "" || this.compareLengths(minuteArray[i], 0, 59)) {
                    return "invalid CRON expression";
                }
            }
        }

        // Hour Controller
        if (hour != "*" && hour != "") {
            this.compareLengths(hour, 0, 23);
        }

        if (hour.includes("-") && this.compareRanges(hour, 0, 23)) {
            return "invalid CRON expression";
        }

        var hourArray = []
        if (hour.includes(",")) {
            hourArray = hour.split(",");
            for (var i = 0; i < hourArray.length; i++) {
                if (hourArray[i] == "" || this.compareLengths(hourArray[i], 0, 23)) {
                    return "invalid CRON expression";
                }
            }
        }

        if (hour.includes("\/") && this.compareSlashes(hour, 0, 23)) {
            return "invalid CRON expression";
        } else {
	    var secondHour = hour.split("\/").splice(1, 1);
        }

        var hourMinute = "every minute";
        var hourMinuteBuffer = [];
        if (minuteArray != "" && hourArray == "") {
            hourMinuteBuffer.push("minute " + minuteArray.shift());
            for (var i = 0; i < minuteArray.length; i++) {
                if (minuteArray.length - 1 == i) {
                    hourMinuteBuffer.push(" and " + minuteArray[i]);
                } else {
                    hourMinuteBuffer.push(", " + minuteArray[i]);
                }
            }
            hourMinuteBuffer.push(" past hour " + hour);
            hourMinute = hourMinuteBuffer.join("");
        } else if (minuteArray == "" && hourArray != "") {
            hourMinuteBuffer.push("minute " + minute + " past hour " + hourArray.shift());
            for (var i = 0; i < hourArray.length; i++) {
                if (hourArray.length - 1 == i) {
                    hourMinuteBuffer.push(" and " + hourArray[i]);
                } else {
                    hourMinuteBuffer.push(", " + hourArray[i]);
                }
            }
            hourMinute = hourMinuteBuffer.join("");
        } else if (minuteArray != "" && hourArray != "") {
            hourMinuteBuffer.push("minute " + minuteArray.shift());
            for (var i = 0; i < minuteArray.length; i++) {
                if (minuteArray.length - 1 == i) {
                    hourMinuteBuffer.push(" and " + minuteArray[i]);
                } else {
                    hourMinuteBuffer.push(", " + minuteArray[i]);
                }
            }
            hourMinuteBuffer.push(" past hour " + hourArray.shift());
            for (var j = 0; j < hourArray.length; j++) {
                if (hourArray.length - 1 == j) {
                    hourMinuteBuffer.push(" and " + hourArray[j]);
                } else {
                    hourMinuteBuffer.push(", " + hourArray[j]);
                }
            }
            hourMinute = hourMinuteBuffer.join("");
        } else {
            if (minute != '*' && hour != '*' && minute.includes("-") == false && hour.includes("-") == false && minute.includes("\/") == false) {
                if (hour.length < 2) {
                    hour = "0" + hour;
                }
                hourMinute = hour + ":" + minute;
            }
            if (minute != '*' && hour == '*' && minute.includes("\/") == false) {
                hourMinute = "minute " + minute.replace('0', '');
            }
            if (minute == '*' && hour != '*' && minute.includes("\/") == false) {
                hourMinute = "every minute past hour " + hour;
            }
            if (minute == '*' && hour == '*' && minute.includes("\/") == false) {
                hourMinute = "every minute";
            }
            // check if there is a range included for minute
            if (minute.includes("-") && hour.includes("-") == false && minute.includes("\/") == false) {
                hourMinute = "every minute from " + minute.split('-').splice(0, 1) + " through " + minute.split('-').splice(1, 1) + " past hour " + hour;
            }
            if (hour.includes("-") && minute.includes("-") == false && minute.includes("\/") == false) {
                hourMinute = "minute " + minute + " past every hour from " + hour.split('-').splice(0, 1) + " through " + hour.split('-').splice(1, 1);
            }
            if (minute.includes("-") && hour.includes("-") && minute.includes("\/") == false) {
                hourMinute = "every minute from " + minute.split('-').splice(0, 1) + " through " + minute.split('-').splice(1, 1) + " past every hour from " + hour.split('-').splice(0, 1) + " through " + hour.split('-').splice(1, 1);
            }
            var secondMinute = ""
            var secondHour = ""
            if (minute.includes("\/")) {
		secondMinute = this.generateOrdinalNumerals(minute);
            }

            if (hour.includes("\/")) {
                secondHour = this.generateOrdinalNumerals(hour);
            }

            var slashArray = [];
            if (secondMinute != "" && secondHour != "") {
                if (secondMinute == "1st") {
                    slashArray.push("every minute from 1 through 59");
                } else {
                    slashArray.push("every " + secondMinute + " minute from " + minute.split("\/").splice(0, 1) + " through 59");
                }

                if (secondHour == "1st") {
                    slashArray.push("past every hour from " + hour.split("\/").splice(0, 1) + " through 23");
                } else {
                    slashArray.push("past every " + secondHour + " hour from " + hour.split("\/").splice(0, 1) + " through 23");
                }
                hourMinute = slashArray.join(" ");
            }


            if (secondMinute != "" && secondHour == "") {
                if (secondMinute == "1st") {
                    hourMinute = "every minute from 1 through 59";
                } else {
                    hourMinute = "every " + secondMinute + " minute from " + minute.split("\/").splice(0, 1) + " through 59 past hour " + hour;
                }
            }

            if (secondMinute == "" && secondHour != "") {
                if (secondHour == "1st") {
                    hourMinute = "minute " + minute + " past every hour from " + hour.split("\/").splice(0, 1) + " through 23";
                } else {
                    hourMinute = "minute " + minute + " past every " + secondHour + " hour from " + hour.split("\/").splice(0, 1) + " through 23";
                }
            }
        }
        returnStatement = returnStatement + " " + hourMinute;


        // Day of Month Controller
        var dayOfMonthStatement = "";
        if (dayOfMonth != "*") {
            if (this.compareLengths(dayOfMonth, 1, 31)) {
                return "invalid CRON expression";
            }

            if (dayOfMonth.includes("-") && this.compareRanges(dayOfMonth, 1, 31)) {
 		    return "invalid CRON expression";
            } else {
                    dayOfMonthStatement = "on every day-of-month from " + dayOfMonth.split('-').splice(0, 1) + " through " + dayOfMonth.split('-').splice(1, 1);
            }

         } else {
            dayOfMonthStatement = "on day-of-month " + dayOfMonth;
         }

        // Month controller
        var monthStatement = "";
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        if (month != "*") {
            if (this.compareLengths(month, 1, 12)) {
                return "invalid CRON expression";
            }

            if (month.includes("-")) {
		if (this.compareRanges(month, 1, 12)) {
		    return "invalid CRON expression";
		}
                monthStatement = "in every month from " + months[parseInt(month.split('-').splice(0, 1)) - 1] + " through " + months[parseInt(month.split('-').splice(1, 1)) - 1];
            } else {
                monthStatement = "in " + months[parseInt(month) - 1];
            }
        }

        // Day-of-week Controller
        var dayStatement = "";
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        if (day != "*") {
            if (this.compareLengths(day, 1, 7)) {
                return "day is not valid, please use between 1 and 7 or *";
	    }
            dayStatement = "on ";
            if (day.includes("-")) {
                if (this.compareRanges(day, 1, 7)) {
                    return "not a valid CRON expression";
                }
                dayStatement = "on every day-of-week from " + days[parseInt(day.split('-').splice(0, 1))-1] + " through " + days[parseInt(day.split('-').splice(1, 1)) - 1];
            } else {
                dayStatement = "on " + days[parseInt(day)-1];
            }
        }

        // Return statement Controller
        if (dayStatement != "" && monthStatement != "" && dayOfMonthStatement != "") {
            return returnStatement + " " + dayOfMonthStatement + " and " + dayStatement + " " + monthStatement;
        } else if (dayStatement != "" && monthStatement != "" && dayOfMonthStatement == "") {
            return returnStatement + " " + dayStatement + " " + monthStatement;
        } else if (dayStatement != "" && monthStatement == "" && dayOfMonthStatement == "") {
            return returnStatement + " " + dayStatement;
        } else if (hour != "" && monthStatement != "" && dayOfMonthStatement == "") {
            return returnStatement + " " + monthStatement + " " + dayStatement;
        } else {
            return returnStatement + " " + dayOfMonthStatement + " " + monthStatement + " " + dayStatement;
        }
    }
}

export default Cron;

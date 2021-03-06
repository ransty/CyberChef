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
        this.description = "Convert an CRON expression to an English statement";
        this.infoURL = "https://en.wikipedia.org/wiki/Cron#CRON_expression";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [{
            name: "* 4 * 2 *",
            type: "string",
            value: "At every minute past hour 4 in February"
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

    generateList(input, lowerBound, upperBound) {
	var arr = [];
	arr = input.split(",");
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == "" || this.compareLengths(arr[i], lowerBound, upperBound)) {
			return [];
		}
	}
	return arr;
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const statement = args[0];
	
	// Validation of input
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

        if (minute != "*" && minute != "" && this.compareLengths(minute, 0, 59)) {
            return "invalid CRON expression";
        }

        if (minute.includes("-") && this.compareRanges(minute, 0, 59)) {
            return "invalid CRON expression";
        }

        if (minute.includes("\/")) {
	    var secondMinute = minute.split("\/").splice(1, 1);
        }

        var minuteArray = [];
        if (minute.includes(",")) {
        	minuteArray = this.generateList(minute, 0, 59);
		if (minuteArray.length == 0) {
			return "invalid CRON expression";
		}
        }

        if (hour.includes("-") && this.compareRanges(hour, 0, 23)) {
            return "invalid CRON expression";
        }
	
	var hourArray = [];
	if (hour.includes(",")) {
	        hourArray = this.generateList(hour, 0, 23);
		if (hourArray.length == 0) {
			return "invalid CRON expression";
		}
	}

	var dayOfMonthArray = [];
	if (dayOfMonth.includes(",")) {
		dayOfMonthArray = this.generateList(dayOfMonth, 1, 31);
		if (dayOfMonthArray.length == 0) {
			return "invalid CRON expression";
		}
	}

	var dayArray = [];
	if (day.includes(",")) {
		dayArray = this.generateList(day, 1, 7);
		if (dayArray.length == 0) {
			return "invalid CRON expression";
		}
	}
		
	var monthArray = [];
	if (month.includes(",")) {
		monthArray = this.generateList(month, 1, 31);
		if (monthArray.length == 0) {
			return "invalid CRON expression";
		}
	}


        if (hour.includes("\/")) {
	    var secondHour = hour.split("\/").splice(1, 1);
        }

        if (dayOfMonth.includes("-") && this.compareRanges(dayOfMonth, 1, 31)) {
	    return "invalid CRON expression";
        }

        var dayOfMonthStatement = "";
        if (dayOfMonth != "*") {
            if (this.compareLengths(dayOfMonth, 1, 31)) {
                return "invalid CRON expression";
            }

	    if (dayOfMonth.includes("-")) {
                dayOfMonthStatement = "on every day-of-month from " + dayOfMonth.split('-').splice(0, 1) + " through " + dayOfMonth.split('-').splice(1, 1);
            }

	    if (dayOfMonth.includes("\/")) {
		var firstDayMonth = dayOfMonth.split('\/').splice(0, 1);
	        var secondDayMonth = this.generateOrdinalNumerals(dayOfMonth);
		if (secondDayMonth == "1st") {
			if (firstDayMonth == "*") {
				dayOfMonthStatement = "on every day-of-month";
			} else {
				dayOfMonthStatement = "on every day-of-month from " + firstDayMonth + " through 31";
			}
		} else if (secondDayMonth != "" && firstDayMonth != "*") {
			dayOfMonthStatement = "on every " + secondDayMonth + " day-of-month from " + firstDayMonth + " through 31";
		} else {
			dayOfMonthStatement = "on every " + secondDayMonth + " day-of-month";
		}
	    } else {
		dayOfMonthStatement = "on day-of-month " + dayOfMonth;
	    }
         }


        if (minute.length < 2 && hour.includes(",") == false) {
            minute = "0" + minute;
        }

        // Hour Controller
        if (hour != "*" && hour != "") {
            this.compareLengths(hour, 0, 23);
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

            var secondMinute = "";
            var secondHour = "";
	    var firstMinute = "";
            var firstHour = "";

            if (minute.includes("\/")) {
		firstMinute = minute.split("\/").splice(0, 1);
		secondMinute = this.generateOrdinalNumerals(minute);
            }

            if (hour.includes("\/")) {
		firstHour = hour.split("\/").splice(0, 1);
                secondHour = this.generateOrdinalNumerals(hour);
            }

            var slashBuffer = [];
            if (secondMinute != "" && secondHour != "") {
                    if (secondMinute == "1st") {
			if (firstMinute == "*") {
		    		slashBuffer.push("every minute");
			} else {
	                        slashBuffer.push("every minute from 1 through 59");
			}
	            } else {
			if (firstMinute == "*") {
				slashBuffer.push("every " + secondMinute + " minute");
			} else {
			        slashBuffer.push("every " + secondMinute + " minute from " + minute.split("\/").splice(0, 1) + " through 59");
			}

                if (secondHour == "1st") {
			if (firstHour == "*") {
				slashBuffer.push("past every hour");
			} else {
	        	        slashBuffer.push("past every hour from " + hour.split("\/").splice(0, 1) + " through 23");
			}
        	    } else {
			if (firstHour == "*") {
				slashBuffer.push("past every " + secondHour + " hour");
			} else {
	        	        slashBuffer.push("past every " + secondHour + " hour from " + hour.split("\/").splice(0, 1) + " through 23");
			}
        	    }
                    hourMinute = slashBuffer.join(" ");
        	}
            }


            if (secondMinute != "" && secondHour == "") {
                if (secondMinute == "1st") {
			if (firstMinute == "*") {
				slashBuffer.push("every minute");
			} else {
		                slashBuffer.push("every minute from 1 through 59");
			}
                } else {
			if (firstMinute == "*") {
				slashBuffer.push("every " + secondMinute + " minute past hour " + hour);
			} else {
	                        slashBuffer.push("every " + secondMinute + " minute from " + minute.split("\/").splice(0, 1) + " through 59 past hour " + hour);
			}
                }
		hourMinute = slashBuffer.join(" ");
            }

            if (secondMinute == "" && secondHour != "") {
                if (secondHour == "1st") {
			if (firstHour == "*") {
				slashBuffer.push("past every hour");
			} else {
	                    slashBuffer.push("minute " + minute + " past every hour from " + hour.split("\/").splice(0, 1) + " through 23");
			}
                } else {
			if (firstHour == "*") {
				slashBuffer.push("past every " + secondHour + " hour");
			} else {
	                        slashBuffer.push("minute " + minute + " past every " + secondHour + " hour from " + hour.split("\/").splice(0, 1) + " through 23");
			}
                }
		hourMinute = slashBuffer.join(" ");
            }
        }
        returnStatement = returnStatement + " " + hourMinute;


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
            } else if (month.includes("\/")) {
		var firstMonth = month.split('\/').splice(0, 1);
	        var secondMonth = this.generateOrdinalNumerals(month);
		if (secondMonth == "1st") {
			if (firstMonth == "*") {
				monthStatement = "in every month";
			} else {
				monthStatement = "in every month from " + months[firstMonth-1] + " through " + months[11];
			}
		} else if (secondMonth != "" && firstMonth != "*") {
			monthStatement = "in every " + secondMonth + " month from " + months[firstMonth-1] + " through " + months[11];
		} else {
			monthStatement = "in every " + secondMonth + " month";
		}
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
	    } else if (day.includes("\/")) {
		var firstDay = day.split('\/').splice(0, 1);
		var secondDay = this.generateOrdinalNumerals(day);
		if (secondDay == "1st") {
			if (firstDay == "*") {
				dayStatement = "on every day-of-week";			
			} else {
				dayStatement = "on every day-of-week from " + days[firstDay-1] + " through " + days[6];
			}
		} else  if (secondDay != "" && firstDay != "*") {
			dayStatement = "on every " + secondDay + " day-of-week from " + days[firstDay-1] + " through " + days[6];
		} else {
			dayStatement = "on every " + secondDay + " day-of-week";
		}
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

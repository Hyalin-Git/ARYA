// Those small functions are usefull to format a scheduled date on a post, a task or the calendar.

exports.formatDates = (moment, hour, minute, day, month, year) => {
	moment
		.hour(hour ? hour : moment.hour())
		.minute(minute ? minute : moment.minute())
		.date(day ? day : moment.date())
		.month(month ? month : moment.month())
		.year(year ? year : moment.year());

	return moment.format();
};

exports.getFormattedDates = (moment, hour, minute, day, month, year) => {
	// Getting the dates
	const dateIsGiven = hour || minute || day || month || year;

	const formattedDate =
		// If the user gave a date
		dateIsGiven &&
		// Then format the dates
		this.formatDates(moment, hour, minute, day, month, year);

	return formattedDate;
};

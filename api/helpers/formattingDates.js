// Those small functions are usefull to format a scheduled date on a post, a task or the calendar.

exports.formatDates = (moment, year, month, day) => {
	moment
		.year(year ? year : moment.year())
		.month(month ? month : moment.month())
		.date(day ? day : moment.date());

	return moment.format();
};

exports.getFormattedDates = (moment, year, month, day) => {
	// Getting the dates
	const dateIsGiven = year || month || day;

	const formattedDate =
		// If the user gave a date
		dateIsGiven &&
		// Then format the dates
		this.formatDates(moment, year, month, day);

	return formattedDate;
};

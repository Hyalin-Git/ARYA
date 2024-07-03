export const regex = {
	names: /^[a-zA-Z'-]{2,16}$/,
	userName: /^(?!.*\.\.)(?!.*\.$)(?!.*@)[a-zA-Z0-9_-]{2,16}$/,
	email:
		/^(?!.*@.*\.co$)(?=[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/,
	biographie: /^[\wÀ-ÿ.,!?'"()\s-]{0,500}$/,
	job: /^[\w\sÀ-ÿ-]{2,50}$/,
	password: {
		pass: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?[\];',.\/\\-])[a-zA-Z\d!@#$%^&*()_+{}|:"<>?[\];',.\/\\-]{8,}$/,
		hasLowerCase: /(?=.*?[a-z])/,
		hasUpperCase: /(?=.*[A-Z])/,
		hasDigit: /(?=.*?[0-9])/,
		hasSymbol: /(?=.*?[#?!@$%^&*-])/,
	},
	website: /^https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/,
	phone: /^\+(?:[0-9] ?){6,14}[0-9]$/,
	dateOfBirth: /^(?:\d{4}-\d{2}-\d{2})|(?:\d{1,2}\/\d{1,2}\/\d{4})$/,
	company: /^[A-Za-z0-9\s\-']+$/,
	link: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
};

export const socialRegex = {
	x: /^https:\/\/x\.com\/[a-zA-Z0-9_]+\/?$/,
	tiktok: /^https:\/\/www\.tiktok\.com\/@[\w.-]+\/?$/,
	instagram: /^https:\/\/www\.instagram\.com\/[a-zA-Z0-9_\-\.]+\/?$/,
	facebook: /^https:\/\/www\.facebook\.com\/[a-zA-Z0-9.]+\/?$/,
	linkedIn: /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9\-\.]+\/?$/,
	youtube: /^https:\/\/www\.youtube\.com\/(c\/)?[\w-]+\/?$/,
	twitch: /^https:\/\/www\.twitch\.tv\/[\w-]+\/?$/,
};

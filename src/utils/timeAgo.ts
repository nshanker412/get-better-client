export const timeAgo = (epoch: number): string => {
	const now = new Date();
	const postTime = new Date(epoch * 1000);
	const diffInSeconds = Math.floor(
		(now.getTime() - postTime.getTime()) / 1000,
	);

	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;

	if (diffInSeconds < minute) {
		return `${diffInSeconds} seconds ago`;
	} else if (diffInSeconds < hour) {
		const minutes = Math.floor(diffInSeconds / minute);
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < day) {
		const hours = Math.floor(diffInSeconds / hour);
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else {
		const days = Math.floor(diffInSeconds / day);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	}
};


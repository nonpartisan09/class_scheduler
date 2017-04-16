export const cleanupKeys = obj => {
	Object.keys(obj).forEach(key => {
		const val = obj[key];

		const levels = key.split(".")

		if (levels.length > 1) {
			const last = levels[levels.length-1];
			let root = obj;
			levels.forEach(level => {
				if (!root[level]) root[level] = {};

				if (level === last) {
					root[level] = val;
				}	else {
					root = root[level];
				}
			})
			delete obj[key];
		}
	})
	return obj;
};
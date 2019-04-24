lookup();

// Create an observer instance
const target = document.querySelector('.tiered-results-container');

const observer = new WebKitMutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		// console.log(mutation, mutation.type);
	});
	// run main function again if result set has changed
	lookup();
});
observer.observe(target, {
	childList: true,
	subtree: true
});

function isDevMode() {
	return !('update_url' in chrome.runtime.getManifest());
}

function findDataNew() {
	return new Promise((resolve, reject) => {
		let propertyArr = [];
		const elements = document.getElementsByClassName('results-card residential-card');
		for (let element of elements) {
			propertyArr.push({
				fullAddress: element.getAttribute('aria-label')
			});
		}
		return resolve(propertyArr);
	})
}

async function lookup() {
	const records = await findDataNew();
	if (records) {
		records.forEach(async record => {
			try {
				const response = await fetch(`http://localhost:8010/rock-bonus-238400/us-central1/lookup?address=${record.fullAddress}`);
				console.log(await response.json());
			} catch (err) {
				console.log('fetch failed', err);
			}
		});
	}
	return;
}
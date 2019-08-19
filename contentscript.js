lookup();

// Create an observer instance
const target = document.querySelector('.sort-type-filter__select-container');

const observer = new WebKitMutationObserver((mutations) => {
	const mutationArr = [];
	mutations.forEach((mutation) => {
		// console.log(mutation.type);
		// console.log(mutation);
		if (mutation && mutation.type == 'characterData') {
			mutationArr.push(mutation.target);
		}
	});
	// run main function again if result set has changed
	// console.log(mutationArr);
	if (mutationArr.length > 0) {
		// lookup();
	}
	// lookup(); // this is causing problems
});
observer.observe(target, {
	characterData: true,
	childList: true,
	subtree: true
});

function makeid() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

function isDevMode() {
	return !('update_url' in chrome.runtime.getManifest());
}

function findDataNew() {
	return new Promise((resolve, reject) => {
		let propertyArr = [];
		const elements = document.getElementsByClassName('results-card residential-card');
		for (let element of elements) {
			// we will refer back to this id
			const propertyID = makeid();
			// create a new loading div for nbn info
			const imgURL = chrome.extension.getURL('./images/spinner.svg');
			const div = document.createElement('div');
			div.className = propertyID;
			div.innerHTML = `<span style="font-weight: bold;">nbn</span>
			<span class="nbnStatus"><img src="${imgURL}"></span>`
			// append loading status to div
			const listingInfo = element.querySelector('.residential-card__primary-features');
			listingInfo.appendChild(div);
			propertyArr.push({
				fullAddress: element.getAttribute('aria-label'),
				propertyID
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
				const response = await fetch(`http://localhost:8010/rock-bonus-238400/us-central1/lookup?address=${record.fullAddress}&propertyID=${record.propertyID}`);
				const data = await response.json();
				// console.log(data);
				if (data && data.success) {
					const element = document.querySelector(`.${data.success.propertyID}`);
					const nbnInfo = element.querySelector('.nbnStatus');
					nbnInfo.innerHTML = `<span>${data.success.techType}</span>
					<span>${data.success.serviceStatus}</span>`;
				}
			} catch (err) {
				console.log('fetch failed', err);
			}
		});
	}
	return;
}
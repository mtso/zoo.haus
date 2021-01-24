(function() {

	function findGetParameter(parameterName) {
	    var result = null,
	        tmp = [];
	    var items = location.search.substr(1).split("&");
	    for (var index = 0; index < items.length; index++) {
	        tmp = items[index].split("=");
	        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	    }
	    return result;
	}

	const apiUrl = 'https://api.zoo.haus'

	window.addEventListener('load', (e) => {

		fetch(apiUrl + '/users/@me', {
			credentials: "include", //"same-origin"
		}).then((resp) => resp.json()).then((user) => {
			// console.log(user)
			const name = user.discordLatestProfile && (user.discordLatestProfile.username + '#' + user.discordLatestProfile.discriminator)
			if (name) {
				const div = document.getElementById('display-id')
				div.innerText = name
				setMemberBar(user)
			}

		}).catch((err) => {
			console.error(err)
		})

		// fetch(apiUrl + '/users/@me/orders', {
		// 	credentials: "include",
		// }).then((resp) => resp.json()).then((orders) => {
		// 	console.log(orders)
		// 	const pre = document.getElementById('display-orders')
		// 	pre.innerText = JSON.stringify(orders, null, 2)

		// })
	})

	function setMemberBar(user) {
		const bar = document.createElement('div')
		bar.style.backgroundColor = 'lavender'
		bar.style.color = 'black'
		bar.style.position = 'fixed'
		bar.style.top = '0'
		bar.style.width = '100%'
		bar.style.height = '16px'
		bar.style.textAlign = 'center'
		bar.style.verticalAlign = 'middle'
		bar.style.lineHeight = '16px'
		bar.style.fontSize = '0.6em'

		bar.innerText = 'FnF'// user.id
		bar.setAttribute('class', 'bar-slide-in-top')
		document.body.appendChild(bar)
	}
})()

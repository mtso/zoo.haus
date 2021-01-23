import { h, text, app } from "https://unpkg.com/hyperapp"
import { request } from "https://unpkg.com/@hyperapp/http"

const API_URL = "https://kakari.herokuapp.com/";
// const API_URL = "http://localhost:3000";

const routing = (function() {
	function getOrigin(loc) {
	  return loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "")
	}

	function isExternal(anchorElement) {
	  // Location.origin and HTMLAnchorElement.origin are not
	  // supported by IE and Safari.
	  return getOrigin(location) !== getOrigin(anchorElement)
	}

	function Link(props, children) {
	    var to = props.to
	    var location = props.location
	    var onclick = props.onclick
	    delete props.to
	    delete props.location

	    props.href = to
	    props.onclick = (state, e) => {
	    	if (onclick) {
	    		onclick(state, e)
	    	}
		    if (
		        e.defaultPrevented ||
		        e.button !== 0 ||
		        e.altKey ||
		        e.metaKey ||
		        e.ctrlKey ||
		        e.shiftKey ||
		        props.target === "_blank" ||
		        isExternal(e.currentTarget)
		      ) {
		      } else {
		        e.preventDefault()

		        if (to !== window.location.pathname) {
		        	console.log('pushing state', window.location.pathname, to)
		          history.pushState(window.location.pathname, "", to)
		          const newLocation = {
	    			pathname: to,
	    			previous: window.location.previous,
	    		  }
		          console.log('location', state.location, newLocation)
		          return Object.assign({}, state, {
			    		location: newLocation
			    	})
		        }
		      }
		       return state
	    }

	    return h("a", props, children)
	}

	function createMatch(isExact, path, url, params) {
	  return {
	    isExact: isExact,
	    path: path,
	    url: url,
	    params: params
	  }
	}

	function trimTrailingSlash(url) {
	  for (var len = url.length; "/" === url[--len]; );
	  return url.slice(0, len + 1)
	}

	function decodeParam(val) {
	  try {
	    return decodeURIComponent(val)
	  } catch (e) {
	    return val
	  }
	}

	function parseRoute(path, url, options) {
	  if (path === url || !path) {
	    return createMatch(path === url, path, url)
	  }

	  var exact = options && options.exact
	  var paths = trimTrailingSlash(path).split("/")
	  var urls = trimTrailingSlash(url).split("/")

	  console.log('parseRoute', exact, paths, urls)
	  if (paths.length > urls.length || (exact && paths.length < urls.length)) {
	    return
	  }

	  for (var i = 0, params = {}, len = paths.length, url = ""; i < len; i++) {
	    if (":" === paths[i][0]) {
	      params[paths[i].slice(1)] = urls[i] = decodeParam(urls[i])
	    } else if (paths[i] !== urls[i]) {
	      return
	    }
	    url += urls[i] + "/"
	  }

	  return createMatch(false, path, url.slice(0, -1), params)
	}

	function Route(props, children) {
		var location = props.location
	    var match = parseRoute(props.path, location.pathname, {
	      exact: !props.parent
	    })
	    console.log('Route render', match)

	    return (
	      match && children({ match: match, location: location })
	    )
	}

	function makeLoc() {
		const GotLocation = (state, location) => {
			console.log('GotLocation', state, location)
			return Object.assign({}, state, { location })
		}
		function wrapHistory(keys) {
		  return keys.reduce(function(next, key) {
		    var fn = history[key]

		    history[key] = function(data, title, url) {
		      fn.call(this, data, title, url)
		      dispatchEvent(new CustomEvent("pushstate", { detail: data }))
		    }

		    return function() {
		      history[key] = fn
		      next && next()
		    }
		  }, null)
		}

		const locationSub = (dispatch, props) => {
			console.log('locationSub', dispatch, props)
			function handleLocationChange(e) {
				const newLocation = {
					pathname: window.location.pathname + window.location.hash,
					previous: e.detail
						? (window.location.previous = e.detail) 
						: window.location.previous,
				}
				console.log('handleLocationChange', newLocation)
				dispatch([ GotLocation, newLocation ])
			}
			window.addEventListener('pushstate', handleLocationChange)
			window.addEventListener('popstate', handleLocationChange)
			var unwrap = wrapHistory(["pushState", "replaceState"])

			return function() {
				window.removeEventListener('pushstate', handleLocationChange)
				window.removeEventListener('popstate', handleLocationChange)
				unwrap()
			}
		}

		function getInitialPath() {
			return window.location.pathname + window.location.hash
		}
		const routingLocation = {
			state: {
				pathname: getInitialPath(),
				previous: window.location.pathname,
			},
			location: (props) => [locationSub, props],
		}
		return routingLocation
	}

	return {
		Link: Link,
		Route: Route,
		createRouter: makeLoc,
	}
})()

const Link = routing.Link
const Route = routing.Route
const createRouter = routing.createRouter

const router = createRouter()

const GotOrders = (state, ordersJson) => Object.assign({}, state, {
	fetchingOrders: false,
	orders: ordersJson.orders,
})

const orderItem = props => h("li", {}, [
	Link({ to: '/account/#/orders/' + props.id, location: props.location }, [
		text("Order "),
		text(props.name),
	])
])

const orderList = props => h("div", { class: "orders" }, [
	props.fetchingOrders && text("Loading Orders..."),
	!props.fetchingOrders && text("Orders"),
	h("ul", {}, props.orders && props.orders.map((order) => orderItem(order)))
])

const Orders = (state) => h("div", {class: "post-content"}, [orderList(state)])

const Raffles = () => {
	return h("div", {class: "post-content"}, [
		h("p", {}, [
			text("Raffles"),
			h("p", {}, text("There are no open raffles currently."))
		]),
		// h("p", {}, text("There are no open raffles currently.")),
	])
}

const Nav = (props) => h("div", {class: "post-date"}, [
	Link({ to: '/account/#/orders', class: 'nav-link', location: props.location }, text('Orders')),
	text(" "),
	Link({ to: '/account/#/raffles', class: 'nav-link', location: props.location }, text('Raffles')),
	text(" "),
	Link({ to: API_URL + '/auth/discord', class: 'nav-link', location: props.location }, text('Log In with Discord')),
	text(" "),
	Link({ to: API_URL + '/auth/logout', class: 'nav-link', location: props.location }, text('Log Out')),
])

const AppView = (props) => h("div", {}, [
	Nav(props),
	h("br", {}),
	h("br", {}),
	Route({ path: "/account/#/orders", location: props.location }, () => Orders(props)),
	Route({ path: "/account/#/raffles", location: props.location }, () => Raffles()),
])

const initialState = {
	fetchingOrders: true,
	orders: [],
	n: 0,
	location: router.state,
}

app({
	init: [
		initialState,
		request({
			url: API_URL + "/users/@me/orders",
			expect: "json",
			action: GotOrders,
			options: {
			    credentials: 'include',
			}
		}),
	],
	node: document.getElementById('app'),
	view: (state) => {
		return h("div", {}, [AppView(state)])
	},
	subscriptions: (state) => [
		router.location(),
	],
})

function isRouteActive (route , activeRoute) {
    return route === activeRoute ? 'active' : ''
}

module.exports = {isRouteActive};
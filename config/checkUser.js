
/*
    Admin has full access
    Client and Labeller can only access their own routes
*/

let isAdmin = function (request, response, next) {

    if(!request.user){
        request.flash("error", "Log In Required");
        response.redirect("/auth/login");
    } else if (request.user.userType != 0) {
        request.flash("error", "Admin Access Only")
        response.redirect("/");
    } else {
        next();
    }
}

let isClient = function (request, response, next) {
    
    if(!request.user){
        request.flash("error", "Log In Required");
        response.redirect("/auth/login");
    } else  if (request.user.userType == 1) {
        request.flash("error", "Client Access Only")
        response.redirect("/");
    } else {
        next();
    }
}

let isLabeller = function (request, response, next) {
    
    if(!request.user){
        request.flash("error", "Log In Required");
        response.redirect("/auth/login");
    } else if (request.user.userType == 2) {
        request.flash("error", "Labeller Access Only")
        response.redirect("/");
    } else {
        next();
    }
}

module.exports = {
    isAdmin, isClient, isLabeller
}
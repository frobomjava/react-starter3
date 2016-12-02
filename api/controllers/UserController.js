/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `UserController.login()`
   */
  signin: function (req, res) {

    // See `api/responses/login.js`
    console.log("----------- signin ----------------");
    console.log('userName : ' + req.param('userName'));
    console.log("----------- ====== ----------------");

    return res.signin({
      userName: req.param('userName'),
      password: req.param('password'),
      successRedirect: '/' + req.param('userName') +'/project',
      invalidRedirect: '/signin'
    });
  },


  /**
   * `UserController.logout()`
   */
  signout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {

    // Attempt to signup a user using the provided parameters
    User.signup({
      name: req.param('name'),
      email: req.param('email'),
      password: req.param('password')
    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.
      if (err) return res.negotiate(err);

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.ok('Signup successful!');
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      
    //   User.destroy({id:3}).exec(function(err, users) {
    //    if (err) {return res.serverError();}
    //    var userIds = users.map(function(user){return user.id;});
    //    Project.destroy({user: userIds}).exec(function(err, clubs) {
    //       // do something
    //    });
    // });
      return res.view('welcome');
    });
  }
};


/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	userName: {
  		type: 'string',
  		required: true,
      unique: true
  	},
  	email: {
      type: 'email',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

   /**
   * Create a new user using the provided inputs,
   * but encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • name     {String}
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  signup: function (inputs, cb) {
    // Create a user
    console.log("inputs.name : " + inputs.name);
    User.create({
      userName: inputs.name,
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  },



  /**
   * Check validness of a login using the provided inputs.
   * But encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  attemptLogin: function (inputs, cb) {
    // Create a user
    User.findOne({
      userName: inputs.userName,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  }
};


const _ = require('lodash')

// maybe change this to class based interation

function helper () {}

helper.prototype.logging = {
  /**
   * Logging init
   * @param {Object} meta = information about the seeder passed in
   */
  init: (meta) => {
    console.log('running database seeder ' + meta.name + ' please check file meta for more information.')
  }
}

module.exports = helper

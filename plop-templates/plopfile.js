/*
plop doc: https://github.com/plopjs/plop
prompt doc: https://github.com/SBoudrias/Inquirer.js/#prompt-types
template doc: https://github.com/wycats/handlebars.js/
*/

const componentGenerator = require('./component/prompt')
// const storeGenerator = require('./store/prompt')

module.exports = function (plop) {
  plop.setGenerator('component', componentGenerator)
  // plop.setGenerator('store', storeGenerator)
}

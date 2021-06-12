import Handlebars from 'handlebars'
import { plainText as propConfigTpl } from './partials/prop-config-tpl.hbs'
import { plainText as propComponentTpl } from './partials/prop-component-tpl.hbs'


// ------Partials------
Handlebars.registerPartial('prop-config-tpl', propConfigTpl)
Handlebars.registerPartial('prop-component-tpl', propComponentTpl)


// ------Helpers------
Handlebars.registerHelper('eq', (a, b) => a === b)
Handlebars.registerHelper('neq', (a, b) => a !== b)


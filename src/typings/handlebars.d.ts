declare module '*.hbs' {
  import Handlebars from 'handlebars'

  const template: Handlebars.TemplateDelegate<any>
  export default template
}

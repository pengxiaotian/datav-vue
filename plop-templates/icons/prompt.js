module.exports = {
  description: 'generate icon',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'icon name:',
    validate(value) {
      if (!value || value.trim === '') {
        return 'name is required';
      }
      return true;
    },
  },
  ],
  actions(data) {
    const actions = [{
      type: 'add',
      path: `${process.cwd()}/src/icons/{{dashCase name}}.vue`,
      templateFile: './icons/index.hbs',
      data: {
        name: data.name,
      },
    }];

    actions.push({
      type: 'modify',
      path: `${process.cwd()}/src/icons/index.ts`,
      pattern: /(\/\/ -- prepend export placeholder --)/gi,
      template: 'export { default as Icon{{pascalCase name}} } from \'./{{dashCase name}}.vue\'\n$1',
    });

    return actions;
  },
};

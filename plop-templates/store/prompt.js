module.exports = {
  description: 'generate store',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'store name:',
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
      path: `${process.cwd()}/src/store/{{dashCase name}}.ts`,
      templateFile: './store/index.hbs',
      data: {
        name: data.name,
      },
    }];
    return actions;
  },
};

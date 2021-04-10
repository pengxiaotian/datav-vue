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
  {
    type: 'confirm',
    name: 'mutations',
    message: 'Do you need mutation block?',
  },
  {
    when: (value) => value.mutations,
    type: 'confirm',
    name: 'actions',
    message: 'Do you need action block?',
  },
  {
    type: 'confirm',
    name: 'appendStore',
    message: 'Whether append to the store?',
  },
  ],
  actions(data) {
    const actions = [{
      type: 'add',
      path: `${process.cwd()}/src/store/modules/{{dashCase name}}.ts`,
      templateFile: './store/index.hbs',
      data: {
        name: data.name,
        mutations: data.mutations,
        actions: data.actions,
      },
    }];

    if (data.appendStore) {
      actions.push({
        type: 'modify',
        path: `${process.cwd()}/src/store/index.ts`,
        pattern: /(\/\/ -- prepend import placeholder --)/gi,
        template: 'import { I{{pascalCase name}}State } from \'./modules/{{dashCase name}}\'\n$1',
      });
      actions.push({
        type: 'modify',
        path: `${process.cwd()}/src/store/index.ts`,
        pattern: /(\/\/ -- prepend state placeholder --)/gi,
        template: '{{camelCase name}}: I{{pascalCase name}}State\n  $1',
      });
    }
    return actions;
  },
};

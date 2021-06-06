module.exports = {
  description: 'generate a component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'component name:',
      validate(value) {
        if (!value || value.trim === '') {
          return 'name is required';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'category',
      message: 'component category:',
      choices: ['bar', 'line', 'pie', 'map', 'text', 'relation', 'media', 'material', 'interact', 'other'],
      default: 'other',
    },
    {
      when: (value) => value.category === 'other',
      type: 'input',
      name: 'otherName',
      message: 'other name:',
      validate(value) {
        if (!value || value.trim === '') {
          return 'name is required';
        }
        return true;
      },
    },
  ],
  actions: (data) => {
    const subDir = data.otherName || data.category
    const dir = `${process.cwd()}/src/components/${subDir}/{{dashCase name}}`;
    const actions = [
      {
        type: 'add',
        path: `${dir}/index.ts`,
        templateFile: './datav/index-ts.hbs',
        data: {
          name: data.name,
        },
      },
      {
        type: 'add',
        path: `${dir}/src/index.vue`,
        templateFile: './datav/index.hbs',
        data: {
          name: data.name,
        },
      },
      {
        type: 'add',
        path: `${dir}/src/{{dashCase name}}.ts`,
        templateFile: './datav/datav-ts.hbs',
        data: {
          name: data.name,
        },
      },
      {
        type: 'add',
        path: `${dir}/src/config.vue`,
        templateFile: './datav/config.hbs',
        data: {
          name: data.name,
        },
      },
      {
        type: 'add',
        path: `${dir}/src/config.json`,
        templateFile: './datav/config-json.hbs',
        data: {
          name: data.name,
        },
      },
    ];

    return actions;
  },
};

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
      choices: ['bar', 'horizontal-bar', 'line', 'area', 'pie', 'relation', 'chart', 'map', 'text', 'table', 'button', 'select', 'interact-data', 'media', 'other'],
      default: 'other',
    },
    {
      when: (value) => value.category === 'other',
      type: 'input',
      name: 'otherName',
      message: '(optional) other name:',
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

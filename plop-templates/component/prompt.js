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
      type: 'checkbox',
      name: 'blocks',
      message: 'Blocks:',
      choices: [{
        name: '<template>',
        value: 'template',
        checked: true,
      }, {
        name: '<script>',
        value: 'script',
        checked: true,
      }, {
        name: 'style',
        value: 'style',
        checked: true,
      }],
      validate(value) {
        if (value.includes('script') || value.includes('template')) {
          return true;
        }
        return 'View require at least a <script> or <template> tag.';
      },
    },
    {
      type: 'list',
      name: 'category',
      message: 'Where would you like to put this component?',
      choices: ['components', 'views', 'pages'],
      default: 'components',
    },
    {
      type: 'input',
      name: 'subdirectory',
      message: 'subdirectory name:',
    },
    {
      type: 'confirm',
      name: 'withFolder',
      message: 'Whether to create component as folder?',
    },
    {
      when: (value) => value.withFolder,
      type: 'confirm',
      name: 'withPlugin',
      message: 'Compatible with plugin type?',
    },
  ],
  actions: (data) => {
    const dir = `${process.cwd()}/src/${data.category}/${data.subdirectory}/{{dashCase name}}`;
    const actions = [
      {
        type: 'add',
        path: data.withFolder ? `${dir}/src/index.vue` : `${dir}.vue`,
        templateFile: './component/index.hbs',
        data: {
          name: data.name,
          template: data.blocks.includes('template'),
          script: data.blocks.includes('script'),
          style: data.blocks.includes('style'),
        },
      }
    ];

    if (data.withFolder) {
      actions.push({
        type: 'add',
        path: `${dir}/index.ts`,
        templateFile: './component/index-ts.hbs',
        data: {
          name: data.name,
          withPlugin: data.withPlugin,
        },
      });
    }

    return actions;
  },
};

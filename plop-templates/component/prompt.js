module.exports = {
  description: 'generate a component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'component name please:',
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
      },
      {
        name: '<script>',
        value: 'script',
        checked: true,
      },
      {
        name: 'style',
        value: 'style',
        checked: true,
      },
      ],
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
      choices: ['components', 'views'],
      default: 'components',
    },
    {
      type: 'input',
      name: 'subdirectory',
      message: 'subdirectory name please:',
    },
  ],
  actions: (data) => {
    const actions = [
      {
        type: 'add',
        path: `${process.cwd()}/src/${data.category}/${data.subdirectory}/{{dashCase name}}/src/index.vue`,
        templateFile: './component/index.hbs',
        data: {
          name: data.name,
          template: data.blocks.includes('template'),
          script: data.blocks.includes('script'),
          style: data.blocks.includes('style'),
        },
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/${data.category}/${data.subdirectory}/{{dashCase name}}/index.ts`,
        templateFile: './component/index-ts.hbs',
        data: {
          name: data.name,
        },
      }
    ];

    return actions;
  },
};

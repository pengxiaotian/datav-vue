const { notEmpty } = require('../utils.js');

module.exports = {
  description: 'generate a component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'component name please:',
      validate: notEmpty('name'),
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
  ],
  actions: (data) => {
    const actions = [
      {
        type: 'add',
        path: `${process.cwd()}/src/${data.category}/{{dashCase name}}/src/index.vue`,
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
        path: `${process.cwd()}/src/${data.category}/{{dashCase name}}/index.ts`,
        templateFile: './component/index-ts.hbs',
        data: {
          name: data.name,
        },
      }
    ];

    return actions;
  },
};

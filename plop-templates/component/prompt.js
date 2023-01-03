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
  ],
  actions: (data) => {
    const dir = `${process.cwd()}/src/components/ui/{{dashCase name}}`;
    const actions = [
      {
        type: 'add',
        path: `${dir}/src/index.vue`,
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
        path: `${dir}/index.ts`,
        templateFile: './component/index-ts.hbs',
        data: {
          name: data.name,
        },
      },
      {
        type: 'modify',
        path: `${process.cwd()}/src/components/ui/index.ts`,
        pattern: /(\/\/ -- prepend async register placeholder --)/gi,
        template: "app.component('G{{ pascalCase name }}', defineAsyncComponent(() => import('./{{ dashCase name }}')))\n  $1",
      },
      {
        type: 'modify',
        path: `${process.cwd()}/datav-cli-ui/ui-components/index.ts`,
        pattern: /(\/\/ -- prepend register placeholder --)/gi,
        template: "export { default as G{{ pascalCase name }} } from '@/components/ui/{{ dashCase name }}'\n$1",
      }
    ];

    return actions;
  },
};

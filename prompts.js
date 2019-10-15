module.exports = [
  {
    name: 'cssPreprocessor',
    type: 'list',
    message: 'Select the css pre-processor for your project',
    choices: [
      {
        name: 'Sass/SCSS',
        value: 'scss'
      },
      {
        name: 'Less',
        value: 'less'
      }
    ],
    default: 'scss'
  },
  {
    name: 'PWASupport',
    type: 'confirm',
    message: 'PWA Support ?',
    default: false
  }
]

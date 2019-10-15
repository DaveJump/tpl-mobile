module.exports = (api, opts, rootOpts) => {
  const appName = rootOpts.projectName

  /**
   * Package.json extending
   */

  // Bases
  let bases = {
    license: 'MIT',
    author: 'author',
    appConfig: {
      'name': appName,
      'title': 'App',
      'description': 'A mobile app base on vant',
      'keywords': 'app mobile',
      'env': '',
      'publicPath': '/'
    }
  }

  // Scripts
  let scripts = {
    dev: 'vue-cli-service serve --copy',
    build: 'vue-cli-service build',
    lint: 'vue-cli-service lint',
    serve: 'vue-cli-service serve'
  }

  // Dependencies
  let dependencies = {
    'vue': '^2.6.10',
    'vue-router': '^3.0.1',
    'vuex': '^3.0.1',
    'vuex-class': '^0.3.1',
    'vue-meta': '^1.5.8',
    'vant': '^1.5.2',
    'lodash': '^4.17.11',
    'axios': '^0.18.0'
  }
  let devDependencies = {
    'babel-plugin-import': '^1.10.0',
    'vue-template-compiler': '^2.6.10',
    'eslint-friendly-formatter': '^4.0.1',
    'terser-webpack-plugin': '^1.2.3'
  }
  // # less
  if (opts['cssPreprocessor'] === 'less') {
    Object.assign(devDependencies, {
      'less': '^3.9.0',
      'less-loader': '^4.1.0'
    })
  }
  // # sass
  if (opts['cssPreprocessor'] === 'scss') {
    Object.assign(devDependencies, {
      'node-sass': '^4.10.0',
      'sass-loader': '^7.1.0'
    })
  }

  // Eslint extending and extra plugin config
  let extraConfig = {
    eslintConfig: {
      'root': true,
      'env': {
        'node': true
      },
      'extends': [
        'plugin:vue/essential',
        '@vue/standard'
      ],
      'rules': {
        'vue/no-parsing-error': [
          2,
          { 'x-invalid-end-tag': false }
        ],
        'import/no-duplicates': 0
      },
      'parserOptions': {
        'parser': 'babel-eslint'
      }
    },
    'postcss': {
      'plugins': {
        'autoprefixer': {}
      }
    },
    'browserslist': [
      '> 1%',
      'last 2 versions',
      'not ie <= 8'
    ],
    'gitHooks': {
      'pre-commit': 'lint-staged'
    },
    'lint-staged': {
      '*.js': [
        'vue-cli-service lint',
        'git add'
      ],
      '*.vue': [
        'vue-cli-service lint',
        'git add'
      ]
    }
  }

  api.extendPackage({
    ...bases,
    scripts,
    dependencies,
    devDependencies,
    ...extraConfig
  })

  /**
   * Rendering files
   */

  // Drop vue-cli preset template
  api.render(files => {
    Object.keys(files)
      .filter(path => path.startsWith('src/') || path.startsWith('public/'))
      .forEach(path => delete files[path])
  })

  api.render('./template/default')
  if (opts['cssPreprocessor'] === 'less') api.render('./template/css-pre-processors/less')
  if (opts['cssPreprocessor'] === 'scss') api.render('./template/css-pre-processors/scss')

  if (opts['PWASupport']) {
    // Render pwa imports
    const injectImport = () => {
      const imports = `\nimport './registerServiceWorker'`
      const fs = require('fs')
      const appPath = api.resolve('src/app.js')
      let appContent = fs.readFileSync(appPath, { encoding: 'utf-8' })
      let lines = appContent.split(/\r?\n/g).reverse()
      // Inject imports
      let lastImportIndex = lines.findIndex(line => line.match(/^import/))
      lines[lastImportIndex] += imports
      // Write back to file
      appContent = lines.reverse().join('\n')
      fs.writeFileSync(appPath, appContent, { encoding: 'utf-8' })
    }
    const execPluginAdding = () => {
      return new Promise((resolve, reject) => {
        const { execSync } = require('child_process')
        try {
          console.log(`\n\n⚙️  Installing PWA plugin...\n`)
          let result = execSync('vue add pwa', { cwd: api.resolve('./'), windowsHide: true })
          resolve(result)
        } catch (e) {
          api.exitLog(`An error occurred during installing PWA plugin !`, 'error')
          reject(e)
        }
      })
    }
    api.onCreateComplete(async () => {
      try {
        await execPluginAdding()
        injectImport()
        console.log(`🤓  PWA plugin installed.\n`)
      } catch (e) {
      }
    })
  }
}

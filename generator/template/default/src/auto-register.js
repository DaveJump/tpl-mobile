export default {
  install (Vue) {
    /**
     * Globally register components
     * @notice Component will be auto registered if there is no filename start with underline(_)
     */

    const componentsContext = require.context('./components', true, /^[^_]+(?:\.vue)$/i)
    const componentKeys = componentsContext.keys()

    componentKeys.forEach(filePath => {
      const componentConfig = componentsContext(filePath)
      const component = componentConfig.default || componentConfig
      let fileName = filePath.replace(/^\S+\/(\w+)\.vue$/, '$1')

      // Get the component name if there is an file named "index"
      if (fileName === 'index' && component.name) {
        fileName = component.name
      }
      Vue.component(fileName, component)
    })
  }
}



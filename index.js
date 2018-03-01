let fs = require('fs')
let path = require('path')
let editor = require('editor')
let { exec } = require('child_process')
let nconf = require('nconf')

class Minit {
  constructor() {
    this.root_path = `${path.dirname(require.main.filename)}/../`
    nconf.use('file', {
      file: `${this.root_path}config.json`
    })

    nconf.load()
    this.store = nconf.stores.file.store
  }

  copy_file(targets) {
    for(let template of targets) {
      try {
        console.log(`=== ${template} ===`)
        for(let file of fs.readdirSync(`${this.template_root}${template}`)) {
          let filepath = `./${file}`
          try {
            fs.statSync(filepath)
            console.log(`${filepath} skipped.`.substr(2))
          } catch(e) {
            fs.copyFileSync(`${this.template_root}${template}/${file}`, filepath)
            console.log(`${filepath} copied.`.substr(2))
          }
        }
      } catch(e) {
        if(e.code === 'ENOENT') {
          console.log(`${template} not found.`)
        }
      }
      console.log()
    }
  }

  edit_template(target) {
    let filepath = `${this.template_root}${target}`
    try {
      fs.statSync(filepath)
    } catch(e) {
      fs.mkdirSync(filepath)
    }
    editor(filepath, {editor: this.editor})
  }

  edit_config() {
    let filepath = `${this.root_path}config.json`
    editor(filepath, {editor: this.editor})
  }

  template_list() {
    let templates = fs.readdirSync(`${this.template_root}`)
    for(let template of templates) {
      console.log(template)
    }
    return templates
  }

  set template_root(new_path) {
    nconf.set('template_root', `${path.resolve(new_path)}/`)
    nconf.save()
  }

  get template_root() {
    return this.store.template_root || `${this.root_path}templates/`
  }

  set editor(new_editor) {
    nconf.set('editor', new_editor)
    nconf.save()
  }

  get editor() {
    return this.store.editor
  }
}

module.exports = Minit;

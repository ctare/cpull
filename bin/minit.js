#!/usr/bin/env node

let argv = require('argv')
let fs = require('fs')
let path = require('path')
let root = `${path.dirname(require.main.filename)}/../`
let template_root = `${root}templates/`
let editor = 'vi'

let minit = require('../index')
minit = new minit()
let package_inf = require("../package.json")

argv.type('path', (value) => {
  if(value.endsWith("/")) {
    return value
  } else {
    return `${value}/`
  }
})

argv.info(`Usage: minit [options] [template_name]
Example:
  . 'minit java'
  . 'minit java python etc'
  . 'minit -e node'`)

argv.version(package_inf.version)

argv.option([{
  name: 'edit',
  short: 'e',
  type: 'string',
  description: 'Edit template file',
  example: "'minit -e java' if template not exists then create."
}, {
  name: 'template',
  short: 't',
  type: 'path',
  description: 'Change template root',
  example: "'minit -t ~/templates'"
}, {
  name: 'list',
  short: 'l',
  type: 'bool',
  description: 'Show template list',
  example: "'minit -l'"
}, {
  name: 'editor',
  short: 'f',
  type: 'string',
  description: 'Change using editor',
  example: "'minit -f vim'"
}, {
  name: 'config',
  short: 'c',
  type: 'bool',
  description: 'Edit minit config file',
  example: "'minit -c'"
}])

function check(opt, callback) {
  if (opt === undefined) {
    return
  }

  if (opt === true) {
    argv.help()
    process.exit()
  }

  callback(opt)
}

if(process.argv.length <= 2) {
  argv.help()
  process.exit()
}

arg = argv.run()

if(arg.options.list) {
  minit.template_list()
}

if(arg.options.config) {
  minit.edit_config()
}

check(arg.options.edit, (edit) => {
  minit.edit_template(edit)
})

check(arg.options.template, (template) => {
  minit.template_root = template
})

check(arg.options.editor, (editor) => {
  minit.editor = editor
})


minit.copy_file(arg.targets)

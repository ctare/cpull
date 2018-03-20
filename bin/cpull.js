#!/usr/bin/env node

let argv = require('argv')
let fs = require('fs')
let path = require('path')
let root = `${path.dirname(require.main.filename)}/../`
let template_root = `${root}templates/`
let editor = 'vi'

let cpull = require('../index')
cpull = new cpull()
let package_inf = require("../package.json")

argv.type('path', (value) => {
  if(value.endsWith("/")) {
    return value
  } else {
    return `${value}/`
  }
})

argv.info(`Usage: cpull [options] [template_name]
Example:
  . 'cpull java'
  . 'cpull java python etc'
  . 'cpull -e node'`)

argv.version(package_inf.version)

argv.option([{
  name: 'edit',
  short: 'e',
  type: 'string',
  description: 'Edit template file',
  example: "'cpull -e java' if template not exists then create."
}, {
  name: 'template',
  short: 't',
  type: 'path',
  description: 'Change template root',
  example: "'cpull -t ~/templates'"
}, {
  name: 'list',
  short: 'l',
  type: 'bool',
  description: 'Show template list',
  example: "'cpull -l'"
}, {
  name: 'editor',
  short: 'f',
  type: 'string',
  description: 'Change using editor',
  example: "'cpull -f vim'"
}, {
  name: 'config',
  short: 'c',
  type: 'bool',
  description: 'Edit cpull config file',
  example: "'cpull -c'"
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
  cpull.template_list()
}

if(arg.options.config) {
  cpull.edit_config()
}

check(arg.options.edit, (edit) => {
  cpull.edit_template(edit)
})

check(arg.options.template, (template) => {
  cpull.template_root = template
})

check(arg.options.editor, (editor) => {
  cpull.editor = editor
})


cpull.copy_file(arg.targets)

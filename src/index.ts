#!/usr/bin/env node

import { Minit } from "./minit.js"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import packageJson from "../package.json"
import chalk from "chalk"

yargs(hideBin(process.argv))
  .locale("en")
  .scriptName("cpull")
  .version(packageJson.version)
  .command("$0", "Manage templates", (yargs) => {
    return yargs.option("template", {
      alias: "t",
      describe: "Template root directory",
      type: "string",
    })
  }, (argv) => {
    const stores = Minit.loadStores(Minit.getRootPath())
    // const stores = Minit.loadStores("./tmp")

    // ::: --template
    if (argv.template != null) {
      if (argv.template === "") {
        const root = stores.templateRoot.get()
        console.log(root)
        return
      }

      if (Minit.isDir(argv.template)) { 
        stores.templateRoot.set(argv.template)
      } else {
        console.error(chalk.red("template is not directory"))
      }
      return
    }

    // ::: copy command
    if (argv._.length > 0) {
      const root = stores.templateRoot.get()
      argv._.forEach((template) => {
        Minit.copyFile(`${root}/${template}`, "./")
      })
      return
    }

    // ::: default command
    const root = stores.templateRoot.get()
    const templates = Minit.getTemplates(root)
    templates.forEach((template) => {
      console.log(template)
    })
  })
  .help()
  .argv

#!/usr/bin/env node

import { Minit } from "./minit.js"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import packageJson from "../package.json"

yargs(hideBin(process.argv))
  .locale("en")
  .scriptName("cpull")
  .version(packageJson.version)
  .command("template <dir>", "Change template root", (yargs) => {
    return yargs.positional("dir", {
      describe: "Template root directory",
      type: "string",
      demandOption: true,
    })
  }, (argv) => {
    // Minit.loadStores(Minit.getRootPath())
    const stores = Minit.loadStores("./tmp")

    stores.templateRoot.set(argv.dir)
    console.log("++ template", Minit.getRootPath())
    console.log("++ value", stores.templateRoot.get()) 
    console.log(argv)
  })
  .help()
  .argv

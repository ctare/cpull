import nconf from 'nconf'
import editor from 'editor'
import path from 'path'
import fs from 'fs'

export class Store {
  constructor(
    private key: string,
    private stores: { [key: string ]: string },
    private options: { get?: (value: string) => string } = {}
  ) { }

  get(): string {
    const value = this.stores[this.key]

    // decorator
    if (this.options.get) {
      return this.options.get(value)
    }

    return value
  }

  set(value: string, callback?: () => void) {
    nconf.set(this.key, value)
    nconf.save((err: any) => {
      if (err) {
        console.error(err)
      } else {
        if (callback) {
          callback()
        }
      }
    })
  }
}

export class Minit {
  static getRootPath() {
    const filename = require.main?.filename
    if (filename === undefined) {
      throw new Error('require.main.filename is undefined')
    }

    return `${path.dirname(filename)}/../`
  }

  static loadStore(rootPath: string) {
    nconf.use('file', { file: `${rootPath}/config.json` })
    nconf.load()
    return nconf.stores.file.store
  }

  static loadStores(rootPath: string) {
    const store = this.loadStore(rootPath)
    return {
      templateRoot: new Store('template_root', store, {
        get: value => path.resolve(value),
      }),
      editor: new Store('editor', store),
    }
  }

  /**
   * copy file or directory
   * 
   * @param src copy from
   * @param dest copy to
   */
  static copyFile(src: string, dest: string) {
    if (fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true })
      fs.readdirSync(src).forEach((child: string) => {
        this.copyFile(`${src}/${child}`, `${dest}/${child}`)
      })
    } else {
      fs.copyFileSync(src, dest)
    }
  }
}
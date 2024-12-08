import nconf from 'nconf'
import editor from 'editor'
import path from 'path'
import fs from 'fs'
import chalk, { Chalk } from 'chalk'

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

  static isDir(path: string): boolean {
    return fs.existsSync(path) && fs.statSync(path).isDirectory()
  }

  static getTemplates(rootPath: string) {
    const files = fs.readdirSync(rootPath)

    // ignore .files
    return files.filter(file => !file.startsWith('.'))
  }

  /**
   * copy file or directory
   * 
   * @param src copy from
   * @param dest copy to
   * @returns skipped files
   */
  static copyFile(src: string, dest: string): {
    skipped: string[],
    copied: string[],
  } {
    return this.copyFileWithRoot(src, dest, src)
  }

  private static copyFileWithRoot(src: string, dest: string, root: string): {
    skipped: string[],
    copied: string[],
  } {
    if (fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true })

      const skipped: string[] = []
      const copied: string[] = []
      fs.readdirSync(src).forEach((child: string) => {

        // recursive
        const ret = this.copyFileWithRoot(`${src}/${child}`, `${dest}/${child}`, root)
        skipped.push(...ret.skipped)
        copied.push(...ret.copied)
      })
 
      return { skipped, copied }
    } else {
      if (fs.existsSync(dest)) {
        return { skipped: [Minit.trimRoot(src, root)], copied: [] }
      }

      fs.copyFileSync(src, dest)
      return { skipped: [], copied: [Minit.trimRoot(src, root)] }
    }
  }

  private static trimRoot(src: string, root: string): string {
    return src.replace(root, '') // first match only
  }

  static showFiles(files: string[], color: Chalk) {
    files.forEach(file => {
      console.log(color(file))
    })
  }
}
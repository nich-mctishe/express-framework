if (process.env.NODE_ENV !== 'production') {
  const chokidar = require('chokidar')
  const browserSync = require('browser-sync')

  browserSync.init({
    logLevel: 'silent',
    proxy: 'localhost'
  })

  const watcher = chokidar.watch([
    './config',
    './routes',
    './helpers',
    './models',
    './schema',
    './utils',
    './seeder'
  ], {
    usePolling: true,
    interval: 1000
  })

  watcher.on('ready', function () {
    watcher.on('all', function (event, path) {
      Object.keys(require.cache).forEach(function (id) {
        if (/\/src\/routes\//.test(id)) {
          delete require.cache[id]
        }
      })

      browserSync.reload(path)
      process.exit()
    })
  })

  const templateWatcher = chokidar.watch([
    './templates'
  ], {
    usePolling: true,
    interval: 1000
  })

  templateWatcher.on('ready', function () {
    templateWatcher.on('all', function (event, path) {
      browserSync.reload(path)
    })
  })
}

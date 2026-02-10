import fs from 'fs'
import path from 'path'

const serverDir = path.join(process.cwd(), 'server')

const fixImports = (dir) => {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      fixImports(filePath)
    } else if (file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8')
      const originalContent = content

      // 根据文件层级计算正确的导入路径
      const relativeToServer = path.relative(serverDir, path.dirname(filePath))
      const depth = relativeToServer.split(path.sep).length
      const prefix = '../'.repeat(depth)

      // 修复导入路径
      content = content.replace(/\.\.\/utils\//g, `${prefix}utils/`)

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`Fixed imports in ${filePath}`)
      }
    }
  })
}

console.log('Fixing import paths in server directory...')
fixImports(serverDir)
console.log('Import paths fixed successfully!')

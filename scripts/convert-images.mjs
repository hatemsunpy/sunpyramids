import { readdir, readFile, writeFile } from 'node:fs/promises'
import { statSync, existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const IMAGE_DIR = 'public/images'
const SOURCE_PATHS = ['components', 'pages', 'layouts', 'app.vue']

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else if (/\.(vue|ts|js|scss|css|html)$/.test(entry.name)) {
      yield full
    }
  }
}

async function collectRasters(dir) {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await collectRasters(full)))
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

async function convertImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const base = filePath.slice(0, -ext.length)
  const outPath = `${base}.webp`

  const srcStat = statSync(filePath)
  if (existsSync(outPath)) {
    const outStat = statSync(outPath)
    if (outStat.mtime >= srcStat.mtime) {
      return { filePath, outPath, skipped: true }
    }
  }

  await sharp(filePath)
    .webp({ quality: 85, effort: 4, lossless: false })
    .toFile(outPath)

  return { filePath, outPath, skipped: false }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function main() {
  const rasters = await collectRasters(IMAGE_DIR)
  const conversions = []
  for (const file of rasters) {
    conversions.push(await convertImage(file))
  }
  console.log(`Converted ${conversions.filter(c => !c.skipped).length} images, ${conversions.filter(c => c.skipped).length} already up to date.`)

  const replacements = conversions.map(({ filePath }) => {
    const rel = filePath.replace(/\\/g, '/')
    const webp = rel.replace(/\.[^.]+$/, '.webp')
    const publicRel = rel.replace(/^public\//, '')
    const webpPublicRel = webp.replace(/^public\//, '')
    return {
      from: `/${publicRel}`,
      to: `/${webpPublicRel}`,
    }
  })

  async function collectSources(paths) {
    const out = []
    for (const p of paths) {
      if (!existsSync(p)) continue
      const st = statSync(p)
      if (st.isFile()) {
        out.push(p)
      } else if (st.isDirectory()) {
        for await (const f of walk(p)) {
          out.push(f)
        }
      }
    }
    return out
  }

  const sourceFiles = await collectSources(SOURCE_PATHS)

  let updatedFiles = 0
  for (const file of sourceFiles) {
    let content = await readFile(file, 'utf8')
    let changed = false
    for (const { from, to } of replacements) {
      const regex = new RegExp(escapeRegExp(from), 'g')
      if (regex.test(content)) {
        content = content.replace(regex, to)
        changed = true
      }
    }
    if (changed) {
      await writeFile(file, content, 'utf8')
      updatedFiles++
      console.log(`Updated references in ${file}`)
    }
  }
  console.log(`Updated references in ${updatedFiles} files.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

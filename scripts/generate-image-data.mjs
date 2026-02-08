import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(new URL('.', import.meta.url).pathname, '..')
const imagesRoot = path.join(projectRoot, 'public', 'images')
const outputFile = path.join(projectRoot, 'src', 'data', 'generatedImages.js')

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'])

const toKebabCase = (text) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatForLabel = (fileName) =>
  fileName
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const compareByName = (a, b) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' })

const readImageFiles = (directoryPath) => {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
    .sort(compareByName)
}

const buildCollections = () => {
  const folderEntries = fs.readdirSync(imagesRoot, { withFileTypes: true })
  const collections = {}

  folderEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareByName)
    .forEach((folderName) => {
      const folderPath = path.join(imagesRoot, folderName)
      const files = readImageFiles(folderPath)

      collections[folderName] = files.map((fileName) => {
        const nameWithoutExtension = path.parse(fileName).name
        const slug = toKebabCase(nameWithoutExtension)
        const label = formatForLabel(nameWithoutExtension)

        return {
          id: `${folderName}-${slug || toKebabCase(fileName)}`,
          slug,
          fileName,
          label,
          imageUrl: `/images/${folderName}/${fileName}`,
          alt: label,
        }
      })
    })

  return collections
}

const imageCollections = buildCollections()

const output = `// Arquivo gerado automaticamente por scripts/generate-image-data.mjs\n// Não edite manualmente. Rode \`npm run generate:image-data\` após adicionar/remover imagens em public/images.\n\nexport const imageCollections = ${JSON.stringify(imageCollections, null, 2)}\n\n`

fs.writeFileSync(outputFile, output)
console.log(`Dados de imagens gerados em: ${path.relative(projectRoot, outputFile)}`)

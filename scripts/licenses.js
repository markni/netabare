import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Convert the URL to a path
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Assuming the JSON file is in the root and the script in 'scripts/'
const inputFile = path.join(__dirname, '..', 'licenses.json')
const outputFile = path.join(__dirname, '..', 'licenses.json')

async function sanitizeJson() {
  try {
    // Read the JSON file
    const data = await fs.readFile(inputFile)
    const json = JSON.parse(data)

    // Remove the 'path' key from each entry
    for (const packageName of Object.keys(json)) {
      if (packageName.startsWith('netabare')) {
        delete json[packageName]
      } else {
        delete json[packageName].path
        delete json[packageName].licenseFile
      }
    }

    // Write the modified data back to a new JSON file
    await fs.writeFile(outputFile, JSON.stringify(json, null, 4))
    console.log(`Sanitized JSON has been saved to '${outputFile}'`)
  } catch (err) {
    console.error('Error:', err)
  }
}

sanitizeJson()

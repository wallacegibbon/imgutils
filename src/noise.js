const sharp = require('sharp')
const path = require('path')

async function handleOneFile(filePath)
{
	const s = sharp(filePath)
	const meta = await s.metadata()
	const raw = { width: meta.width, height: meta.height, channels: meta.channels }
	const buf = (await s.raw().toBuffer()).map(x => fixPixel(x, 200))
	await sharp(buf, { raw }).jpeg({ quality: 20 }).toFile(mkOutputFname(filePath))
}

function fixPixel(pixval, size)
{
	const o = pixval + Math.floor(Math.random() * size)
	return o > 255 ? 255 : o
}

function mkOutputFname(inputFname)
{
	const p = path.parse(inputFname)
	return path.join(p.dir, `${p.name}.out.jpeg`)
}

async function start()
{
	const files = process.argv.slice(2)
	await Promise.all(files.map(handleOneFile))
}

start().catch(console.error)

import { writeFileSync } from "fs"
import { parseStringPromise } from "xml2js"

const fixes = {
  386831: { name: "Maialini salterini" },
  2136: { name: "Non t'arrabbiare" },
  258779: { name: "Pianeti Sconosciuti" },
  180974: { name: "Pozioni Esplosive" },
  171: { name: "Scacchi" },
  18723: { name: "Sì, Oscuro Signore!" },
  42206: { name: "Sotto tensione" },
  289018: { name: "Su Una Scala da 1 a T-Rex" },
  46213: { name: "TeleSketch" },
  57660: { name: "Time's Up!" },
}

const listUrl = "https://boardgamegeek.com/xmlapi/geeklist/314361"
const numPlayersPollMap = { Best: "best", Recommended: "rec", "Not Recommended": "notrec" }

async function fetchXmlData(url) {
  console.log(`fetching ${url}`)
  const resp = await fetch(url)
  const rawText = await resp.text()
  const data = await parseStringPromise(rawText)
  return data
}

function extractGameIds(listData) {
  return listData.geeklist.item
    .filter((item) => item.$.subtype === "boardgame")
    .map((item) => item.$.objectid)
}

function extractGameData(node) {
  const data = {
    bggid: node.$.id,
    name: node.name.filter((name) => name.$.type === "primary")[0].$.value,
    thumbnail: node.thumbnail[0],
    year: Number.parseInt(node.yearpublished[0].$.value),
    minplayers: Number.parseInt(node.minplayers[0].$.value),
    maxplayers: Number.parseInt(node.maxplayers[0].$.value),
    mintime: Number.parseInt(node.minplaytime[0].$.value),
    maxtime: Number.parseInt(node.maxplaytime[0].$.value),
    complexity: Number.parseFloat(node.statistics[0].ratings[0].averageweight[0].$.value),
    designers: node.link
      .filter((link) => link.$.type === "boardgamedesigner")
      .map((link) => link.$.value),
    catcodes: node.link
      .filter((link) => ["boardgamecategory", "boardgamemechanic"].includes(link.$.type))
      .map((link) => link.$.id),
    expandedId: node.link.find(
      (link) => link.$.type === "boardgameexpansion" && link.$.inbound === "true",
    )?.$.id,
  }
  const numPlayersPoll = node.poll.find((poll) => poll.$.name === "suggested_numplayers")
  if (numPlayersPoll) {
    const pollData = { votes: Number.parseInt(numPlayersPoll.$.totalvotes) }
    for (const resultsNode of numPlayersPoll.results) {
      const npData = {}
      for (const resultNode of resultsNode.result) {
        npData[numPlayersPollMap[resultNode.$.value]] = Number.parseInt(resultNode.$.numvotes)
      }
      pollData[resultsNode.$.numplayers] = npData
    }
    data.playersPoll = pollData
  }
  return data
}

async function fetchAllGamesData(ids) {
  const data = []
  const idsQueue = [...ids]
  while (idsQueue.length) {
    const batchIds = idsQueue.splice(0, 20).join(",")
    const batchDataUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${batchIds}&stats=1`
    const batchData = await fetchXmlData(batchDataUrl)
    for (const node of batchData.items.item) {
      const gameData = extractGameData(node)
      data.push(gameData)
    }
  }
  return data
}

function postprocessGameData(data) {
  const processed = []
  const expansionsById = {}
  for (const { expandedId, ...item } of data) {
    Object.assign(item, fixes[item.bggid])
    if (expandedId) {
      if (!expansionsById[expandedId]) {
        expansionsById[expandedId] = []
      }
      expansionsById[expandedId].push(item)
    } else {
      processed.push(item)
    }
  }
  for (const item of processed) {
    item.expansions = expansionsById[item.bggid] ?? []
  }
  return processed
}

const listData = await fetchXmlData(listUrl)
const gameIds = extractGameIds(listData)
const data = await fetchAllGamesData(gameIds)
const processed = postprocessGameData(data)
await writeFileSync("src/games.json", JSON.stringify(processed))

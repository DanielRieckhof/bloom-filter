'use strict'

const path = require('path')
const BloomFilter = require('./BloomFilter')

const wordListFile = './assets/wordlist.txt'
const wordListFilePath = path.resolve(__dirname, wordListFile)

const createRandomString = (length = 5) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let string = ''
  for (let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return string
}

const numRandomStrings = 1000

const checkWordList = []
for (let i = 0; i < numRandomStrings; i++) {
  checkWordList.push(createRandomString(5))
}

const bf = new BloomFilter(5)
bf.load(wordListFilePath).then(() => {
  let numCheckedAsTrue = 0
  checkWordList.forEach(checkWord => {
    if (bf.hasWord(checkWord)) {
      numCheckedAsTrue++
    }
  })
  console.log(`Checked ${numCheckedAsTrue} of ${numRandomStrings} random strings as correctly spelled`)
  process.exit(0)
})

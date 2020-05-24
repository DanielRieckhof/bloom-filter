'use strict'

const path = require('path')
const assert = require('assert')
const BloomFilter = require('./BloomFilter')

const wordListFile = './assets/wordlist.txt'
const wordListFilePath = path.resolve(__dirname, wordListFile)

const bf = new BloomFilter(5)

bf.getWordListArray(wordListFile).then(checkWordList => {
  bf.load(wordListFilePath).then(() => {
    try {
      checkWordList.forEach(checkWord => {
        assert.ok(bf.hasWord(checkWord, `Word ${checkWord} is not part of the wordList`))
      })
    } catch (e) {
      console.log(e.message)
    }
    process.exit(0)
  })
})

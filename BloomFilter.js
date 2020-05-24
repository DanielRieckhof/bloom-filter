'use strict'

const fs = require('fs')
const md5 = require('md5')
const _ = require('lodash')
const util = require('util')
const readFile = util.promisify(fs.readFile)

let bitmap = []

/**
 * Get part of the md5 (3rd party)
 *
 * @param word
 * @returns {string}
 */
const getWordHash = (word, length = 5) => {
  return md5(word).substr(6, length)
}

/**
 * Map the hash of a word to an index from 0 - 1048575 (max value of substring with length = 5 of md5)
 *
 * @param word
 * @returns {number}
 */
const getWordIndex = (word) => {
  return parseInt(getWordHash(word, 5), 16)
}

/**
 * Check if word is represented in bitmap
 *
 * @param word
 * @returns {boolean}
 */
const hasWord = (word) => {
  return !!bitmap[getWordIndex(word)]
}

/**
 * Load the wordList file
 *
 * @param wordListFile
 * @returns {number} Number of loaded words
 */
const load = async (wordListFile) => {
  // initialize bitmap with 1048575 (0xfffff) zeros
  bitmap = _.fill(new Array(0xfffff), 0)
  // read the wordList file
  const wordList = (await readFile(wordListFile, 'latin1')).toString().split('\n')
  // map each word to a index of the bitmap
  wordList.forEach(word => {
    const wordIndex = getWordIndex(word)
    bitmap[wordIndex] = 1
  })
  return wordList.length
}

const BloomFilter = {
  load,
  getWordHash,
  getWordIndex,
  hasWord
}

module.exports = BloomFilter

'use strict'

const fs = require('fs')
const md5 = require('md5')
const _ = require('lodash')
const util = require('util')
const readFile = util.promisify(fs.readFile)

class BloomFilter {
  /**
   * Create BloomFilter
   *
   * @param precision
   */
  constructor(precision=5) {
    this.precision = precision
    this.wordList = []
    this.bitmap = []
  }

  /**
   * Get part of the md5 (3rd party)
   *
   * @param word
   * @returns {string}
   */
  getWordHash(word) {
    return md5(word.toLowerCase()).substr(6, this.precision)
  }

  /**
   * Map the hash of a word to an index from 0 - (16^this.precession-1)
   * (max value of substring with length = this.precession of md5)
   *
   * @param word
   * @returns {number}
   */
  getWordIndex(word) {
    return parseInt(this.getWordHash(word), 16)
  }

  /**
   * Check if word is represented in bitmap
   *
   * @param word
   * @returns {boolean}
   */
  hasWord(word) {
    return !!this.bitmap[this.getWordIndex(word)]
  }

  async getWordListArray(wordListFile) {
    const fileContents = await readFile(wordListFile, 'latin1')
    return fileContents.toString().split('\n')
  }

  countHashedWords() {
    return this.bitmap.filter(val => val === 1).length
  }

  /**
   * Load the wordList file
   *
   * @param wordListFile
   * @returns {number} Number of loaded words
   */
  async load(wordListFile) {
    // init bitmap
    this.bitmap = _.fill(new Array(Math.pow(16, this.precision)-1), 0)
    // read the wordList file
    this.wordList = await this.getWordListArray(wordListFile)
    // map each word to a index of the bitmap
    this.wordList.forEach(word => {
      const wordIndex = this.getWordIndex(word)
      this.bitmap[wordIndex] = 1
    })
    return this.wordList.length
  }

}

module.exports = BloomFilter

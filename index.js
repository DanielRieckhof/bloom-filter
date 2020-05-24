const BloomFilter = require('./BloomFilter')
const readline = require('readline')
const path = require('path')

const wordListFile = './assets/wordlist.txt'
const wordListFilePath = path.resolve(__dirname, wordListFile)

const quitString = '.'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('close', () => {
  console.log('\nHave a nice day')
  process.exit(0)
})

const checkUserInput = () => {
  rl.question('> ', (word) => {
    if (word === quitString) {
      rl.close()
    }

    if (bf.hasWord(word)) {
      console.log(`${word} is spelled correctly`)
    } else {
      console.log(`${word} is misspelled`)
    }

    return checkUserInput()
  })
}


const bf = new BloomFilter(5)

console.log(`Loading ${wordListFile}...`)
bf.load(wordListFilePath).then(numWords => {
  console.log(`Finished loading ${numWords} words (mapped to ${bf.countHashedWords()} hashes)`)
  console.log(`Enter "${quitString}" or hit CTRL-C to end checking`)
  checkUserInput()
})

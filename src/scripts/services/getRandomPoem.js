const getRandomPoem = async function getRandomPoem() {
  const prefixUrl = 'https://crossorigin.me/http://poetrydb.org'
  // ⚠️ Triple await usage ahead 😵
  // grab a poet
  const authors = await (await (await fetch(`${prefixUrl}/author`)).json())
    .authors
  const author = authors[Math.floor(Math.random() * authors.length)]
  // get a random poem title for that poet
  const poems = await (await fetch(
    `${prefixUrl}/author/${author}/title`
  )).json()
  const chosenPoem = poems[Math.floor(Math.random() * poems.length)]
  // grab the poet with some more pretty triple await
  const poem = await (await (await fetch(
    `${prefixUrl}/title/${chosenPoem.title}/title,author,lines`
  )).json())[0]
  return poem
}
export default getRandomPoem

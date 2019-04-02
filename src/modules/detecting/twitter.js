const twitter = (doc) => {
  console.log(doc)
  doc.getElementById('tweet-box-home-timeline').addEventListener('focus', () => {
    doc.getElementById('tweet-box-home-timeline').click()
  })
}

export {twitter}
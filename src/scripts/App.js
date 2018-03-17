import React, { Component, Fragment } from 'react'

import getRandomPoem from './services/getRandomPoem'
import Composer from './components/Composer'
import Msg from './components/Msg'

import style from '../styles/index.styl'

class App extends Component {
  state = {
    loading: true,
    poem: undefined,
  }
  static defaultProps = {
    stars: [],
  }

  componentDidMount() {
    this.getPoem()
  }

  getPoem = async () => {
    this.setState(
      {
        error: false,
        poem: null,
        loading: true,
      },
      async () => {
        try {
          const poem = await getRandomPoem()
          this.setState({
            error: false,
            loading: false,
            poem: Object.assign({}, poem, {
              lines: [...poem.lines, ...['', poem.author]],
            }),
          })
        } catch (e) {
          this.setState({
            error: true,
            loading: false,
            poem: null,
          })
        }
      }
    )
  }

  send = () => {
    const { poem, recipient } = this.state
    const body = poem.lines.join('%0D%0A')
    const anchor = document.querySelector(`.${style.mailLink}`)
    anchor.href = `mailto:${recipient}?subject=${poem.title}&body=${body}`
    anchor.click()
  }
  updateRecipient = e => {
    this.setState({
      recipient: e.target.value,
    })
  }
  render = () => {
    const { getPoem, state, send, updateRecipient } = this
    const { error, loading, poem } = state

    return (
      <Fragment>
        <a target="_blank" className={style.mailLink}>
          {' '}
          Send
        </a>
        {loading && (
          <h2 className={style.loadingMsg}>Contacting PoetryDB... 📞</h2>
        )}
        {error && <Msg tryAgain={getPoem} type="error" />}
        {poem && (
          <Composer
            innerRef={c => (this.composer = c)}
            poem={poem}
            send={send}
            updateRecipient={updateRecipient}
          />
        )}
        {poem &&
          poem.lines.length > 20 && <Msg tryAgain={getPoem} type="warning" />}
      </Fragment>
    )
  }
}
export default App

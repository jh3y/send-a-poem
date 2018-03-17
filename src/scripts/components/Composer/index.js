import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { TimelineMax } from 'gsap'
/* eslint-disable no-unused-vars */
import TextPlugin from 'gsap/TextPlugin'
/* eslint-enable no-unused-vars */

import style from './composer.styl'

class Composer extends Component {
  static defaultProps = {
    innerRef: () => {},
    send: () => {},
    updateRecipient: () => {},
  }
  static propTypes = {
    send: PropTypes.func,
    poem: PropTypes.shape({
      author: PropTypes.string,
      title: PropTypes.string,
      lines: PropTypes.arrayOf(PropTypes.string),
    }),
    updateRecipient: PropTypes.func,
  }

  state = {
    poem: this.props.poem,
  }

  compose = () => {
    const { composer, state } = this
    const { poem } = state
    // if (false) {
    if (poem) {
      const subject = composer.querySelector(`.${style.subject}`)
      const content = composer.querySelector(`.${style.content}`)
      const lines = content.querySelectorAll(`.${style.line}`)
      const setHeight = lines[0].getBoundingClientRect().height
      const generateLine = (text, el, delay = 0) => {
        const tl = new TimelineMax({
          onComplete: () => {
            content.scrollTop = content.scrollHeight
            if (el.nextElementSibling) {
              el.nextElementSibling.setAttribute(
                'style',
                `min-height: ${setHeight}px`
              )
            }
          },
          delay,
        })
        for (let l = 1; l < text.length + 1; l++) {
          tl.add(
            TweenMax.to(el, 0.04, {
              text: text.slice(0, l),
              onComplete: () => {
                content.scrollTop = content.scrollHeight
              },
            })
          )
        }
        return tl
      }
      const wipe = el =>
        TweenMax.to(el, 0, {
          color: 'black',
          text: '',
          delay: Math.random(),
        })
      const generateLinesTl = () => {
        const linesTl = new TimelineMax()
        for (let l = 1; l < poem.lines.length; l++) {
          if (poem.lines[l].trim() === '') {
            linesTl.add(() =>
              TweenMax.to(lines[l], 0, { delay: Math.random() })
            )
          } else {
            linesTl.add(generateLine(poem.lines[l], lines[l], Math.random()))
          }
        }
        return linesTl
      }
      const poemTl = new TimelineMax()
      poemTl
        .add(
          generateLine(poem.title, subject, Math.random() + 0.25, 'Subject:')
        )
        .add(wipe(lines[0]))
        .add(generateLine(poem.lines[0], lines[0], Math.random() + 0.25))
        .add(generateLinesTl())
    }
  }

  componentDidMount = () => {
    this.compose()
  }

  render = () => {
    const { poem, send, updateRecipient } = this.props
    return (
      <div className={style.container} ref={c => (this.composer = c)}>
        <header className={style.header}>
          <h1 className={style.label}>To:</h1>
          <input
            type="text"
            className={style.recipient}
            onInput={updateRecipient}
            placeholder={'Enter recipient email'}
          />
          <h1 className={style.label}>Subject:</h1>
          <h1 className={style.subject} />
        </header>
        <article className={style.content}>
          {poem.lines.map((line, idx) => (
            <p className={style.line} key={`poem-line--${idx}`}>
              {idx === 0 && 'Compose your message'}
            </p>
          ))}
        </article>
        <div className={style.actions}>
          <button className={style.send} onClick={send}>
            Send
          </button>
        </div>
      </div>
    )
  }
}

export default Composer

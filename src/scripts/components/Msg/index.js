import PropTypes from 'prop-types'
import React from 'react'
import style from './msg.styl'

const Msg = ({ tryAgain, type }) => (
  <div className={style.container}>
    <h1 className={`${style.msg} ${style[`msg--${type}`]}`}>
      {type === 'error'
        ? 'Owww, looks like something went wrong 😭'
        : '⚠️ This poem could be pretty long, you might be waiting a while...'}
    </h1>
    <button className={style[`btn--${type}`]} onClick={tryAgain}>
      {type === 'error' ? 'Try again' : 'Get another one'}
    </button>
  </div>
)
Msg.defaultProps = {
  tryAgain: () => {},
}
Msg.propTypes = {
  type: PropTypes.oneOf(['error', 'warning']),
  tryAgain: PropTypes.func,
}
export default Msg

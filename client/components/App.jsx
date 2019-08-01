import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getUser } from '../actions'

import Navbar from './Navbar'
import Accounts from './Accounts'

class App extends Component {
  componentDidMount() {
    this.props.getUser()
  }

  render() {
    return (
      <div>
        <Navbar user={ this.props.user }/>
        <Accounts />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: () => dispatch(getUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

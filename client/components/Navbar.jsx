import React, { Component } from 'react'

class Navbar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const name = this.props.user.name || 'Loading..'
    return (
      <nav className="flex items-center justify-between flex-wrap bg-crypto-navy p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <img src="/assets/logo-white.png" width="200" />
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
            Help
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Account
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
              Settings
            </a>
          </div>
          <div>
            <a href="/auth/logout" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-crypto-navy hover:bg-white mt-4 lg:mt-0">{ `${name} ` }<i className="fas fa-sign-out-alt text-rc-grey"></i></a>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar

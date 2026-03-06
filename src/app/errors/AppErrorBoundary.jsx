import { Component } from 'react'
import { redirectTo404 } from './redirectTo404'

export class AppErrorBoundary extends Component {
  componentDidCatch() {
    redirectTo404()
  }

  render() {
    return this.props.children
  }
}

// @flow
import Push from './push/push.native'
import React, {Component} from 'react'
import {Navigation} from 'react-native-navigation'
import {Provider} from 'react-redux'
import RenderRoute, {RenderRouteNode} from '../route-tree/render-route'
import loadPerf from '../util/load-perf'
import hello from '../util/hello'
import {bootstrap} from '../actions/config'
import {connect} from 'react-redux'
import debounce from 'lodash/debounce'
import {getUserImageMap, loadUserImageMap} from '../util/pictures'
import {initAvatarLookup, initAvatarLoad} from '../common-adapters/index.native'
import {listenForNotifications} from '../actions/notifications'
import {persistRouteState, loadRouteState} from '../actions/platform-specific.native'
import {navigateUp, setRouteState} from '../actions/route-tree'

import type {TypedState} from '../constants/reducer'

type Props = {
  dumbFullscreen: boolean,
  folderBadge: number,
  mountPush: boolean,
  routeDef: any,
  routeState: any,
  showPushPrompt: any,
  bootstrap: () => void,
  hello: () => void,
  listenForNotifications: () => void,
  loadRouteState: () => void,
  persistRouteState: () => void,
  setRouteState: (path: any, partialState: any) => void,
  navigateUp: () => void,
}

type OwnProps = {
  platform: string,
  version: string,
}

class Main extends Component<void, any, void> {
  constructor(props: Props) {
    super(props)
    this._lastStack = null

    if (!global.mainLoaded) {
      global.mainLoaded = true
      initAvatarLookup(getUserImageMap)
      initAvatarLoad(loadUserImageMap)

      this.props.loadRouteState()
      this.props.bootstrap()
      this.props.listenForNotifications()
      this.props.hello()
      loadPerf()
    }
  }

  _persistRoute = debounce(() => {
    this.props.persistRouteState()
  }, 200)

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.routeState !== nextProps.routeState) {
      this._persistRoute()
    }
  }

  hackyUpdateStack = (viewStack) => {
    function screenNameFromItem(item) {
      return 'keybase.' + item.path.join('.')
    }

    viewStack = viewStack.skip(1)  // root stack item is already rendered

    const lastStack = this._lastStack
    this._lastStack = viewStack

    if (!lastStack) {
      this.props.navigator.popToRoot()
      return
    }

    let screens = global.hackRegisteredScreens
    if (!screens) {
      screens = global.hackRegisteredScreens = {}
    }

    viewStack.forEach(item => {
      const screenName = screenNameFromItem(item)
      if (!screens[screenName]) {
        Navigation.registerComponent(screenName, () => RenderRouteNode, this.props.store, Provider)
      }
    })

    lastStack.forEach((oldItem, key) => {
      if (!viewStack.get(key) || !viewStack.get(key).equals(oldItem)) {
        this.props.navigator.pop()
      }
    })

    viewStack.forEach((newItem, key) => {
      if (!lastStack.get(key) || !lastStack.get(key).equals(newItem)) {
        this.props.navigator.push({
          screen: screenNameFromItem(newItem),
          passProps: newItem.component.props,
          navigatorStyle: {
            navBarHidden: true,
          },
        })
      }
    })
  }

  render() {
    if (this.props.dumbFullscreen) {
      const DumbSheet = require('../dev/dumb-sheet').default
      return <DumbSheet />
    }

    // TODO: move Push prompt into route
    const {showPushPrompt, mountPush} = this.props

    if (showPushPrompt && mountPush) {
      return <Push prompt={showPushPrompt} />
    }

    return (
      <RenderRoute
        routeDef={this.props.routeDef.getChild(this.props.part)}
        routeState={this.props.routeState.getChild(this.props.part)}
        pathPrefix={[this.props.part]}
        setRouteState={this.props.setRouteState}
        hackyUpdateStack={this.hackyUpdateStack}
      />
    )
  }
}

const mapStateToProps = (state: TypedState) => ({
  dumbFullscreen: state.dev.debugConfig.dumbFullscreen,
  folderBadge: state.favorite.folderState.privateBadge + state.favorite.folderState.publicBadge,
  mountPush: state.config.loggedIn && state.config.bootStatus === 'bootStatusBootstrapped',
  routeDef: state.routeTree.routeDef,
  routeState: state.routeTree.routeState,
  showPushPrompt: state.push.permissionsPrompt,
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => ({
  bootstrap: () => dispatch(bootstrap()),
  hello: () => hello(0, ownProps.platform, [], ownProps.version, true), // TODO real version
  listenForNotifications: () => dispatch(listenForNotifications()),
  loadRouteState: () => dispatch(loadRouteState()),
  navigateUp: () => {
    dispatch(navigateUp())
  },
  persistRouteState: () => dispatch(persistRouteState()),
  setRouteState: (path, partialState) => {
    dispatch(setRouteState(path, partialState))
  },
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export {connector, Main}

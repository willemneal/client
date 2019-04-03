// @flow
import * as Kb from '../../common-adapters'
import React from 'react'
import * as Styles from '../../styles/index'

// TODO: what is the correct thing to do when don't have any props
class OfflineFolder extends React.PureComponent<any> {
  render() {
    return (
      <Kb.Box2 direction="vertical" fullHeight={true} fullWidth={true}>
        <Kb.Box2
          direction="vertical"
          style={styles.emptyContainer}
          fullHeight={true}
          fullWidth={true}
          centerChildren={true}
        >
          <Kb.Icon type="iconfont-cloud" fontSize={64} color={Styles.globalColors.black_10} />
          <Kb.Text type="BodySmall">You haven't synced this folder.</Kb.Text>
        </Kb.Box2>
      </Kb.Box2>
    )
  }
}

const styles = Styles.styleSheetCreate({
  emptyContainer: {
    ...Styles.globalStyles.flexGrow,
    backgroundColor: Styles.globalColors.blueGrey,
  },
})

export default OfflineFolder

// @flow
import {makeLeafTags} from '../route-tree'
import Username from './username-or-email/container'
import SelectOtherDevice from './select-other-device/container'
import Password from './password/container'
import PaperKey from './paper-key/container'
import CodePage from './code-page/container'
import SetPublicName from './set-public-name/container'
import RegisterError from './error/container'
import GPGSign from './gpg-sign/container'
import ForgotUsername from './forgot-username/container'

const addTags = component => ({
  component,
  // We don't use the statusbar which removes the padding for iphone X so force that back in
  tags: makeLeafTags({hideStatusBar: true}),
})

const children = {
  codePage: {
    component: CodePage,
    tags: makeLeafTags({hideStatusBar: true, underNotch: true}),
  },
  error: addTags(RegisterError),
  forgotUsername: addTags(ForgotUsername),
  gpgSign: addTags(GPGSign),
  paperkey: addTags(PaperKey),
  password: addTags(Password),
  selectOtherDevice: addTags(SelectOtherDevice),
  setPublicName: addTags(SetPublicName),
  username: addTags(Username),
}

export default children

export const newRoutes = {
  codePage: {getScreen: () => CodePage, upgraded: true},
  error: {getScreen: () => RegisterError, upgraded: true},
  forgotUsername: {getScreen: () => ForgotUsername},
  gpgSign: {getScreen: () => GPGSign, upgraded: true},
  paperkey: {getScreen: () => PaperKey, upgraded: true},
  password: {getScreen: () => Password, upgraded: true},
  selectOtherDevice: {getScreen: () => SelectOtherDevice, upgraded: true},
  setPublicName: {getScreen: () => SetPublicName, upgraded: true},
  username: {getScreen: () => Username, upgraded: true},
}
export const newModalRoutes = {}

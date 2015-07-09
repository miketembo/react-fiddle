import React from 'react/addons';
import mui from 'material-ui';

// @TODO move
let themeManager = new mui.Styles.ThemeManager();

export function toUIElement(Comp) {
  Comp.prototype.getChildContext = function() {
    return {muiTheme: themeManager.getCurrentTheme()};
  }
  Comp.childContextTypes = Comp.childContextTypes || {};

  Comp.childContextTypes.muiTheme = React.PropTypes.object;

  return Comp;
}

export let {update} = React.addons;

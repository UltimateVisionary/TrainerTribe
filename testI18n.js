const I18n = require('i18n-js');
console.log('I18n:', I18n);
console.log('typeof I18n:', typeof I18n);
console.log('typeof I18n.t:', typeof I18n.t);
if (I18n.t) {
  console.log('I18n.t("settings"):', I18n.t('settings'));
} else {
  console.log('I18n.t is not a function');
}

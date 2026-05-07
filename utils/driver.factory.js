const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

class DriverFactory {
  static async createDriver(browsername = 'chrome') {
    switch (browsername.toLowerCase()) {
      case 'chrome': {
        const chromeOptions = new chrome.Options();
        chromeOptions.addArguments(
          '--start-maximized',
          '--disable-blink-features=AutomationControlled',
          '--user-data-dir=/tmp/chrome-profile'
        );
        return new Builder()
          .forBrowser(browsername)
          .setChromeOptions(chromeOptions)
          .build();
      }

      case 'firefox': {
        const firefoxOptions = new firefox.Options();
        firefoxOptions.setPreference('dom.webdriver.enabled', false);
        firefoxOptions.setPreference('useAutomationExtension', false);
        firefoxOptions.setPreference('media.navigator.enabled', false);
        return new Builder()
          .forBrowser(browsername)
          .setFirefoxOptions(firefoxOptions)
          .build();
      }

      default:
        throw new Error(`Unsupported browser: ${browsername}`);
    }
  }
}

module.exports = DriverFactory;

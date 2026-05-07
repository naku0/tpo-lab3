const { By, until } = require('selenium-webdriver');

class CookieAnnihilator3000Interceptor {
  static async annihilate(driver) {
    try {
      console.log('[COOKIE] Searching cookie consent');

      const acceptButton = await driver.wait(
        until.elementLocated(
          By.xpath('//button[@data-testid="uc-accept-all-button"]')
        ),
        5000
      );

      const cookieOverlay = By.xpath('//div[@data-testid="uc-overlay"]');

      console.log('[COOKIE] Clicking accept');

      await acceptButton.click();

      console.log('[COOKIE] Waiting for overlay to disappear');

      await driver.wait(
        until.elementIsNotVisible(driver.findElement(cookieOverlay)),
        5000
      );

      console.log('[COOKIE] Cookie annihilated');

      return true;
    } catch (error) {
      console.log(`[COOKIE] Not found: ${error.message}`);
      return false;
    }
  }
}

module.exports = CookieAnnihilator3000Interceptor;

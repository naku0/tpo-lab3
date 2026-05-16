const { By, until } = require('selenium-webdriver');

class CaptchaSolverInterceptor {
  static async solve(driver, timeout = 300000) {
    try {
      const recaptchaContainer = await driver.wait(
        until.elementLocated(By.xpath('//div[@data-qa="recaptcha-component"]')),
        5000
      );

      const iframe = await recaptchaContainer.findElement(
        By.xpath('.//iframe[contains(@title, "reCAPTCHA")]')
      );

      await driver.switchTo().frame(iframe);

      const checkbox = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="recaptcha-anchor"]')),
        10000
      );

      await checkbox.click();

      await driver.switchTo().defaultContent();

      await driver.sleep(3000);

      console.log('[CAPTCHA] Waiting captcha disappear');

      await driver.wait(async () => {
        const iframes = await driver.findElements(
          By.xpath('//iframe[contains(@title, "reCAPTCHA")]')
        );

        return iframes.length === 0;
      }, timeout);

      console.log('[CAPTCHA] Solved');

      return true;
    } catch {
      console.log('[CAPTCHA] Not found');

      return false;
    }
  }
}

module.exports = CaptchaSolverInterceptor;

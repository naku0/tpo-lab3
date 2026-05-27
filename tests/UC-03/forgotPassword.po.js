const { until, By } = require('selenium-webdriver');

class ForgotPasswordPage {
  constructor(driver) {
    this.driver = driver;
    this.emailFieldCandidates = [
      By.css('#username'),
      By.xpath('//input[@id="username"]'),
      By.xpath('//input[@name="username"]'),
      By.xpath('//input[@type="email"]'),
    ];
    this.recoveryButtonCandidates = [
      By.xpath('//button[@data-test-id="recovery-next-button"]'),
      By.xpath('//button[@type="submit"]'),
    ];
    this.codeInputCandidates = [
      By.xpath('//input[@inputmode="tel"]'),
      By.xpath('//input[@autocomplete="one-time-code"]'),
      By.xpath('//input[contains(@name, "code")]'),
      By.xpath('//input[contains(@id, "code")]'),
      By.xpath(
        '//*[contains(@data-test-id, "recovery") and (contains(@data-test-id, "code") or contains(@data-test-id, "email"))]'
      ),
      By.xpath(
        '//*[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "check your inbox")]'
      ),
      By.xpath(
        '//*[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "email with a code")]'
      ),
    ];
  }

  async getEmailField() {
    return await this.waitForAnyVisible(this.emailFieldCandidates, 10000);
  }

  async getRecoveryButton() {
    return await this.waitForAnyVisible(this.recoveryButtonCandidates, 10000);
  }

  async enterEmail(email) {
    const element = await this.getEmailField();
    await element.clear();
    await element.sendKeys(email);
  }

  async clickRecoveryButton() {
    const button = await this.getRecoveryButton();
    await button.click();
  }

  async waitForPageLoad() {
    await this.waitForAnyVisible(this.emailFieldCandidates, 10000);
  }

  async isOk() {
    try {
      const found = await this.waitForAnyVisible(this.codeInputCandidates, 10000);
      return !!found;
    } catch {
      return false;
    }
  }

  async findFirstVisible(locators) {
    for (const locator of locators) {
      const elements = await this.driver.findElements(locator);
      if (elements.length === 0) continue;
      const visible = await elements[0].isDisplayed().catch(() => false);
      if (visible) return elements[0];
    }

    return null;
  }

  async waitForAnyVisible(locators, timeout = 10000) {
    let found = null;
    await this.driver.wait(async () => {
      found = await this.findFirstVisible(locators);
      return !!found;
    }, timeout);

    return found;
  }
}

module.exports = ForgotPasswordPage;

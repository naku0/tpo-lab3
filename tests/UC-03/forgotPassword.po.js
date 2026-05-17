const { until, By } = require('selenium-webdriver');

class ForgotPasswordPage {
  constructor(driver) {
    this.driver = driver;
    this.emailField = By.xpath('//input[@id="username"]');
    this.recoveryButton = By.xpath(
      '//button[@data-test-id="recovery-next-button"]'
    );
    this.codeInput = By.xpath('//input[@inputmode="tel"]');
  }

  async getEmailField() {
    return await this.driver.wait(until.elementLocated(this.emailField), 10000);
  }

  async getRecoveryButton() {
    return await this.driver.wait(
      until.elementLocated(this.recoveryButton),
      10000
    );
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
    await this.driver.wait(until.elementLocated(this.emailField), 10000);
  }

    async isOk() {

        try {

            await this.driver.wait(async () => {

                const elements =
                    await this.driver.findElements(
                        this.codeInput
                    );

                return elements.length === 6;

            }, 10000);

            return true;

        } catch {

            return false;
        }
    }
}

module.exports = ForgotPasswordPage;

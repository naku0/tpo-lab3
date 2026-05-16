const { By, until } = require('selenium-webdriver');

class LoginPage {
  constructor(driver) {
    this.driver = driver;

    this.emailInput = By.xpath('//input[@data-qa="username"]');
    this.passwordInput = By.xpath('//input[@data-qa="password"]');
    this.loginButton = By.xpath(
      '//button[@type="submit"]//span[text()="Log in"]/ancestor::button'
    );
    this.errorMessage = By.xpath('//div[@role="alert"]');
  }

  async getEmailElement() {
    return await this.driver.wait(until.elementLocated(this.emailInput), 10000);
  }

  async getPasswordElement() {
    return await this.driver.wait(
      until.elementLocated(this.passwordInput),
      10000
    );
  }

  async getLoginButtonElement() {
    return await this.driver.wait(
      until.elementLocated(this.loginButton),
      10000
    );
  }

  async getErrorMessageElement() {
    return await this.driver.wait(
      until.elementLocated(this.errorMessage),
      10000
    );
  }

  async enterEmail(email) {
    const element = await this.getEmailElement();
    await element.clear();
    await element.sendKeys(email);
  }

  async enterPassword(password) {
    const element = await this.getPasswordElement();
    await element.clear();
    await element.sendKeys(password);
  }

  async clickLoginButton() {
    const button = await this.getLoginButtonElement();
    await button.click();
  }

  async isThereVisibleError() {
    const element = await this.getErrorMessageElement();
    if (!element) return false;

    return await element.isDisplayed();
  }

  async isEmailValid() {
    const element = await this.getEmailElement();
    return await this.driver.executeScript((el) => el.validity.valid, element);
  }

  async isPasswordValid() {
    const element = await this.getPasswordElement();
    return await this.driver.executeScript((el) => el.validity.valid, element);
  }

  async clearEmail() {
    const element = await this.getEmailElement();
    await element.clear();
  }

  async clearPassword() {
    const element = await this.getPasswordElement();
    await element.clear();
  }

  async waitForPageLoad() {
    await this.driver.wait(until.elementLocated(this.emailInput), 10000);
  }
}

module.exports = LoginPage;

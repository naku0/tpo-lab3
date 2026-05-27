const { By, until, Key } = require('selenium-webdriver');

class LocationSettingsPage {
  constructor(driver) {
    this.driver = driver;
    this.cityInput = By.xpath(
      '//input[@role="combobox" and contains(@id, "downshift") and contains(@aria-controls, "downshift")]'
    );
    this.saveButton = By.xpath('//button[@data-testid="profile-contact-details-edit-done"]');
  }

  async waitForPersonalPageLoad() {
    await this.driver.wait(until.elementLocated(this.cityInput), 10000);
  }

  async getCityInput() {
    return await this.driver.wait(until.elementLocated(this.cityInput), 10000);
  }

  async getSaveButton() {
    return await this.driver.wait(until.elementLocated(this.saveButton), 10000);
  }

  async enterCity(city) {
    const cityInput = await this.getCityInput();
    await cityInput.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await cityInput.sendKeys(Key.DELETE);
    await this.driver.sleep(100);
    let currentValue = await cityInput.getAttribute('value');
    if (currentValue !== '') {
      await this.driver.executeScript("arguments[0].value = '';", cityInput);
      await this.driver.sleep(50);
    }
    await cityInput.sendKeys(city);
  }

  async pushSaveButton() {
    const button = await this.getSaveButton();
    await button.click();
  }
}

module.exports = LocationSettingsPage;

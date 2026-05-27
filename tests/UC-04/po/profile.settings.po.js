const { By, until, Key } = require('selenium-webdriver');

class ProfileSettingsPage {
  constructor(driver) {
    this.driver = driver;

    this.titleDropdown = By.xpath(
      '//select[@data-testid="academic-title-select" or @data-qa="dropdown"]'
    );
    this.nameInput = By.xpath('//input[@data-testid="first-name"]');
    this.lastNameInput = By.xpath('//input[@data-testid="last-name"]');
    this.imageInput = By.xpath(
      '//input[@data-qa="edit-profile-image-input-file"]'
    );
    this.personalSettingsSaveButton = By.xpath(
      '//button[@data-qa="settings-form-submit-button"]'
    );
    this.successMessage = By.xpath('//div[@data-qa="pending-change-view"]');
  }

  async getTitleDropdownElement() {
    return await this.driver.wait(
      until.elementLocated(this.titleDropdown),
      10000
    );
  }

  async getNameInputElement() {
    return await this.driver.wait(until.elementLocated(this.nameInput), 10000);
  }

  async getLastNameInputElement() {
    return await this.driver.wait(
      until.elementLocated(this.lastNameInput),
      10000
    );
  }

  async getImageInputElement() {
    return await this.driver.wait(until.elementLocated(this.imageInput), 10000);
  }

  async getSaveButtonElement() {
    return await this.driver.wait(
      until.elementLocated(this.personalSettingsSaveButton),
      10000
    );
  }

  async getSuccessMessageElement() {
    return await this.driver.wait(
      until.elementLocated(this.successMessage),
      10000
    );
  }

  async selectTitle(title) {
    const dropdown = await this.getTitleDropdownElement();
    await dropdown.click();
    const option = By.xpath(`//option[text()="${title}"]`);
    await this.driver.findElement(option).click();
  }

  async enterName(name) {
    const element = await this.getNameInputElement();

    await element.click();

    await element.sendKeys(Key.chord(Key.CONTROL, 'a'));

    await element.sendKeys(Key.DELETE);

    await this.driver.sleep(100);

    let currentValue = await element.getAttribute('value');
    if (currentValue !== '') {
      await this.driver.executeScript("arguments[0].value = '';", element);
      await this.driver.sleep(50);
    }

    await element.sendKeys(name);

    await this.driver.executeScript(
      `
        arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
    `,
      element
    );
  }

  async enterLastName(lastName) {
    const element = await this.getLastNameInputElement();
    await element.clear();
    await element.sendKeys(lastName);
  }

  async uploadImage(imagePath) {
    const element = await this.getImageInputElement();
    await element.sendKeys(imagePath);
  }

  async isSaveButtonEnabled() {
    const button = await this.getSaveButtonElement();
    const ariaDisabled = await button.getAttribute('aria-disabled');
    return ariaDisabled !== 'true';
  }

  async isSaveButtonDisabled() {
    const button = await this.getSaveButtonElement();
    const ariaDisabled = await button.getAttribute('aria-disabled');
    return ariaDisabled === 'true';
  }

  async waitForSaveButtonEnabled(timeout = 5000) {
    await this.driver.wait(
      async () => {
        return await this.isSaveButtonEnabled();
      },
      timeout,
      'Save button did not become enabled'
    );
  }

  async clickSaveButton() {
    await this.waitForSaveButtonEnabled();
    const button = await this.getSaveButtonElement();
    await button.click();
  }

  async waitForPersonalPageLoad() {
    await this.driver.wait(until.elementLocated(this.nameInput), 10000);
    await this.driver.wait(until.elementLocated(this.lastNameInput), 10000);
    await this.driver.wait(until.elementLocated(this.titleDropdown), 10000);
  }

  async waitForChangePicturePageLoad() {
    await this.driver.wait(until.elementLocated(this.imageInput), 10000);
  }

  async waitForSaveComplete() {
    await this.driver.wait(until.elementLocated(this.successMessage), 10000);
  }

  async getNameInputValue() {
    const element = await this.getNameInputElement();
    const value = await element.getAttribute('value');
    console.log(`📝 getNameInputValue вернула: "${value}"`);
    return value;
  }

  async updateProfile({ title, name, lastName, imagePath }) {
    if (title) await this.selectTitle(title);
    if (name) await this.enterName(name);
    if (lastName) await this.enterLastName(lastName);
    if (imagePath) await this.uploadImage(imagePath);
    await this.clickSaveButton();
    await this.waitForSaveComplete();
  }
}

module.exports = ProfileSettingsPage;

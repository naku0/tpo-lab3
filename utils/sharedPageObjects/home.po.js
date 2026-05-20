const { By, until } = require('selenium-webdriver');

class HomePage {
  constructor(driver) {
    this.driver = driver;

    this.profileButton = By.xpath(
      '//button[.//*[@data-testid="header-profile-logo"]]'
    );

    this.profileDropdown = By.xpath('//div[@data-testid="me-menu-dropdown"]');

    this.profileMenuItem = By.xpath('//a[@data-testid="me-menu-item-profile"]');

    this.fakeInput = By.xpath('//input[@data-testid="search-bar-fake-input"]');
  }

  async waitForPageLoad() {
    const button = await this.driver.wait(
      until.elementLocated(this.profileButton),
      10000
    );

    await this.driver.wait(until.elementIsVisible(button), 5000);
  }

  async clickProfileButton() {
    const button = await this.driver.wait(
      until.elementLocated(this.profileButton),
      10000
    );

    try {
      await button.click();
    } catch {
      await this.driver.executeScript('arguments[0].click()', button);
    }

    await this.driver.wait(until.elementLocated(this.profileDropdown), 5000);
  }

  async clickProfileMenuItem() {
    const menuItem = await this.driver.wait(
      until.elementLocated(this.profileMenuItem),
      5000
    );

    await this.driver.wait(until.elementIsVisible(menuItem), 5000);

    try {
      await menuItem.click();
    } catch {
      await this.driver.executeScript('arguments[0].click()', menuItem);
    }
  }

  async openProfile() {
    await this.clickProfileButton();

    await this.clickProfileMenuItem();
  }

  async openJobsPage() {
    const fakeInputEl = await this.driver.wait(
      until.elementLocated(this.fakeInput),
      5000
    );
    await fakeInputEl.click();
  }
}

module.exports = HomePage;

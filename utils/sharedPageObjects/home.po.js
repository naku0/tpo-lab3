const { By, until } = require('selenium-webdriver');

class HomePage {
  constructor(driver) {
    this.driver = driver;

    this.profileButtonCandidates = [
      By.xpath('//button[.//*[@data-testid="header-profile-logo"]]'),
      By.xpath(
        '//button[contains(@data-testid, "profile") or contains(@data-testid, "user-menu") or contains(@data-testid, "me-menu")]'
      ),
      By.xpath(
        '//button[contains(@aria-label, "Profile") or contains(@aria-label, "Me") or contains(@aria-label, "Account")]'
      ),
      By.xpath(
        '//a[contains(@href, "/profile/") and (contains(@data-testid, "profile") or contains(@aria-label, "Profile"))]'
      ),
    ];

    this.profileDropdownCandidates = [
      By.xpath('//div[@data-testid="me-menu-dropdown"]'),
      By.xpath(
        '//div[contains(@data-testid, "me-menu") or contains(@data-testid, "user-menu")]'
      ),
      By.xpath('//div[@role="menu"]'),
    ];

    this.profileMenuItemCandidates = [
      By.xpath('//a[@data-testid="me-menu-item-profile"]'),
      By.xpath(
        '//a[contains(@href, "/profile/") and (contains(@data-testid, "me-menu-item") or contains(@aria-label, "Profile"))]'
      ),
      By.xpath(
        '//a[contains(@href, "/profile/") and contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "profile")]'
      ),
    ];

    this.fakeInput = By.xpath('//input[@data-testid="search-bar-fake-input"]');
  }

  async waitForPageLoad() {
    await this.waitForAnyVisible(this.profileButtonCandidates, 10000);
  }

  async clickProfileButton() {
    const button = await this.waitForAnyVisible(
      this.profileButtonCandidates,
      10000
    );
    if (!button) return false;

    try {
      await button.click();
    } catch {
      await this.driver.executeScript('arguments[0].click()', button);
    }

    await this.waitForAnyVisible(this.profileDropdownCandidates, 5000);
    return true;
  }

  async clickProfileMenuItem() {
    const menuItem = await this.waitForAnyVisible(
      this.profileMenuItemCandidates,
      5000
    );
    if (!menuItem) return false;

    try {
      await menuItem.click();
    } catch {
      await this.driver.executeScript('arguments[0].click()', menuItem);
    }

    return true;
  }

  async openProfile() {
    const opened = await this.clickProfileButton();
    if (!opened) return false;

    return await this.clickProfileMenuItem();
  }

  async openJobsPage() {
    const fakeInputEl = await this.findFirstVisible([this.fakeInput]);
    if (!fakeInputEl) return false;
    await this.clickElement(fakeInputEl);
    return true;
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

  async clickElement(element) {
    await this.driver.wait(until.elementIsVisible(element), 10000);
    try {
      await element.click();
    } catch {
      await this.driver.executeScript('arguments[0].click()', element);
    }
  }
}

module.exports = HomePage;

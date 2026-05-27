const { By, until } = require('selenium-webdriver');

class MembersSearchPage {
  constructor(driver) {
    this.driver = driver;
    this.searchUrl = 'https://www.xing.com/search/members?keywords=';
    this.resultItem = By.xpath(
      '//div[@data-testid="members-search-result-item"]'
    );
    this.resultLink = By.xpath(
      '//a[@data-testid="unfenced-member-result"]'
    );
    this.profileAddContactButton = By.xpath(
      '//button[@data-qa="profile-primary-action" and contains(., "Add as contact")]'
    );
  }

  async openSearch(keyword) {
    const url = `${this.searchUrl}${encodeURIComponent(keyword)}`;
    await this.driver.get(url);
    await this.driver.wait(until.elementLocated(this.resultItem), 10000);
  }

  async openFirstProfile() {
    try {
      const link = await this.driver.wait(
        until.elementLocated(this.resultLink),
        10000
      );
      const href = await link.getAttribute('href');
      if (href) {
        await this.driver.get(href);
        return true;
      }

      try {
        await link.click();
      } catch {
        await this.driver.executeScript('arguments[0].click()', link);
      }
      return true;
    } catch {
      return false;
    }
  }

  async hasProfileAddContactButton() {
    try {
      const button = await this.driver.wait(
        until.elementLocated(this.profileAddContactButton),
        10000
      );
      return await button.isDisplayed();
    } catch {
      return false;
    }
  }
}

module.exports = MembersSearchPage;

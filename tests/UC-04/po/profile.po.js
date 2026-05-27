const { By, until } = require('selenium-webdriver');

class ProfilePage {
  constructor(driver) {
    this.driver = driver;
    this.editButtonCandidates = [
      By.xpath('//button[@data-qa="profile-primary-action"]'),
      By.xpath('//button[@data-testid="profile-primary-action"]'),
      By.xpath('//button[contains(@data-testid, "profile-primary-action")]'),
      By.xpath('//button[contains(@aria-label, "Edit")]'),
      By.xpath(
        '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "edit")]'
      ),
    ];

    //UC-04.1
    this.settingLink = By.xpath('//a[@href="/settings/account/misc/name"]');
    this.settingsUrl = 'https://www.xing.com/settings/account/misc/name';
    this.changePictureLink = By.xpath(
      '//a[@href="/profile/my_profile/xing-id/profile-image/edit?sc_o=profile_self_editing_open"]'
    );
    this.profileImage = By.xpath('//div[@data-qa="photo-wrapper"]//img');
    this.locationLink =
      'https://www.xing.com/profile/my_profile/xing-id/contact-details/edit/business';
    //UC-04.2
    this.statusChangeLink = By.xpath(
      '//a[contains(@href="/profile/my_profile/xing-id/status-message/edit?sc_o=profile_self_editing_open_sub_page")]'
    );

    //UC-04.3
    this.locationText = By.xpath(
      '//*[@data-qa="location-pin-icon"]/following::strong[1]'
    );

    this.experienceLink = By.xpath("//a[@test-id='add-moduleButton']");
    this.experienceUrl = 'https://www.xing.com/profile/my_profile/timeline/add';
  }

  async waitForPageLoad() {
    const candidates = [
      ...this.editButtonCandidates,
      this.profileImage,
      this.locationText,
    ];

    await this.waitForAnyVisible(candidates, 10000);
  }

  async pushEditButton() {
    const button = await this.waitForAnyVisible(this.editButtonCandidates, 8000);
    if (!button) return false;
    await this.clickElement(button);
    return true;
  }

  async openSettings() {
    const element = await this.findFirstVisible([this.settingLink]);
    if (element) {
      await this.clickElement(element);
      return true;
    }

    await this.driver.get(this.settingsUrl);
    return true;
  }

  async openChangePicture() {
    await this.driver.findElement(this.changePictureLink).click();
  }

  async openStatusChange() {
    await this.driver.findElement(this.statusChangeLink).click();
  }

  async openLocation() {
    await this.driver.get(this.locationLink);
  }

  async openExperience() {
    const element = await this.findFirstVisible([this.experienceLink]);
    if (element) {
      await this.clickElement(element);
      return true;
    }

    await this.driver.get(this.experienceUrl);
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

  async getProfileImageElement() {
    return await this.driver.wait(
      until.elementLocated(this.profileImage),
      10000
    );
  }

  async getProfileImageSrc() {
    const image = await this.getProfileImageElement();
    return await image.getAttribute('src');
  }

  async getCity() {
    const element = await this.driver.wait(
      until.elementLocated(this.locationText),
      10000
    );

    return await element.getText();
  }
}

module.exports = ProfilePage;

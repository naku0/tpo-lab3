const { By, until } = require('selenium-webdriver');

class ProfilePage {
  constructor(driver) {
    this.driver = driver;
    this.editButton = By.xpath('//button[@data-qa="profile-primary-action"]');

    //UC-04.1
    this.settingLink = By.xpath('//a[@href="/settings/account/misc/name"]');
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
  }

  async waitForPageLoad() {
    await this.driver.wait(until.elementLocated(this.editButton), 10000);
  }

  async pushEditButton() {
    await this.driver.findElement(this.editButton).click();
  }

  async openSettings() {
    const element = await this.driver.wait(
      until.elementLocated(this.settingLink),
      5000
    );
    await element.click();
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

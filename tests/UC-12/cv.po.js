const { By, until } = require('selenium-webdriver');

class CvPage {
  constructor(driver) {
    this.driver = driver;
    this.cvStartUrl = 'https://www.xing.com/lebenslauf?nwt_nav=lebenslauf';
    this.cvCreateUrl = 'https://www.xing.com/lebenslauf/neu';
    this.cvCreateButton = By.xpath(
      '/html/body/div/div[2]/div/main/div[1]/section/a'
    );
    this.cvCreateButtonText = By.xpath(
      '//a[contains(@href, "/lebenslauf/neu") and (contains(., "Create free CV") or contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "lebenslauf") or contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "create"))]'
    );
    this.cvCreateMarkers = [
      By.xpath('//a[@href="/lebenslauf/" and @aria-label="Home"]'),
      By.xpath('//nav//a[@href="#personalInformation"]'),
      By.xpath('//button[@data-qa="vita-document-language"]'),
    ];
    this.downloadButtonCandidates = [
      By.xpath('//button[@type="submit" and contains(., "Download")]'),
      By.xpath(
        '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "download")]'
      ),
      By.xpath(
        '//button[@type="submit" and contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "herunterladen")]'
      ),
      By.xpath(
        '//button[@type="submit"]//*[contains(@data-xds, "IconDownload")]/ancestor::button'
      ),
    ];
  }

  async openStartPage() {
    await this.driver.get(this.cvStartUrl);

    const button = await this.findFirstVisible([
      this.cvCreateButton,
      this.cvCreateButtonText,
    ]);

    if (!button) return false;

    await this.clickElement(button);
    return true;
  }

  async openCreatePage() {
    await this.driver.get(this.cvCreateUrl);
    return await this.waitForCreatePage();
  }

  async waitForCreatePage(timeout = 10000) {
    try {
      await this.driver.wait(async () => {
        for (const locator of this.cvCreateMarkers) {
          const elements = await this.driver.findElements(locator);
          if (elements.length === 0) continue;
          const visible = await elements[0].isDisplayed().catch(() => false);
          if (visible) return true;
        }

        return false;
      }, timeout);

      return true;
    } catch {
      return false;
    }
  }

  async startDownload() {
    const button = await this.findFirstVisible(this.downloadButtonCandidates);
    if (!button) return false;
    await this.clickElement(button);
    return true;
  }

  async hasDownloadButton() {
    for (const locator of this.downloadButtonCandidates) {
      const elements = await this.driver.findElements(locator);
      if (elements.length > 0) return true;
    }

    return false;
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

  async clickElement(element) {
    await this.driver.wait(until.elementIsVisible(element), 10000);
    try {
      await element.click();
    } catch {
      await this.driver.executeScript('arguments[0].click()', element);
    }
  }
}

module.exports = CvPage;

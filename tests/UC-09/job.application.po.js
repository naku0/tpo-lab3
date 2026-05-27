const { By, until } = require('selenium-webdriver');

class JobApplicationPage {
  constructor(driver) {
    this.driver = driver;
    this.resultLinkCandidates = [
      By.xpath('/html/body/div[1]/div[2]/div/div/main/div/div/div[1]/ol/li[1]/article/a'),
      By.xpath(
        '(//article[@data-testid="job-search-result"]//a[contains(@href, "/jobs/")])[1]'
      ),
      By.xpath(
        '(//a[contains(@href, "/jobs/") and not(contains(@href, "/jobs/find"))])[1]'
      ),
      By.xpath('(//a[contains(@href, "/job/")])[1]'),
      By.xpath('(//a[contains(@data-testid, "job")])[1]'),
      By.xpath(
        '(//div[contains(@data-testid, "job") or contains(@class, "job")]//a)[1]'
      ),
    ];
    this.applyCandidates = [
      By.xpath('//*[@data-testid="apply-button" or @data-qa="apply-button" or @data-testid="job-apply-button"]'),
      By.xpath('/html/body/div[1]/div[2]/div/div/main/section/div[3]/div[1]/div[4]/button[1]'),
      By.xpath(
        '//button[@data-testid="apply-button" and contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "easy apply")]'
      ),
      By.xpath(
        '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "apply")]'
      ),
      By.xpath(
        '//a[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "apply")]'
      ),
      By.xpath(
        '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "bewerben")]'
      ),
      By.xpath(
        '//a[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "bewerben")]'
      ),
      By.xpath(
        '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "visit employer website")]'
      ),
    ];
  }

  async openFirstJobResult() {
    const handlesBefore = await this.driver.getAllWindowHandles();
    let link = null;

    try {
      await this.driver.wait(async () => {
        link = await this.findFirstVisible(this.resultLinkCandidates);
        return !!link;
      }, 15000);
    } catch {
      return false;
    }

    if (!link) return false;

    await this.clickElement(link);

    const handlesAfter = await this.driver.getAllWindowHandles();
    if (handlesAfter.length > handlesBefore.length) {
      const newHandle = handlesAfter.find(
        (handle) => !handlesBefore.includes(handle)
      );
      if (newHandle) {
        await this.driver.switchTo().window(newHandle);
      }
    }

    return true;
  }

  async waitForApplyOption(timeout = 15000) {
    try {
      await this.driver.wait(async () => {
        for (const locator of this.applyCandidates) {
          const elements = await this.driver.findElements(locator);
          if (elements.length === 0) continue;
          const isVisible = await elements[0].isDisplayed().catch(() => false);
          if (isVisible) return true;
        }

        return false;
      }, timeout);

      return true;
    } catch {
      return false;
    }
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

module.exports = JobApplicationPage;

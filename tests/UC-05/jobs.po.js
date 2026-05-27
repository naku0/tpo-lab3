const { By, until, Key } = require('selenium-webdriver');

class JobsPage {
  constructor(driver) {
    this.driver = driver;
    this.jobSearchInputCandidates = [
      By.css('textarea[data-testid="cs-search-bar-textarea"]'),
      By.css('main #query-input-input'),
      By.xpath('//main//*[@id="query-input-input"]'),
      By.xpath('//main//input[@name="keywords"]'),
      By.xpath('//main//textarea[@name="keywords"]'),
      By.xpath('//main//input[contains(@data-testid, "search")]'),
      By.xpath('//main//textarea[contains(@data-testid, "search")]'),
      By.css('#query-input-input'),
      By.xpath('//textarea[@id="query-input-input"]'),
      By.xpath('//input[@id="query-input-input"]'),
      By.xpath('//input[@name="keywords"]'),
      By.xpath('//textarea[@name="keywords"]'),
      By.xpath('//input[contains(@data-testid, "search")]'),
      By.xpath('//textarea[contains(@data-testid, "search")]'),
    ];
    this.fakeSearchInputCandidates = [
      By.xpath('//input[@data-testid="search-bar-fake-input"]'),
      By.xpath(
        '//main//a[contains(@href, "/jobs/search") and .//input[@data-testid="search-bar-fake-input"]]'
      ),
      By.xpath('//main//a[contains(@href, "/jobs/search")]'),
    ];
    this.jobsSearchLink = By.xpath('//a[@data-testid="frame-vnav-jobs"]');
    this.submitButtonCandidates = [
      By.css('form button[type="submit"]'),
      By.xpath('//form//button[@type="submit"]'),
      By.xpath('//button[@type="submit" and @aria-label="Find jobs"]'),
      By.xpath('//button[@type="submit" and @data-xds="Button"]'),
      By.xpath('//button[contains(@class, "SubmitButton")]'),
    ];
    this.memberSearchUrl = 'https://www.xing.com/search/members?keywords=';
    this.memberResultItem = By.xpath(
      '//div[@data-testid="members-search-result-item"]'
    );
    this.memberResultLink = By.xpath(
      '//a[@data-testid="unfenced-member-result"]'
    );
    this.jobResultCandidates = [
      By.xpath('//div[@data-qa="job-card"]'),
      By.xpath('//article[@data-testid="job-search-result"]'),
      By.xpath('//article[contains(@data-testid, "job-search")]'),
      By.xpath('//article[contains(@data-testid, "job")]'),
      By.xpath('//main//article'),
    ];
    this.companyNameCandidates = [
      By.xpath('.//*[@data-testid="job-search-result-company-name"]'),
      By.xpath('.//*[contains(@data-testid, "company")]'),
      By.xpath('.//p[contains(@class, "Company")]'),
      By.xpath(
        './/*[contains(translate(@class, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "company")]'
      ),
      By.xpath(
        './/*[contains(translate(@class, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "employer")]'
      ),
      By.xpath(
        './/a[contains(@href, "/company") or contains(@href, "/companies")]'
      ),
    ];
  }

  async submit() {
    const submit = await this.waitForAnyVisible(
      this.submitButtonCandidates,
      8000
    ).catch(() => null);
    if (submit) {
      await this.clickElement(submit);
      return;
    }

    const input = await this.getJobSearchInput(5000);
    if (input) {
      await input.sendKeys(Key.ENTER);
    }
  }

  async clickMembers() {
    await this.driver.get('https://www.xing.com/search/members');
  }

  async clickJobs() {
    await this.driver.get('https://www.xing.com/jobs/find');
    await this.removeCookieOverlay();
    await this.getJobSearchInput(10000);
  }

  async clickCompanies() {
    await this.driver.get('https://www.xing.com/jobs/find');
    await this.removeCookieOverlay();
    await this.getJobSearchInput(10000);
  }

  async findMember(member) {
    const url = `${this.memberSearchUrl}${encodeURIComponent(member)}`;
    await this.driver.get(url);
    await this.driver.wait(async () => {
      const items = await this.driver.findElements(this.memberResultItem);
      const links = await this.driver.findElements(this.memberResultLink);
      return items.length > 0 || links.length > 0;
    }, 15000);
  }


  async tryToFindMember(member) {
    try {
      const items = await this.driver.findElements(this.memberResultItem);
      if (items.length > 0) {
        const text = await items[0].getText();
        return text.toLowerCase().includes(member.toLowerCase());
      }

      const links = await this.driver.findElements(this.memberResultLink);
      if (links.length > 0) {
        const text = await links[0].getText();
        return text.toLowerCase().includes(member.toLowerCase());
      }

      return false;
    } catch {
      return false;
    }
  }

  async findJob(job) {
    await this.removeCookieOverlay();
    const input = await this.getJobSearchInput(10000);
    if (!input) throw new Error('Job search input not found');
    await this.driver.wait(until.elementIsVisible(input), 10000);
    await this.driver.wait(until.elementIsEnabled(input), 10000);
    await input.clear();
    await this.driver.executeScript('arguments[0].focus();', input);
    await input.sendKeys(job);
    await this.submit();
  }

  async tryToFindJob(job) {
    try {
      const query = String(job).toLowerCase();
      const results = await this.getVisibleJobResults(15000);
      if (results.length === 0) return false;

      for (const result of results) {
        const text = (await result.getText()).toLowerCase();
        if (text.includes(query)) return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  async findCompany(company) {
    await this.removeCookieOverlay();
    const input = await this.getJobSearchInput(10000);
    if (!input) throw new Error('Job search input not found');
    await this.driver.wait(until.elementIsVisible(input), 10000);
    await this.driver.wait(until.elementIsEnabled(input), 10000);
    await input.clear();
    await this.driver.executeScript('arguments[0].focus();', input);
    await input.sendKeys(company);
    await this.submit();
  }

  async waitForJobResults(timeout = 15000) {
    return await this.waitForAnyVisible(
      this.jobResultCandidates,
      timeout
    ).catch(() => null);
  }

  async getVisibleJobResults(timeout = 15000) {
    await this.waitForJobResults(timeout);

    for (const locator of this.jobResultCandidates) {
      const elements = await this.driver.findElements(locator);
      if (elements.length === 0) continue;

      const visible = [];
      for (const element of elements) {
        const isVisible = await element.isDisplayed().catch(() => false);
        if (isVisible) visible.push(element);
      }

      if (visible.length > 0) return visible;
    }

    return [];
  }

  async getFirstCompanyName(timeout = 15000) {
    const results = await this.getVisibleJobResults(timeout);
    if (results.length === 0) return null;

    for (const result of results) {
      for (const locator of this.companyNameCandidates) {
        const elements = await result.findElements(locator);
        if (elements.length === 0) continue;
        const text = (await elements[0].getText()).trim();
        if (text) return text;
      }
    }

    return null;
  }

  async hasAnyCompanyInResults(timeout = 15000) {
    const name = await this.getFirstCompanyName(timeout);
    return !!(name && name.trim());
  }

  async removeCookieOverlay() {
    await this.driver.executeScript(`
      const host = document.querySelector('#usercentrics-cmp-ui');
      if (host) {
        host.remove();
      }
    `);
  }

  async getJobSearchInput(timeout = 10000) {
    const input = await this.waitForAnyVisible(
      this.jobSearchInputCandidates,
      timeout
    ).catch(() => null);
    if (input) return input;

    const fakeInput = await this.findFirstVisible(this.fakeSearchInputCandidates);
    if (!fakeInput) return null;

    await this.clickElement(fakeInput);
    return await this.waitForAnyVisible(
      this.jobSearchInputCandidates,
      timeout
    ).catch(() => null);
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

  async tryToFindCompany() {
    return await this.hasAnyCompanyInResults();
  }
}

module.exports = JobsPage;

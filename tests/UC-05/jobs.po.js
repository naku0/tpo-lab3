const { By, Key, until } = require('selenium-webdriver');

class JobsPage {
  constructor(driver) {
    this.driver = driver;
    this.searchButton = By.xpath('//a[@data-testid="frame-vnav-search"]');
    // this.searchInput = By.xpath('/html/body/div[1]/div[2]/div/div/main/div/section/div/div/div[2]/form/div/input');
    this.searchInput = By.xpath('//*[@id="search-input"]');
    // this.jobSearchInput = By.xpath('/html/body/div[1]/div[2]/div/div/main/div/section/div[4]/div[1]/div/div/form/div[1]/div[1]/div/textarea');
    this.jobSearchInput = By.xpath('//*[@id="query-input-input"]');
    this.modal = By.xpath('//div[@data-xds="PopOver"]//a[@data-testid="nav-search-members"]');
    this.members = By.xpath('//a[@data-testid="nav-search-members"]');
    this.jobs = By.xpath('//a[@data-testid="nav-search-jobs"]');
    this.companies = By.xpath('//a[@data-testid="nav-search-companies"]');
    // this.submitButton = By.xpath('//form//button[@type="submit"]');
    this.submitButton = By.xpath('//*[@id="content"]/div/section/div/div/div[2]/form/button');
    this.jobSubmitButton = By.xpath('//*[@id="content"]/div/section/div[4]/div[1]/div/div/form/div[2]/button');
  }

  async waitForInteractable(locator, timeout = 5000) {
    const element = await this.driver.wait(async () => {
      const elements = await this.driver.findElements(locator);
      for (const candidate of elements) {
        try {
          if (await candidate.isDisplayed()) {
            if (await candidate.isEnabled()) {
              return candidate;
            }
          }
        } catch {
          // Ignore stale elements and keep polling.
        }
      }
      return false;
    }, timeout);
    await this.driver.executeScript(
      'arguments[0].scrollIntoView({block: "center", inline: "nearest"});',
      element
    );
    return element;
  }

  async waitForAny(locator, timeout = 10000) {
    return this.driver.wait(async () => {
      const elements = await this.driver.findElements(locator);
      return elements.length > 0 ? elements : false;
    }, timeout);
  }

  async submit(locator = this.submitButton) {
    const submit = await this.waitForInteractable(locator);
    try {
      await submit.click();
    } catch {
      // Fallback for overlays that still block a normal click.
      await this.driver.executeScript('arguments[0].click();', submit);
    }
  }

  async clickMembers() {
    const search = await this.waitForInteractable(this.searchButton);
    await search.click();
    const members = await this.waitForInteractable(this.members);
    await members.click();
  }

  async clickJobs() {
    const search = await this.waitForInteractable(this.searchButton);
    await search.click();
    const jobs = await this.waitForInteractable(this.jobs);
    await jobs.click();
  }

  async clickCompanies() {
    const search = await this.waitForInteractable(this.searchButton);
    await search.click();
    const companies = await this.waitForInteractable(this.companies);
    await companies.click();
  }

  async findMember(member) {
      console.log('=== findMember START ===');
      const input = await this.waitForInteractable(this.searchInput);

      console.log('Input found, checking properties...');

      const isDisplayed = await input.isDisplayed();
      const isEnabled = await input.isEnabled();

      console.log(`Input is displayed: ${isDisplayed}`);
      console.log(`Input is enabled: ${isEnabled}`);


      if (!isDisplayed || !isEnabled) {
          console.log('Input is not interactive! Getting outer HTML...');
          const outerHtml = await input.getAttribute('outerHTML');
          console.log(`Input HTML: ${outerHtml}`);
      }

      await input.sendKeys(member, Key.ENTER);
      console.log('Keys sent to input');
      // await this.submit(this.submitButton);
      console.log('Submit clicked');
      console.log('=== findMember END ===');
  }

  async tryToFindMember(member) {
    try {
      const locator = By.xpath(
        `//div[@data-testid="members-search-result-item"]//*[contains(., '${member}')]`
      );
      const elements = await this.waitForAny(locator);

      return elements.length > 0;
    } catch {
      return false;
    }
  }

  async findJob(job) {
    const input = await this.waitForInteractable(this.jobSearchInput);
    await input.sendKeys(job, Key.ENTER);
    // await this.submit(this.jobSubmitButton);
  }

  async tryToFindJob(job) {
    try {
      // const locator = By.xpath(`//*[contains(., '${job}')]`);
      const locator = By.xpath(`//article[@data-testid="job-search-result"][contains(., '${job}')]`);
      const elements = await this.waitForAny(locator);

      return elements.length > 0;
    } catch {
      return false;
    }
  }

  async findCompany(company) {
    const input = await this.waitForInteractable(this.searchInput);
    await input.sendKeys(company, Key.ENTER);
    // await this.submit(this.submitButton);
  }

  async tryToFindCompany(company) {
    try {
      const locator = By.xpath(
        `//*[@data-testid="search-list-element"]//*[contains(., '${company}')]`
      );
      const elements = await this.waitForAny(locator);

      return elements.length > 0;
    } catch {
      return false;
    }
  }

  async tryToFindMemberBiliberdaResult() {
    try {
      const beliberdaResult = By.xpath('//div[@data-testid="members-search-results-list"]//*[contains(., "No members found")]');

      const elements = await this.waitForAny(beliberdaResult);

      return !!elements.length;
    } catch {
      return false;
    }
  }
}

module.exports = JobsPage;

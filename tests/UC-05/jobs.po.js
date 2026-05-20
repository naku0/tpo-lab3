const { By, until } = require('selenium-webdriver');

class JobsPage {
  constructor(driver) {
    this.driver = driver;
    this.searchButton = By.xpath('//a[@data-testid="frame-vnav-search"]');
    this.searchInput = By.xpath('//input[@id="search-input"]');
    this.jobSearchInput = By.xpath('//textarea[@id="query-input-input"]');
    this.modal = By.xpath('//div[@data-xds="PopOver"]//a[@data-testid="nav-search-members"]');
    this.members = By.xpath('//a[@data-testid="nav-search-members"]');
    this.jobs = By.xpath('//a[@data-testid="nav-search-jobs"]');
    this.companies = By.xpath('//a[@data-testid="nav-search-companies"]');
    this.submitButton = By.xpath('//form//button[@type="submit"]');
  }

  async submit() {
    const submit = await this.driver.findElement(this.submitButton);
    await submit.click();
  }

  async clickMembers() {
    const search = await this.driver.findElement(this.searchButton);
    await search.click();
    const members = await this.driver.findElement(this.members);
    await members.click();
  }

  async clickJobs() {
    const search = await this.driver.findElement(this.searchButton);
    await search.click();
    const jobs = await this.driver.findElement(this.jobs);
    await jobs.click();
  }

  async clickCompanies() {
    const search = await this.driver.findElement(this.searchButton);
    await search.click();
    const companies = await this.driver.findElement(this.companies);
    await companies.click();
  }

    async findMember(member) {
        console.log('=== findMember START ===');
        const input = await this.driver.wait(
            until.elementLocated(this.searchInput),
            5000
        );
        this.driver.wait(until.elementIsVisible(input), 5000);

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

        await input.sendKeys(member);
        console.log('Keys sent to input');
        await this.submit();
        console.log('Submit clicked');
        console.log('=== findMember END ===');
    }


    async tryToFindMember(member) {
    try {
      const locator = By.xpath(
        `//div[@data-testid="members-search-results-list"]//*[contains(text(), '${member}')]`
      );
      const elements = await this.driver.findElements(locator);

      return elements.length > 0;
    } catch {
      return false;
    }
  }

  async findJob(job) {
    const input = await this.driver.wait(
      until.elementLocated(this.jobSearchInput),
      5000
    );
    await input.sendKeys(job);
    await this.submit();
  }

  async tryToFindJob(job) {
    try {
      const locator = By.xpath(`//*[contains(text(), '${job}')]`);
      const elements = await this.driver.findElements(locator);

      return elements.length > 0;
    } catch {
      return false;
    }
  }

  async findCompany(company) {
    const input = await this.driver.wait(
      until.elementLocated(this.searchInput),
      5000
    );
    await this.driver.wait(until.elementIsVisible(input), 5000);
    await input.sendKeys(company);
    await this.submit();
  }

  async tryToFindCompany(company) {
    try {
      const locator = By.xpath(
        `//div[@data-testid="search-results-test-id"]//*[contains(text(), '${company}')]`
      );
      const elements = await this.driver.findElements(locator);

      return elements.length > 0;
    } catch {
      return false;
    }
  }
}

module.exports = JobsPage;

const { By, until } = require('selenium-webdriver');

class EntrySettingsPage {
  constructor(driver) {
    this.driver = driver;
    this.link = 'https://www.xing.com/profile/my_profile/timeline/add';
    this.profExpirienceLink = By.xpath(
      "//a[@href='/profile/my_profile/timeline/add/employee']"
    );
    this.jobTitleInput = By.xpath("//input[@name='jobTitle']");
    this.employmentDropdown = By.xpath("//select[@name='employment']");
    this.careerLevel = By.xpath("//select[@name='careerLevel']");
    this.discipline = By.xpath("//select[@name='discipline']");
    this.companyName = By.xpath("//input[@name='companyName']");
    this.companyIndustry = By.xpath("//select[@name='companyIndustry']");
    this.companySegment = By.xpath(
      "//select[@data-qa='timeline-edit-industry-second-level']"
    );
    this.startDateMonth = By.xpath(
      "//select[@data-qa='startDate-month-dropdown']"
    );
    this.startDateYear = By.xpath(
      "//select[@data-qa='startDate-year-dropdown']"
    );
    this.submitButton = By.xpath(
      "//button[@data-testid='profile-timeline-entry-form-done']"
    );
  }

  async waitForPageLoad() {
    await this.driver.wait(
      until.elementLocated(this.profExpirienceLink),
      10000
    );
  }

  async openProfExpirience() {
    await this.driver.findElement(this.profExpirienceLink).click();
  }

  async enterJobTitle(jobTitle) {
    const element = await this.driver.wait(
      until.elementLocated(this.jobTitleInput),
      5000
    );
    await element.clear();
    await element.sendKeys(jobTitle);
  }

  async selectEmploymentType(value) {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.employmentDropdown),
      5000
    );
    await this.driver.executeScript("arguments[0].click();", dropdown);
    // await dropdown.click();
    const option = By.xpath(
      `//select[@name='employment']/option[@value='${value}']`
    );
    await this.driver.findElement(option).click();
  }

  async selectCareerLevel(value) {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.careerLevel),
      5000
    );
    await this.driver.executeScript("arguments[0].click();", dropdown);
    // await dropdown.click();
    const option = By.xpath(
      `//select[@name='careerLevel']/option[@value='${value}']`
    );
    await this.driver.findElement(option).click();
  }

  async selectDiscipline(value) {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.discipline),
      5000
    );
    await dropdown.click();
    const option = By.xpath(
      `//select[@name='discipline']/option[@value='${value}']`
    );
    await this.driver.findElement(option).click();
  }

  async enterCompanyName(name) {
    const element = await this.driver.wait(
      until.elementLocated(this.companyName),
      5000
    );
    await element.clear();
    await element.sendKeys(name);
  }

  async selectCompanyIndustry(value) {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.companyIndustry),
      5000
    );
    await this.driver.executeScript("arguments[0].click();", dropdown);
    // await dropdown.click();
    const option = By.xpath(
      `//select[@name='companyIndustry']/option[contains(., '${value}')]`
    );
    await this.driver.findElement(option).click();
  }

  async selectCompanySegment(value) {
    const dropdown = await this.driver.wait(
      until.elementLocated(this.companySegment),
      5000
    );
    await this.driver.executeScript("arguments[0].click();", dropdown);
    // await dropdown.click();
    const option = By.xpath(
      `//select[@data-qa='timeline-edit-industry-second-level']/option[@value='${value}']`
    );
    await this.driver.findElement(option).click();
  }

  async selectStartDate(monthValue, yearValue) {
    const monthDropdown = await this.driver.wait(
      until.elementLocated(this.startDateMonth),
      5000
    );
    await this.driver.executeScript("arguments[0].click();", monthDropdown);
    // await monthDropdown.click();
    const monthOption = By.xpath(
      `//select[@data-qa='startDate-month-dropdown']/option[@value='${monthValue}']`
    );
    await this.driver.findElement(monthOption).click();

    const yearDropdown = await this.driver.wait(
      until.elementLocated(this.startDateYear),
      5000
    );
    await yearDropdown.click();
    const yearOption = By.xpath(
      `//select[@data-qa='startDate-year-dropdown']/option[@value='${yearValue}']`
    );
    await this.driver.findElement(yearOption).click();
  }

  async submitForm() {
    const button = await this.driver.wait(
      until.elementLocated(this.submitButton),
      5000
    );
    await button.click();
  }

  async findWorkplace(companyName) {
    try {
      const locator = By.xpath(`//*[contains(text(), '${companyName}')]`);
      const elements = await this.driver.findElements(locator);
      if (elements.length > 0) {
        return await elements[0].isDisplayed();
      }
      return false;
    } catch {
      return false;
    }
  }
}

module.exports = EntrySettingsPage;

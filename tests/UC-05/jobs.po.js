const {By, until} = require("selenium-webdriver");

class JobsPage {
    constructor(driver) {
        this.driver = driver;
        this.realInput = By.xpath('//textarea[@id="query-input-input"]');
    }

    async findJob(job){
        const input = await this.driver.wait(until.elementLocated(this.realInput),5000);
        await input.sendKeys(job);
    }

    async tryToFindJob(job){
        try {
            const locator = By.xpath(`//*[contains(text(), '${job}')]`);
            const elements = await this.driver.findElements(locator);

            return elements.length > 0;
        } catch (error) {
            return false;
        }
    }
}

module.exports = JobsPage;
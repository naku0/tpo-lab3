const { By, until } = require('selenium-webdriver');

class RegistrationPage {
    constructor(driver) {
        this.driver = driver;
        this.firstNameInput = By.xpath('//input[@data-testid="firstName"]');
        this.lastNameInput = By.xpath('//input[@data-testid="lastName"]');
        this.emailInput = By.xpath('//input[@data-testid="email"]');
        this.passwordInput = By.xpath('//input[@data-testid="password"]');
        this.registerButton = By.xpath(
            '//button[@data-testid="register-submit-button"]'
        );
        this.passwordError = By.xpath('//span[@data-qa="strength-indicator-text"]');
    }

    async getFirstNameElement() {
        return await this.driver.wait(
            until.elementLocated(this.firstNameInput),
            10000
        );
    }

    async getLastNameElement() {
        return await this.driver.wait(
            until.elementLocated(this.lastNameInput),
            10000
        );
    }

    async getEmailElement() {
        return await this.driver.wait(until.elementLocated(this.emailInput), 10000);
    }

    async getPasswordElement() {
        return await this.driver.wait(
            until.elementLocated(this.passwordInput),
            10000
        );
    }

    async getPasswordErrorMessage() {
        const element = await this.driver.wait(
            until.elementLocated(this.passwordError),
            10000
        );
        await this.driver.wait(until.elementIsVisible(element), 5000);
        return await element.getText();
    }

    // НОВЫЕ МЕТОДЫ ДЛЯ ВАЛИДАЦИИ
    async isFirstNameValid() {
        const element = await this.getFirstNameElement();
        return await this.driver.executeScript((el) => el.validity.valid, element);
    }

    async isLastNameValid() {
        const element = await this.getLastNameElement();
        return await this.driver.executeScript((el) => el.validity.valid, element);
    }

    async isEmailValid() {
        const element = await this.getEmailElement();
        return await this.driver.executeScript((el) => el.validity.valid, element);
    }

    async isPasswordValid() {
        const element = await this.getPasswordElement();
        return await this.driver.executeScript((el) => el.validity.valid, element);
    }

    async enterFirstName(firstName) {
        const element = await this.driver.wait(
            until.elementLocated(this.firstNameInput),
            10000
        );
        await element.clear();
        await element.sendKeys(firstName);
    }

    async enterLastName(lastName) {
        const element = await this.driver.wait(
            until.elementLocated(this.lastNameInput),
            10000
        );
        await element.clear();
        await element.sendKeys(lastName);
    }

    async enterEmail(email) {
        const element = await this.driver.wait(
            until.elementLocated(this.emailInput),
            10000
        );
        await element.clear();
        await element.sendKeys(email);
    }

    async enterPassword(password) {
        const element = await this.driver.wait(
            until.elementLocated(this.passwordInput),
            10000
        );
        await element.clear();
        await element.sendKeys(password);
    }

    async clickRegisterButton() {
        const button = await this.driver.wait(until.elementLocated(this.registerButton), 10000);
        await button.click();
    }

    async waitForPageLoad() {
        await this.driver.wait(until.elementLocated(this.firstNameInput), 10000);
    }

    async waitForRegistrationSuccess() {
        try {
            await this.driver.wait(async () => {
                const title = await this.driver.findElements(
                    By.xpath('//h1[contains(text(),"You have mail")]')
                );
                const changeEmail = await this.driver.findElements(
                    By.xpath('//*[@data-testid="changeEmail"]')
                );
                return title.length > 0 && changeEmail.length > 0;
            }, 50000);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

module.exports = RegistrationPage;
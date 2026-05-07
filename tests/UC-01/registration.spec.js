const RegistrationPage = require('./registration.po.js');
const { getNewUser } = require('./UserProvider.js');
const CaptchaSolverInterceptor = require('../../utils/captcha.solver.interceptor.js');
const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');

let registrationPage;
let user;

describe('Registration', () => {
    beforeAll(async () => {
        await global.driver.get('https://www.xing.com/start/signup');
        registrationPage = new RegistrationPage(global.driver);
        user = getNewUser();
        console.log(user);
        await registrationPage.waitForPageLoad();
        await CookieAnnihilator3000Interceptor.annihilate(global.driver);
    });

    it('should not pass firstname validation', async () => {
        await registrationPage.enterFirstName("");
        await registrationPage.clickRegisterButton();
        expect(await registrationPage.isFirstNameValid()).toBe(false);
    });

    it('should not pass lastname validation', async () => {
        await registrationPage.enterLastName("");
        await registrationPage.clickRegisterButton();
        expect(await registrationPage.isLastNameValid()).toBe(false);
    });

    it('should not pass email validation', async () => {
        await registrationPage.enterEmail('invalid');
        await registrationPage.clickRegisterButton();
        expect(await registrationPage.isEmailValid()).toBe(false);
    });

    it('should not pass password validation', async () => {
        await registrationPage.enterPassword('1');
        await registrationPage.clickRegisterButton();
        expect(await registrationPage.isPasswordValid()).toBe(false);
    });

    it('should show password error message when all other fields are correct and password is not', async () => {
        await registrationPage.enterFirstName(user.firstname);
        await registrationPage.enterLastName(user.lastname);
        await registrationPage.enterEmail(user.email);
        await registrationPage.enterPassword('1');
        await registrationPage.clickRegisterButton();

        const errorText = await registrationPage.getPasswordErrorMessage();
        expect(errorText).toBe('Please select a password (min. 8 characters).');
    });

    xit('should register a new user', async () => {
        await registrationPage.enterFirstName(user.firstname);
        await registrationPage.enterLastName(user.lastname);
        await registrationPage.enterEmail(user.email);
        await registrationPage.enterPassword(user.password);
        await registrationPage.clickRegisterButton();
        await CaptchaSolverInterceptor.solve(global.driver);
        await global.driver.switchTo().defaultContent();
        const result = await registrationPage.waitForRegistrationSuccess();
        expect(result).toBeTruthy();
    });
});
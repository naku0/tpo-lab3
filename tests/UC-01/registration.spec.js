const RegistrationPage = require('./registration.po.js');
const { getNewUser } = require('../../utils/user.provider.js');
const CaptchaSolverInterceptor = require('../../utils/captcha.solver.interceptor.js');
const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');

let registrationPage;
let user;
let driver;

describe('UC-01', () => {
  beforeAll(async () => {
    // Arrange (глобальный)
    driver = await createDriver();
    await driver.get('https://www.xing.com/start/signup');
    registrationPage = new RegistrationPage(driver);
    user = getNewUser();
    await registrationPage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it.skip('should not pass firstname validation', async () => {
    // Arrange
    const invalidFirstName = '';

    // Act
    await registrationPage.enterFirstName(invalidFirstName);
    await registrationPage.clickRegisterButton();

    // Assert
    expect(await registrationPage.isFirstNameValid()).toBe(false);
  });

  it.skip('should not pass lastname validation', async () => {
    // Arrange
    const invalidLastName = '';

    // Act
    await registrationPage.enterLastName(invalidLastName);
    await registrationPage.clickRegisterButton();

    // Assert
    expect(await registrationPage.isLastNameValid()).toBe(false);
  });

  it.skip('should not pass email validation', async () => {
    // Arrange
    const invalidEmail = 'invalid';

    // Act
    await registrationPage.enterEmail(invalidEmail);
    await registrationPage.clickRegisterButton();

    // Assert
    expect(await registrationPage.isEmailValid()).toBe(false);
  });

  it.skip('should show password error message when all other fields are correct and password is not', async () => {
    // Arrange
    const invalidPassword = '1';
    const expectedErrorMessage =
      'Please make sure your password contains at least 8 characters.';

    // Act
    await registrationPage.enterFirstName(user.firstname);
    await registrationPage.enterLastName(user.lastname);
    await registrationPage.enterEmail(user.email);
    await registrationPage.enterPassword(invalidPassword);
    await registrationPage.clickRegisterButton();

    // Assert
    const errorText = await registrationPage.getPasswordErrorMessage();
    expect(errorText).toBe(expectedErrorMessage);
  });

  it.skip('should register a new user', async () => {
    // Arrange
    // (данные user уже получены в beforeAll)

    // Act
    await registrationPage.enterFirstName(user.firstname);
    await registrationPage.enterLastName(user.lastname);
    await registrationPage.enterEmail(user.email);
    await registrationPage.enterPassword(user.password);
    await registrationPage.clickRegisterButton();
    await CaptchaSolverInterceptor.solve(driver);
    await driver.switchTo().defaultContent();

    // Assert
    const result = await registrationPage.waitForRegistrationSuccess();
    expect(result).toBeTruthy();
  });
});

const RegistrationPage = require('./registration.po.js');
const { getRegistrationUser } = require('../../utils/user.provider.js');
const CaptchaSolverInterceptor = require('../../utils/captcha.solver.interceptor.js');
const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');

let registrationPage;
let user;
let driver;

function generateRandomEmail(length) {
    return Math.random().toString(36).substring(2, 2 + length) + '@gmail.com';
}

describe('UC-01', () => {
  beforeAll(async () => {
    // Arrange (глобальный)
    driver = await createDriver();
    registrationPage = new RegistrationPage(driver);
    user = getRegistrationUser();
  });

  beforeEach(async () => {
      await driver.get('https://www.xing.com/start/signup');
      await registrationPage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
  })

  afterAll(async () => {
    await driver.quit();
  });

  it('should not pass firstname validation', async () => {
    // Arrange
    const invalidFirstName = '';

    // Act
    await registrationPage.enterFirstName(invalidFirstName);
    await registrationPage.clickRegisterButton();

    // Assert
    expect(await registrationPage.isFirstNameValid()).toBe(false);
  });

  it('should not pass lastname validation', async () => {
    // Arrange
    const invalidLastName = '';

    // Act
    await registrationPage.enterLastName(invalidLastName);
    await registrationPage.clickRegisterButton();

    // Assert
    expect(await registrationPage.isLastNameValid()).toBe(false);
  });

  it('should not pass email validation', async () => {
    // Arrange
    const invalidEmail = 'invalid';

    // Act
    await registrationPage.enterEmail(invalidEmail);
    await registrationPage.clickRegisterButton();

    // Assert
    expect(await registrationPage.isEmailValid()).toBe(false);
  });

  it('should show password error message when all other fields are correct and password is not', async () => {
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

  it('should accept very long password and register user', async () => {
    // Arrange
    const longPassword = 'juyffdgbhjuy6resdfghyu65r4edefghju76yt5r4edfghyujghnbmjkiuhhghhjkuyghjmnkhgfdgjfj12345678888888888#%$Y%Y%T^$#%@$#!';
    // 114 символов
    const randomEmail = generateRandomEmail(7);

    // Act
    await registrationPage.enterFirstName(user.firstname);
    await registrationPage.enterLastName(user.lastname);
    await registrationPage.enterEmail(longPassword);
    await registrationPage.enterPassword(invalidPassword);
    await registrationPage.clickRegisterButton();

    await CaptchaSolverInterceptor.solve(driver);
    await driver.switchTo().defaultContent();

    // Assert
    const result = await registrationPage.waitForRegistrationSuccess();
    expect(result).toBeTruthy();
  });

  it('should register a new user', async () => {
    // Arrange
    // (данные user уже получены в beforeAll)

    const randomEmail = generateRandomEmail(7);

    // Act
    await registrationPage.enterFirstName(user.firstname);
    await registrationPage.enterLastName(user.lastname);
    await registrationPage.enterEmail(randomEmail);
    await registrationPage.enterPassword(user.password);
    await registrationPage.clickRegisterButton();
    await CaptchaSolverInterceptor.solve(driver);
    await driver.switchTo().defaultContent();

    // Assert
    const result = await registrationPage.waitForRegistrationSuccess();
    expect(result).toBeTruthy();
  });
});

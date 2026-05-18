const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const ForgotPasswordPage = require('./forgotPassword.po');
const { getExistingUser, getNewUser } = require('../../utils/user.provider');

let driver;
let forgotPasswordPage;
let existingUser;
let newUser;

describe('UC-03: forgotPassword()', () => {
  beforeAll(async () => {
    // Arrange
    driver = await createDriver();
    existingUser = getExistingUser();
    newUser = getNewUser();
  });

  beforeEach(async () => {
    // Arrange
    await driver.get('https://login.xing.com/recovery');
    forgotPasswordPage = new ForgotPasswordPage(driver);
    await forgotPasswordPage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    // Cleanup
    await driver.quit();
  });

  it.skip('should open code input for existing user', async () => {
    // Act
    await forgotPasswordPage.enterEmail(existingUser.email);
    await forgotPasswordPage.clickRecoveryButton();

    // Assert
    expect(await forgotPasswordPage.isOk()).toBe(true);
  });

  it.skip('should also open code input for not existing user', async () => {
    // Act
    await forgotPasswordPage.enterEmail(newUser.email);
    await forgotPasswordPage.clickRecoveryButton();

    // Assert
    expect(await forgotPasswordPage.isOk()).toBe(true);
  });
});

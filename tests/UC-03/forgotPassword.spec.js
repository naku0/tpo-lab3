const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const ForgotPasswordPage = require('./forgotPassword.po');
const { getExistingUser, getNewUser } = require('../../utils/UserProvider');

let driver;
let forgotPasswordPage;
let existingUser;
let newUser;

describe('UC-03: forgotPassword()', () => {
  beforeAll(async () => {
    driver = await createDriver();
    existingUser = getExistingUser();
    newUser = getNewUser();
  });

  beforeEach(async () => {
    await driver.get('https://login.xing.com/recovery');
    forgotPasswordPage = new ForgotPasswordPage(driver);
    await forgotPasswordPage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should open code input for existing user', async () => {
    await forgotPasswordPage.enterEmail(existingUser.email);
    await forgotPasswordPage.clickRecoveryButton();
    expect(await forgotPasswordPage.isOk()).toBe(true);
  });

  it('should also open code input for not existing user', async () => {
    await forgotPasswordPage.enterEmail(newUser.email);
    await forgotPasswordPage.clickRecoveryButton();
    expect(await forgotPasswordPage.isOk()).toBe(true);
  });
});

const LoginPage = require('./login.po.js');
const { getExistingUser, getNewUser } = require('../../utils/UserProvider.js');
const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');

let loginPage;
let driver;
let existingUser;
let newUser;

describe('UC-02', () => {
  beforeAll(async () => {
    existingUser = getExistingUser();
    newUser = getNewUser();
    driver = await createDriver();
  });

  beforeEach(async () => {
    await driver.get('https://login.xing.com/');
    loginPage = new LoginPage(driver);
    await loginPage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should not successfully login with not existing account', async () => {
    // Arrange

    // Act
    await loginPage.enterEmail(newUser.email);
    await loginPage.enterPassword(newUser.password);
    await loginPage.clickLoginButton();
    // Assert

    expect(await loginPage.isThereVisibleError()).toBe(true);
  });

  it('should not succesfully login with wrong passsword', async () => {
    //Arrange
    const invalidPassword = '12345678';

    //Act
    await loginPage.enterEmail(existingUser.email);
    await loginPage.enterPassword(invalidPassword);
    await loginPage.clickLoginButton();

    //Assert
    expect(await loginPage.isThereVisibleError()).toBe(true);
  });

  it('should show error if email is empty', async () => {
    //Arrange
    const invalidMail = '';

    //Act
    await loginPage.enterEmail(invalidMail);
    await loginPage.enterPassword(existingUser.password);
    await loginPage.clickLoginButton();

    //Assert
    expect(await loginPage.isEmailValid()).toBe(false);
  });

  it('should show error if password is empty', async () => {
    //Arrange
    const invalidPassword = '';

    //Act
    await loginPage.enterEmail(existingUser.password);
    await loginPage.enterPassword(invalidPassword);
    await loginPage.clickLoginButton();

    //Assert
    expect(await loginPage.isPasswordValid()).toBe(false);
  });

  it('should successfully login with valid credentials', async () => {
    // Arrange
    const expectedUrl = 'https://www.xing.com/jobs/find';

    // Act
    await loginPage.enterEmail(existingUser.email);
    await loginPage.enterPassword(existingUser.password);
    await loginPage.clickLoginButton();
    await driver.sleep(3000);

    // Assert
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain(expectedUrl);
  });
});

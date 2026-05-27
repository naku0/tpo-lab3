const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const LoginPage = require('../UC-02/login.po');
const CvPage = require('./cv.po');
const { getExistingUser } = require('../../utils/user.provider');

let driver;
let homePage;
let loginPage;
let cvPage;
let existingUser;

describe('UC-12', () => {
  beforeAll(async () => {
    driver = await createDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    cvPage = new CvPage(driver);
    existingUser = getExistingUser();

    await driver.get('https://login.xing.com/');
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await loginPage.login(existingUser);
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await homePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should open CV create page and start download', async () => {
    const openedStart = await cvPage.openStartPage();
    expect(openedStart).toBe(true);

    const openedCreate = await cvPage.openCreatePage();
    expect(openedCreate).toBe(true);

    await CookieAnnihilator3000Interceptor.annihilate(driver);
    const hasDownload = await cvPage.hasDownloadButton();
    expect(hasDownload).toBe(true);
  });
});

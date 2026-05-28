const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const LoginPage = require('../UC-02/login.po');
const FeedPage = require('./feed.po');
const { getExistingUser } = require('../../utils/user.provider');

let driver;
let homePage;
let loginPage;
let feedPage;
let existingUser;

describe('UC-10', () => {
  beforeAll(async () => {
    driver = await createDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    feedPage = new FeedPage(driver);
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

  it('should show activity feed items', async () => {
    await feedPage.open();
    await CookieAnnihilator3000Interceptor.annihilate(driver);

    const hasItems = await feedPage.hasFeedItems();
    expect(hasItems).toBe(true);
  });
});

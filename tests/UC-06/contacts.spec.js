const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const LoginPage = require('../UC-02/login.po');
const MembersSearchPage = require('./members.po');
const { getExistingUser } = require('../../utils/user.provider');

let driver;
let homePage;
let loginPage;
let membersSearchPage;
let existingUser;

describe('UC-06', () => {
  beforeAll(async () => {
    driver = await createDriver();
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    membersSearchPage = new MembersSearchPage(driver);
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

  it('should show add contact button in search results', async () => {
    const keyword = 'Alex';

    await membersSearchPage.openSearch(keyword);
    await CookieAnnihilator3000Interceptor.annihilate(driver);

    const hasAddButton = await membersSearchPage.hasAddContactButton();
    expect(hasAddButton).toBe(true);
  });
});

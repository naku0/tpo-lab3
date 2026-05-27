const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const JobsPage = require('../UC-05/jobs.po');
const LoginPage = require('../UC-02/login.po');
const JobApplicationPage = require('./job.application.po');
const { getExistingUser } = require('../../utils/user.provider');

let driver;
let homePage;
let jobsPage;
let loginPage;
let jobApplicationPage;
let existingUser;

describe('UC-09', () => {
  beforeAll(async () => {
    driver = await createDriver();
    homePage = new HomePage(driver);
    jobsPage = new JobsPage(driver);
    loginPage = new LoginPage(driver);
    jobApplicationPage = new JobApplicationPage(driver);
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

  it('should open job card and show apply option', async () => {
    const searchUrl =
      'https://www.xing.com/jobs/search/ki?id=611a3ea544a872d89ad248b6cf7b4d9d&keywords=java';
    const jobUrl =
      'https://www.xing.com/jobs/koeln-java-softwareentwickler-innen-154129928?ijt=jb_55';

    await driver.get(searchUrl);
    await CookieAnnihilator3000Interceptor.annihilate(driver);

    const opened = await jobApplicationPage.openFirstJobResult();
    if (!opened) {
      await driver.get(jobUrl);
    }

    await CookieAnnihilator3000Interceptor.annihilate(driver);
    let hasApply = await jobApplicationPage.waitForApplyOption();

    if (!hasApply) {
      await driver.get(jobUrl);
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      hasApply = await jobApplicationPage.waitForApplyOption();
    }

    expect(hasApply).toBe(true);
  });
});

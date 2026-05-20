const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const JobsPage = require('./jobs.po');
const LoginPage = require('../UC-02/login.po');
const { getExistingUser } = require('../../utils/user.provider');

let driver;
let homePage;
let jobsPage;
let loginPage;
let existingUser;

describe('UC-05', () => {
  beforeAll(async () => {
    driver = await createDriver();
    homePage = new HomePage(driver);
    jobsPage = new JobsPage(driver);
    loginPage = new LoginPage(driver);
    existingUser = getExistingUser();
    await driver.get('https://login.xing.com/');
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await loginPage.login(existingUser);
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await homePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  beforeEach(async () => {
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await driver.get('https://www.xing.com/');
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

    //TODO: Fix input search
  it('should find member', async () => {
    //assert
    const member = 'John Brown';

    //act
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await jobsPage.clickMembers();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await jobsPage.findMember(member);

    //assert
    expect(await jobsPage.tryToFindMember('John Brown')).toBe(true);
  });

  xit('should find job', async () => {
    //assert
    const job = 'java';

    //act
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    await jobsPage.clickJobs();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await jobsPage.findJob(job);

    //assert
    expect(await jobsPage.tryToFindJob('java')).toBe(true);
  });


  //TODO: Fix input search
  xit('should find company', async () => {
    //assert
    const company = 'Palantir Technologies';

    //act
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    await jobsPage.clickCompanies();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await jobsPage.findCompany(company);

    //assert
    expect(await jobsPage.tryToFindCompany('Palantir Technologies')).toBe(true);
  });
});

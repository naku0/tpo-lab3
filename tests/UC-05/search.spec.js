const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const JobsPage = require("./jobs.po");

let driver;
let homePage;
let jobsPage;

describe('UC-05', () => {
    beforeAll(async () => {
        driver = await createDriver();
        homePage = new HomePage(driver);
        jobsPage = new JobsPage(driver);
        await driver.get("https://www.xing.com/");
        await CookieAnnihilator3000Interceptor.annihilate(driver);
        await homePage.openJobsPage();
        await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    beforeEach(async () => {
        await CookieAnnihilator3000Interceptor.annihilate(driver);
    })

    afterAll(async () => {
        await driver.quit();
    });

    it('should find job', async () => {
        //assert
        const job = 'java';
        //act
        await jobsPage.findJob(job);
        //assert
        expect(await jobsPage.tryToFindJob('java')).toBe(true);
    });
})
const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const { getExistingUser } = require('../../utils/user.provider');
const LoginPage = require('../UC-02/login.po');
const ProfilePage = require('./po/profile.po');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const ProfileSettingsPage = require('./po/profile.settings.po');
const LocationSettingsPage = require('./po/location.settings.po');
const EntrySettingsPage = require("./po/entry.settings.po");

let loginPage;
let profilePage;
let profilePersonalPage;
let homePage;
let locationSettingsPage;
let entrySettingsPage;
let driver;
let existingUser;

describe('UC-04', () => {
  beforeAll(async () => {
    driver = await createDriver();
    existingUser = getExistingUser();

    loginPage = new LoginPage(driver);
    profilePage = new ProfilePage(driver);
    profilePersonalPage = new ProfileSettingsPage(driver);
    homePage = new HomePage(driver);
    locationSettingsPage = new LocationSettingsPage(driver);
    entrySettingsPage = new EntrySettingsPage(driver);

    await driver.get('https://login.xing.com');
    await loginPage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);

    await loginPage.login(existingUser);
    await homePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  beforeEach(async () => {
    await driver.get('https://www.xing.com/jobs/find');
    await homePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await homePage.openProfile();
    await profilePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  describe('UC-04.1: Edit personal info', () => {
    beforeEach(async () => {
      await profilePage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.pushEditButton();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.openSettings();
      await profilePersonalPage.waitForPersonalPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    it.skip('should enable save button after changing name', async () => {
      // Arrange
      const isDisabledInitially =
        await profilePersonalPage.isSaveButtonDisabled();

      // Act
      await profilePersonalPage.enterName('New Test Name');

      // Assert
      const isEnabled = await profilePersonalPage.isSaveButtonEnabled();

      expect(isDisabledInitially).toBe(true);
      expect(isEnabled).toBe(true);
    });

    it.skip('should enable save button after changing last name', async () => {
      // Arrange
      const isDisabledInitially =
        await profilePersonalPage.isSaveButtonDisabled();

      // Act
      await profilePersonalPage.enterLastName('Test Lastname');

      // Assert
      expect(isDisabledInitially).toBe(true);
      expect(await profilePersonalPage.isSaveButtonEnabled()).toBe(true);
    });

    it.skip('should enable save button after changing title', async () => {
      // Arrange
      const isDisabledInitially =
        await profilePersonalPage.isSaveButtonDisabled();

      // Act
      await profilePersonalPage.selectTitle('Dr.');

      // Assert
      expect(isDisabledInitially).toBe(true);
      expect(await profilePersonalPage.isSaveButtonEnabled()).toBe(true);
    });

    it.skip('should disable save button when reverting changes', async () => {
      // Arrange
      const newName = 'Temporary Name';
      await profilePersonalPage.enterName(newName);

      // Act
      const isDisabledAfterRevert =
        await profilePersonalPage.isSaveButtonDisabled();

      //Assert
      expect(isDisabledAfterRevert).toBe(true);
    });
  });

  describe('UC-04.2 Edit Business info', () => {});

  describe('UC-04.3 Edit location info', () => {
    beforeEach(async () => {
      await profilePage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.pushEditButton();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.openLocation();
      await locationSettingsPage.waitForPersonalPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    xit('should change city', async () => {
        // Arrange
      let newCity = 'Saint Petersburg';

      // act
      await locationSettingsPage.enterCity(newCity);
      await locationSettingsPage.pushSaveButton();
      await profilePage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      let updatedCity = await profilePage.getCity();

      // Assert
      expect(updatedCity).toBe(newCity);
    });
  });

  describe('UC-04.4', () => {
      beforeEach(async () => {
          await profilePage.waitForPageLoad();
          await CookieAnnihilator3000Interceptor.annihilate(driver);
          await profilePage.pushEditButton();
          await CookieAnnihilator3000Interceptor.annihilate(driver);
          await profilePage.openProfExpirience();
          await entrySettingsPage.waitForPageLoad();
          await CookieAnnihilator3000Interceptor.annihilate(driver);
      });

      xit('should add new job', async () => {
          //Arrange
          const job = {
              jobTitle: 'Javascript Developer',
              employmentType: '1',
              careerLevel: '1',
              discipline: '1011',
              companyName: 'T-Bank',
              companyIndustry: '120000.092d86',
              companySegment: '120200.f7f203',
              startDateMonth: '4',
              startDateYear: '2026'
          }

          //Act
          await entrySettingsPage.enterJobTitle(job.jobTitle);
          await entrySettingsPage.selectEmploymentType(job.employmentType);
          await entrySettingsPage.selectCareerLevel(job.careerLevel);
          await entrySettingsPage.selectDiscipline(job.discipline);
          await entrySettingsPage.enterCompanyName(job.companyName);
          await entrySettingsPage.selectCompanyIndustry(job.companyIndustry);
          await entrySettingsPage.selectCompanySegment(job.companySegment);
          await entrySettingsPage.selectStartDate(job.startDateMonth, job.startDateYear);
          await entrySettingsPage.submitForm();
          await profilePage.waitForPageLoad();
          await CookieAnnihilator3000Interceptor.annihilate(driver);
          const isWorkplaceDisplayed = await entrySettingsPage.findWorkplace(job.companyName);

          //Assert
          expect(isWorkplaceDisplayed).toBe(true);
      });
  });

  describe('UC-04.5', () => {});
});

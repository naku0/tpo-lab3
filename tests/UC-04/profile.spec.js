const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const { getExistingUser } = require('../../utils/user.provider');
const LoginPage = require('../UC-02/login.po');
const ProfilePage = require('./po/profile.po');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const ProfileSettingsPage = require('./po/profile.settings.po');
const LocationSettingsPage = require('./po/location.settings.po');
const EntrySettingsPage = require('./po/entry.settings.po');

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
    await driver.get('https://www.xing.com/');
    await homePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  describe('UC-04.1: Edit personal info', () => {
    beforeEach(async () => {
      await driver.get('https://www.xing.com/settings/account/misc/name');
      await profilePersonalPage.waitForPersonalPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    it('should show personal info fields', async () => {
      const nameInput = await profilePersonalPage.getNameInputElement();
      const lastNameInput = await profilePersonalPage.getLastNameInputElement();
      const titleSelect = await profilePersonalPage.getTitleDropdownElement();
      const saveButton = await profilePersonalPage.getSaveButtonElement();

      expect(await nameInput.isDisplayed()).toBe(true);
      expect(await lastNameInput.isDisplayed()).toBe(true);
      expect(await titleSelect.isDisplayed()).toBe(true);
      expect(await saveButton.isDisplayed()).toBe(true);
    });
  });

  describe('UC-04.2 Edit Business info', () => {});

  describe('UC-04.3 Edit location info', () => {
    beforeEach(async () => {
      await profilePage.openLocation();
      await locationSettingsPage.waitForPersonalPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    it('should show location fields', async () => {
      const cityInput = await locationSettingsPage.getCityInput();
      const saveButton = await locationSettingsPage.getSaveButton();

      expect(await cityInput.isDisplayed()).toBe(true);
      expect(await saveButton.isDisplayed()).toBe(true);
    });
  });

  describe.skip('UC-04.4', () => {
    beforeEach(async () => {
      await entrySettingsPage.openProfExpirience();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    it('should add new job', async () => {
      //Arrange
      const job = {
        jobTitle: 'Java Developer',
        employmentType: '1',
        careerLevel: '1',
        discipline: '1011',
        companyName: 'Palantir Technologies',
        startDateMonth: '8',
        startDateYear: '2026',
      };

      //Act
      await entrySettingsPage.enterJobTitle(job.jobTitle);
      await entrySettingsPage.selectEmploymentType(job.employmentType);
      await entrySettingsPage.selectCareerLevel(job.careerLevel);
      await entrySettingsPage.selectDiscipline(job.discipline);
      await entrySettingsPage.enterCompanyName(job.companyName);
      await entrySettingsPage.selectStartDate(
        job.startDateMonth,
        job.startDateYear
      );
      await entrySettingsPage.submitForm();
      await profilePage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      const isWorkplaceDisplayed = await entrySettingsPage.findWorkplace(
        job.companyName
      );

      //Assert
      expect(isWorkplaceDisplayed).toBe(true);
    });
  });

  describe('UC-04.5', () => {});
});

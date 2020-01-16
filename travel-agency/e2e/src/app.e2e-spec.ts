import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('DreamTrip Travel Agency');
  });

  it('should display login and sign up buttons', () => {
    page.navigateTo();
    expect(page.getLoginButton()).toBeTruthy();
    expect(page.getSignupButton()).toBeTruthy();
    expect(page.getAdminButton().isPresent()).toBeFalsy();
    expect(page.getBasketButton().isPresent()).toBeFalsy();
    expect(page.getHistoryButton().isPresent()).toBeFalsy();
    expect(page.getTripsButton().isPresent()).toBeFalsy();
  });

  it('should login user with client role and display client menu', () => {
    page.navigateTo();
    expect(page.getEmailInput()).toBeTruthy();
    expect(page.getPasswordInput()).toBeTruthy();
    expect(page.getSubmitButton()).toBeTruthy();

    page.getEmailInput().sendKeys('tester1@gmail.com');
    page.getPasswordInput().sendKeys('tester1');

    page.getSubmitButton().click();

    const EC = browser.ExpectedConditions;

    browser.wait(EC.urlIs(browser.baseUrl + 'trips'), 7000, 'Wait for login authenticaiton');

    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'trips');
    expect(page.getLoginButton().isPresent()).toBeFalsy();
    expect(page.getSignupButton().isPresent()).toBeFalsy();
    expect(page.getAdminButton().isPresent()).toBeFalsy();
    expect(page.getBasketButton()).toBeTruthy();
    expect(page.getHistoryButton()).toBeTruthy();
    expect(page.getTripsButton()).toBeTruthy();
    expect(page.getLogouteButton()).toBeTruthy();

  });



  it('should login user with admin role and display admin menu', () => {
    page.navigateTo();
    expect(page.getEmailInput()).toBeTruthy();
    expect(page.getPasswordInput()).toBeTruthy();
    expect(page.getSubmitButton()).toBeTruthy();

    page.getEmailInput().sendKeys('admin@admin.com');
    page.getPasswordInput().sendKeys('adminadmin');

    page.getSubmitButton().click();

    const EC = browser.ExpectedConditions;

    browser.wait(EC.urlIs(browser.baseUrl + 'trips'), 9000, 'Wait for login authenticaiton');

    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'trips');
    expect(page.getLoginButton().isPresent()).toBeFalsy();
    expect(page.getSignupButton().isPresent()).toBeFalsy();
    expect(page.getAdminButton()).toBeTruthy();
    expect(page.getBasketButton()).toBeTruthy();
    expect(page.getHistoryButton()).toBeTruthy();
    expect(page.getTripsButton()).toBeTruthy();
    expect(page.getLogouteButton()).toBeTruthy();

  });


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    }));
  });
});

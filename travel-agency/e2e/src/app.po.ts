import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('h1')).getText() as Promise<string>;
  }


  // NAVBAR elements ---------------------------------------------------------------- //
  getLoginButton(): ElementFinder {
    return element(by.css('[routerlink="/login"]'));
  }

  getSignupButton(): ElementFinder {
    return element(by.css('[routerlink="/signup"]'));
  }

  getTripsButton(): ElementFinder {
    return element(by.css('[routerlink="/trips"]'));
  }

  getBasketButton(): ElementFinder {
    return element(by.css('[routerlink="/basket"]'));
  }

  getHistoryButton(): ElementFinder {
    return element(by.css('[routerlink="/history"]'));
  }

  getAdminButton(): ElementFinder {
    return element(by.css('[routerlink="/admin"]'));
  }

  // Login form elements --------------------------------------------------------------- //
  getEmailInput(): ElementFinder {
    return element(by.id('email'));
  }

  getPasswordInput(): ElementFinder {
    return element(by.id('password'));
  }

  getSubmitButton(): ElementFinder {
    return element(by.buttonText('Login'));
  }

  getLogouteButton(): ElementFinder {
    return element(by.css('.fa-sign-out'));
  }


  // Trips presentation elements ------------------------------------------------------- /

  getFilteringCriteriaDiv(): ElementFinder {
    return element(by.id('filterCriteria'));
  }

  getShowFilteringCriteriaButton(): ElementFinder {
    return element(by.id('bar-button-filter'));
  }



  // Trip card elements --------------------------------------------------------------- /

getAllAddButtons(): ElementArrayFinder {
  return element.all(by.id('addToBasketButton'));
}


getAllRemoveButtons(): ElementArrayFinder {
  return element.all(by.id('removeFromBasketButton'));
}


getAllCards(): ElementArrayFinder {
  return element.all(by.css('.card'));
}


}

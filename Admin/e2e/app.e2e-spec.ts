import { ESIRMonitoringPage } from './app.po';

describe('esir-monitoring App', () => {
  let page: ESIRMonitoringPage;

  beforeEach(() => {
    page = new ESIRMonitoringPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

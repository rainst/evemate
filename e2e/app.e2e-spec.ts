import { EvePage } from './app.po';

describe('eve App', () => {
  let page: EvePage;

  beforeEach(() => {
    page = new EvePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

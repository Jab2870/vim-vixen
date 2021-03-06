import { WebDriver, By, Key } from 'selenium-webdriver';

export type CompletionItem = {
  type: string;
  text: string;
  highlight: boolean;
}

export class Console {
  constructor(private webdriver: WebDriver) {
  }

  async sendKeys(...keys: string[]) {
    let input = await this.webdriver.findElement(By.css('input'));
    input.sendKeys(...keys);
  }

  async currentValue() {
    return await this.webdriver.executeScript(() => {
      let input = document.querySelector('input');
      if (input === null) {
        throw new Error('could not find input element');
      }
      return input.value;
    });
  }

  async execCommand(command: string): Promise<void> {
    let input = await this.webdriver.findElement(By.css('input.vimvixen-console-command-input'));
    await input.sendKeys(command, Key.ENTER);
  }

  async getErrorMessage(): Promise<string> {
    let p = await this.webdriver.findElement(By.css('.vimvixen-console-error'));
    return p.getText();
  }

  async inputKeys(...keys: string[]) {
    let input = await this.webdriver.findElement(By.css('input'));
    await input.sendKeys(...keys);
  }

  getCompletions(): Promise<CompletionItem[]> {
    return this.webdriver.executeScript(() => {
      let items = document.querySelectorAll('.vimvixen-console-completion > li');
      if (items.length === 0) {
        throw new Error('completion items not found');
      }

      let objs = [];
      for (let li of Array.from(items)) {
        if (li.classList.contains('vimvixen-console-completion-title')) {
          objs.push({ type: 'title', text: li.textContent!!.trim() });
        } else if ('vimvixen-console-completion-item') {
          let highlight = li.classList.contains('vimvixen-completion-selected');
          objs.push({ type: 'item', text: li.textContent!!.trim(), highlight });
        } else {
          throw new Error(`unexpected class: ${li.className}`);
        }
      }
      return objs;
    });
  }

  async close(): Promise<void> {
    let input = await this.webdriver.findElement(By.css('input'));
    await input.sendKeys(Key.ESCAPE);
    // TODO remove sleep
    await new Promise(resolve => setTimeout(resolve, 100));
    await (this.webdriver.switchTo() as any).parentFrame();
  }
}

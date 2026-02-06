import { ModelAdapter } from './index'

export class DeepSeekAdapter implements ModelAdapter {
  name = 'DeepSeek'
  url = 'https://chat.deepseek.com'

  css = `
    /* Force responsive layout */
    body, #root, #__next { 
      min-width: 0 !important; 
      width: 100% !important; 
      overflow-x: auto !important;
    }
    /* Hide some unnecessary sidebar elements if possible */
  `

  getFillInputCode(text: string): string {
    const safeText = JSON.stringify(text);
    return `
      (function() {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          // React 16+ hack to trigger onChange
          const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          nativeTextareaValueSetter.call(textarea, ${safeText});
          
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
        return false;
      })();
    `
  }

  getSendCode(): string {
    return `
      (function() {
        // Helper to get React Props
        function getReactProps(element) {
          const keys = Object.keys(element);
          const propKey = keys.find(key => key.startsWith('__reactProps'));
          return propKey ? element[propKey] : null;
        }

        // Helper to simulate full click sequence
        function simulateClick(element) {
            const options = { bubbles: true, cancelable: true, view: window };
            element.dispatchEvent(new MouseEvent('mousedown', options));
            element.dispatchEvent(new MouseEvent('mouseup', options));
            element.dispatchEvent(new MouseEvent('click', options));
        }

        // Find the button using our robust selector strategies
        let sendBtn = null;

        // Strategy 1: SVG Path
        const svgs = Array.from(document.querySelectorAll('svg'));
        const sendIconSvg = svgs.find(svg => {
            const path = svg.querySelector('path');
            return path && path.getAttribute('d') && path.getAttribute('d').startsWith('M8.3125 0.981587');
        });
        if (sendIconSvg) {
            sendBtn = sendIconSvg.closest('div[role="button"]');
        }

        // Strategy 2: Class Name
        if (!sendBtn) {
            sendBtn = document.querySelector('div.ds-icon-button--sizing-container[role="button"]');
        }

        // Strategy 3: Fallback
        if (!sendBtn) {
             const buttons = Array.from(document.querySelectorAll('div[role="button"][class*="ds-icon-button"]'));
             sendBtn = buttons.find(btn => btn.getAttribute('aria-disabled') !== 'true');
        }

        if (sendBtn) {
            // Attempt 1: React Props Injection (The Nuclear Option)
            const props = getReactProps(sendBtn);
            if (props && typeof props.onClick === 'function') {
                props.onClick({
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    nativeEvent: new MouseEvent('click', { bubbles: true }),
                    target: sendBtn,
                    currentTarget: sendBtn
                });
                return true;
            }

            // Attempt 2: Deep Click (Click all layers)
            // Sometimes the listener is on the SVG or an inner div
            const clickTargets = [
                sendBtn,
                sendBtn.querySelector('.ds-icon'),
                sendBtn.querySelector('svg'),
                sendBtn.querySelector('.ds-icon-button__hover-bg')
            ];

            clickTargets.forEach(target => {
                if (target) simulateClick(target);
            });
            
            return true;
        }

        return false;
      })();
    `
  }

  getResetCode(): string {
    return `
      (function() {
        // Helper to simulate full click sequence
        function simulateClick(element) {
            const options = { bubbles: true, cancelable: true, view: window };
            element.dispatchEvent(new MouseEvent('mousedown', options));
            element.dispatchEvent(new MouseEvent('mouseup', options));
            element.dispatchEvent(new MouseEvent('click', options));
        }

        // Strategy 1: Find by text "开启新对话" inside a button-like element
        const spans = Array.from(document.querySelectorAll('span'));
        const newChatSpan = spans.find(s => s.textContent && s.textContent.trim() === '开启新对话');
        if (newChatSpan) {
            const btn = newChatSpan.closest('div[role="button"]') || newChatSpan.closest('div[tabindex="0"]');
            if (btn) {
                simulateClick(btn);
                return true;
            }
        }

        // Strategy 2: Find by specific class for icon-only button
        const iconBtn = document.querySelector('div.ds-icon-button.ds-icon-button--sizing-container');
        if (iconBtn) {
            simulateClick(iconBtn);
            return true;
        }
        
        // Strategy 3: Find by SVG path
        const svgs = Array.from(document.querySelectorAll('svg'));
        const newChatSvg = svgs.find(svg => {
            const path = svg.querySelector('path');
            return path && path.getAttribute('d') && path.getAttribute('d').startsWith('M8 0.599609');
        });
        
        if (newChatSvg) {
            const btn = newChatSvg.closest('div[role="button"]') || newChatSvg.closest('div[tabindex="0"]');
            if (btn) {
                 simulateClick(btn);
                 return true;
            }
        }

        return false;
      })();
    `
  }
}

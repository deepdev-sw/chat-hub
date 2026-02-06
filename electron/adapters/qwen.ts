import { ModelAdapter } from './index'

export class QwenAdapter implements ModelAdapter {
  name = 'Qwen'
  url = 'https://tongyi.aliyun.com/qianwen/'

  css = `
    /* Fix Qwen layout for small screens */
    html, body, #root, #app { 
      min-width: 0 !important; 
      width: 100% !important;
      overflow-x: auto !important;
    }
    /* Specifically target Qwen's container classes if known */
    div[class*="layout"] {
      min-width: 0 !important;
    }
  `

  getFillInputCode(text: string): string {
    const safeText = JSON.stringify(text);
    return `
      (function() {
        // Try to find the input element
        const input = document.querySelector('div[contenteditable="true"]') || document.querySelector('textarea');
        if (!input) return false;

        input.focus();

        // Strategy A: Direct React Props Injection (The "Nuclear Option")
        // Try to find the internal React Props attached to the DOM node
        function getReactProps(element) {
          const keys = Object.keys(element);
          const propKey = keys.find(key => key.startsWith('__reactProps'));
          return propKey ? element[propKey] : null;
        }

        const props = getReactProps(input);
        
        // If we found props, try to call onChange or onInput directly
        if (props) {
            // Slate often uses onBeforeInput or onInput
            // We construct a fake synthetic event
            const syntheticEvent = {
                nativeEvent: new InputEvent('input', { bubbles: true, inputType: 'insertText', data: ${safeText} }),
                target: input,
                currentTarget: input,
                preventDefault: () => {},
                stopPropagation: () => {},
                type: 'input',
                bubbles: true
            };
            
            if (typeof props.onInput === 'function') {
                props.onInput(syntheticEvent);
            }
            if (typeof props.onChange === 'function') {
                // Slate's onChange usually expects the Editor state, not an event, so this might be tricky.
                // But for standard inputs, this works.
                // For Slate specifically, it relies heavily on DOM events being handled by its internal listeners.
            }
        }

        // Strategy B: Clipboard Paste Simulation (High success rate for Slate)
        // Slate handles paste events robustly to insert content
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', ${safeText});
        const pasteEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dataTransfer
        });
        input.dispatchEvent(pasteEvent);

        // Strategy C: Fallback to execCommand + Space Append (If paste didn't work)
        // Check if content was actually inserted (simple check)
        setTimeout(() => {
            const currentText = input.innerText || '';
            // If empty or just placeholder, try brute force
            if (!currentText.trim() || currentText === '向千问提问') {
                 document.execCommand('insertText', false, ${safeText});
                 document.execCommand('insertText', false, ' '); // Append space to trigger update
            }
            
            // Visual fix for placeholder
            const placeholder = document.querySelector('[data-slate-placeholder="true"]');
            if (placeholder) {
              placeholder.style.visibility = 'hidden';
            }
            
            // Dispatch standard events as final backup
            input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: ' ' }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }, 10);

        return true;
      })();
    `
  }

  getSendCode(): string {
    return `
      (function() {
        // Strategy 1: Find by specific icon (Legacy)
        const uses = Array.from(document.querySelectorAll('use'));
        const sendIcon = uses.find(u => u.getAttribute('xlink:href') === '#qwpcicon-sendChat');
        if (sendIcon) {
          const target = sendIcon.closest('div[class*="operateBtn"]') || sendIcon.closest('button') || sendIcon.closest('div[role="button"]');
          if (target) {
            target.click();
            return true;
          }
        }

        // Strategy 2: Find by text content "发送" or "Send"
        const candidates = Array.from(document.querySelectorAll('button, div[role="button"]'));
        const sendBtn = candidates.find(btn => {
           const text = btn.innerText || '';
           return text.trim() === '发送' || text.trim() === 'Send';
        });
        
        if (sendBtn) {
            sendBtn.click();
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

        // Strategy 1: Find by icon type (Most robust)
        // Covers qwpcicon-newDialogueMedium and qwpcicon-newDialogue
        const iconSpans = Array.from(document.querySelectorAll('span[data-role="icon"]'));
        const newChatIcon = iconSpans.find(span => {
            const type = span.getAttribute('data-icon-type');
            return type === 'qwpcicon-newDialogueMedium' || type === 'qwpcicon-newDialogue';
        });

        if (newChatIcon) {
            const btn = newChatIcon.closest('button');
            if (btn) {
                simulateClick(btn);
                return true;
            }
        }
        
        // Strategy 2: Find by text content "新对话"
        const spans = Array.from(document.querySelectorAll('span'));
        const textSpan = spans.find(s => s.textContent && s.textContent.trim() === '新对话');
        if (textSpan) {
             const btn = textSpan.closest('button');
             if (btn) {
                 simulateClick(btn);
                 return true;
             }
        }

        // Strategy 3: Find by specific class partial match
        const classBtn = document.querySelector('button[class*="newChatButton"]');
        if (classBtn) {
            simulateClick(classBtn);
            return true;
        }

        return false;
      })();
    `
  }
}

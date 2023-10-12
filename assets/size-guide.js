if (!customElements.get('size-guide')) {
  customElements.define(
    'size-guide',
    class SizeGuide extends HTMLElement {
      constructor() {
        super();

        const button = this.querySelector('button');

        if (button) {
          button.addEventListener('click', (event) => {
            console.log('handle button click');
            document.querySelector('size-guide-drawer').show(event.target);
          });
        }

        document.body.appendChild(document.querySelector('size-guide-drawer'));
      }
    }
  );
}

if (!customElements.get('size-guide-drawer')) {
  customElements.define(
    'size-guide-drawer',
    class SizeGuideDrawer extends HTMLElement {
      constructor() {
        super();

        console.log('construct size-guide-drawer');

        this.onBodyClick = this.handleBodyClick.bind(this);

        this.querySelector(
          'button',
          this.addEventListener('click', () => {
            console.log('handle body click');
            this.hide();
          })
        );

        this.addEventListener('keyup', (event) => {
          if (event.code.toUpperCase() === 'ESCAPE') this.hide();
        });
      }

      handleBodyClick(event) {
        const target = event.target;

        if (target !== this && !target.closest('size-guide-drawer') && target.id !== 'ShowSizeGuideDrawer') {
          this.hide();
        }
      }

      hide() {
        this.removeAttribute('open');
        document.body.removeEventListener('click', this.onBodyClick);
        document.body.classList.remove('overflow-hidden');
        removeTrapFocus(this.focusElement);
      }

      show(focusElement) {
        this.focusElement = focusElement;
        this.setAttribute('open', '');
        document.body.addEventListener('click', this.onBodyClick);
        document.body.classList.add('overflow-hidden');
        trapFocus(this);
      }
    }
  );
}

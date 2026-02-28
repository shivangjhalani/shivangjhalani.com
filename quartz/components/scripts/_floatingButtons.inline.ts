// original source: 2/2/25
// https://github.com/CatCodeMe/catcodeme.github.io/blob/770f3f8d1f6849ef40bc06b4300a52b3aecfb551/quartz/components/scripts/floatingButtons.inline.ts
import { navigateToRandomPage } from "./_randomPage.inline";

function handleButtonClick(e: Event) {
  const button = (e.target as Element).closest('.floating-button')
  if (!button) return

  e.preventDefault()

  const action = button.getAttribute('data-action')
  if (!action) return

  const footer = document.querySelector('footer') || document.querySelector('.footer')

  switch (action) {
    case 'scrollTop':
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
      break

    case 'scrollBottom':
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        })
      }
      break

    case 'randomPgFloating':
      navigateToRandomPage()
      break
  }
}

function setupFloatingButtons() {
  const floatingButtons = document.querySelectorAll<HTMLElement>('.floating-buttons')
  floatingButtons.forEach(container => {
    container.addEventListener('click', handleButtonClick)
  })

  window.addCleanup(() => {
    floatingButtons.forEach(container => {
      container.removeEventListener('click', handleButtonClick)
    })
  })
}

document.addEventListener('nav', () => {
  setupFloatingButtons()
})

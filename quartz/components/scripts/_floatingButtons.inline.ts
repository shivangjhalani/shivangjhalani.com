// original source: 2/2/25
// https://github.com/CatCodeMe/catcodeme.github.io/blob/770f3f8d1f6849ef40bc06b4300a52b3aecfb551/quartz/components/scripts/floatingButtons.inline.ts
import { navigateToRandomPage } from "./_randomPage.inline";

// 全局变量跟踪状态
// let activeModal: HTMLElement | null = null
let currentCleanup: (() => void) | null = null

function setupFloatingButtons() {
  // 清理之前的设置
  if (currentCleanup) {
    currentCleanup()
    currentCleanup = null
  }

  // Select the floating buttons container instead of just the button groups
  const floatingButtons = document.querySelectorAll<HTMLElement>('.floating-buttons')

  // 处理图谱显示
  function toggleGraph() {
    const graphComponent = document.querySelector('.graph') as HTMLElement
    if (!graphComponent) {
      console.warn('Graph component not found')
      return
    }

    const isVisible = graphComponent.classList.contains('active')
    if (!isVisible) {
      // 显示图谱
      graphComponent.classList.add('active')
      // 触发图谱渲染
      const globalGraphIcon = document.getElementById('global-graph-icon')
      if (globalGraphIcon) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        })
        globalGraphIcon.dispatchEvent(clickEvent)
      } else {
        console.warn('Global graph icon not found')
      }

      // 注册 ESC 关闭事件
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          graphComponent.classList.remove('active')
          document.removeEventListener('keydown', handleEsc)
        }
      }
      document.addEventListener('keydown', handleEsc)
    } else {
      // 隐藏图谱
      graphComponent.classList.remove('active')
    }
  }

  // Improved handler for button clicks with better event delegation
  function handleButtonClick(e: Event) {
    // Find the button that was clicked, even if a child element was the target
    const button = (e.target as Element).closest('.floating-button')
    if (!button) return

    // Prevent default to ensure no unwanted behavior
    e.preventDefault()
    
    const action = button.getAttribute('data-action')
    if (!action) {
      console.warn('Button clicked but no action attribute found', button)
      return
    }
    
    console.log(`Action triggered: ${action}`)
    
    const center = document.querySelector('.center')
    const footer = document.querySelector('footer') || document.querySelector('.footer')

    switch (action) {
      case 'scrollTop':
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        break
        
      case 'scrollBottom':
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' })
        } else {
          // Fallback if footer not found - scroll to bottom of page
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          })
        }
        break
        
      case 'graph':
        toggleGraph()
        break
        
      case 'randomPgFloating':
        navigateToRandomPage()
        break
        
      default:
        console.warn(`Unknown action: ${action}`)
    }
  }

  // Attach event listeners directly to floating buttons for better event capture
  floatingButtons.forEach(container => {
    // Remove any existing listeners first
    container.removeEventListener('click', handleButtonClick)
    // Add the new listener
    container.addEventListener('click', handleButtonClick)
  })

  // Also attach to button groups for backward compatibility
  const buttonGroups = document.querySelectorAll<HTMLElement>('.button-group')
  buttonGroups.forEach(group => {
    group.removeEventListener('click', handleButtonClick)
    group.addEventListener('click', handleButtonClick)
  })

  // Directly attach to individual buttons as a fallback
  const buttons = document.querySelectorAll<HTMLElement>('.floating-button')
  buttons.forEach(button => {
    button.removeEventListener('click', handleButtonClick)
    button.addEventListener('click', handleButtonClick)
  })

  // Save cleanup function
  currentCleanup = () => {
    floatingButtons.forEach(container => {
      container.removeEventListener('click', handleButtonClick)
    })
    
    buttonGroups.forEach(group => {
      group.removeEventListener('click', handleButtonClick)
    })
    
    buttons.forEach(button => {
      button.removeEventListener('click', handleButtonClick)
    })
  }
}

// Initialize on both DOMContentLoaded and nav events
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded - initializing floating buttons')
  setupFloatingButtons()
})

document.addEventListener('nav', () => {
  console.log('Navigation occurred - reinitializing floating buttons')
  setupFloatingButtons()
})

// Make sure to run setup immediately if the DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  console.log('Document already loaded - initializing floating buttons immediately')
  setupFloatingButtons()
}

// Adding in the "prevent default" behavior here but this is actually for broken links
document.querySelectorAll('.broken-link').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Prevents the link from navigating
  });
});
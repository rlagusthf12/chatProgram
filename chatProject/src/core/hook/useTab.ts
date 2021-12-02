import { ref, Ref } from 'vue'
export function useTab(defaultTabId: string): {
  selected: Ref<string>
  select: (tabId: string, e?: Event) => void
  active: (tabId: string) => string
} {

  const selected = ref(defaultTabId)

  const select = (tabId: string, e?: Event) => {
    selected.value = tabId
    const li = e?.target as HTMLLIElement
    if (li) {
      Array.from(li.parentElement?.children!).forEach(child => child.classList.remove('active'))
      li.classList.add('active')
    }
  }

  const active = (tabId: string) => selected.value === tabId ? 'active' : ''

  return {
    selected,
    select,
    active
  }

}
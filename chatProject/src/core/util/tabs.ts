import { ref } from 'vue'

export default function tabs(defaltTabId: string,) {

  const selectedTab = ref(defaltTabId)
  
  const activeTab = (tabId: string) => selectedTab.value === tabId

  return {
    selectedTab,
    activeTab
  }
  
}
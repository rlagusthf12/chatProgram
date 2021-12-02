import menuTreeJson from '@/assets/menu-tree.json'
import { useAuth, http, MenuTp, storage, triggerResize, vmutil } from '@/core'
import { watch, ref, toRaw, AppContext } from 'vue'

const homeMenu: Menu = {
  lv: 0,
  menuId: 'home',
  menuNm: 'Home',
  menuTp: MenuTp.PROGRAM,
  componentName: 'Home',
  componentExists: true,
  hidden: true
}

/** 전체 메뉴데이터 */
const menuList = ref<Menu[]>([])

/** 전체 열린 프로그램의 탭 */
const openedMenuList = ref<Menu[]>([])

/** 현재 선택된 프로그램의 메뉴 */
// const openedMenu = ref<Menu>({ menuId: 'home' })
const openedMenu = ref<Menu>(homeMenu)


/**
 * 현재탭 감시.
 * 1. localhost에 탭정보 저장.
 * 2. resize이벤트 발생(사이즈 조절 및 그리드 refresh)
 * 3. vm의 탭 활성/비활성 함수 호출
 * 4. chrome devtool용 window.vm 할당.
 */
watch(openedMenu, (n, o) => {
  storeOpenedMenu()
  setTimeout(triggerResize, 100)
  // setTimeout(() => {
  //   if (o && o.vm && o.vm.deactivated) {
  //     o.vm.deactivated(o)
  //   }
  //   if (n && n.vm && n.vm.activated) {
  //     n.vm.activated(n, o)
  //   }
  //   if ((process.env.NODE_ENV !== 'production')) {
  //     if (n && n.vm) {
  //       window.vm = toRaw(n.vm)
  //       console.warn('%cvm changed', 'color:blue', window.vm.componentName, window.vm, isReactive(window.vm))
  //     }
  //   }
  // }, 100)
})

/**
 * 메뉴 데이터 로딩
 * 홈 + 서버메뉴 + 샘플메뉴
 */
async function loadMenu(app: AppContext) {
  const { corpCd, userId } = useAuth().user.value ?? {}
  if (!corpCd || !userId) throw '로그인이 필요합니다.'

  const response = await http.post('/menu/query', { corpCd, userId })
  const serverMenu = response.data as Menu[]
  const sampleMenu = menuTreeJson as unknown as Menu[]

  serverMenu.forEach(menu => _registComponentNameToMenu(menu, app))
  const indexOfBiz = serverMenu.findIndex(m => m.menuNm === '업무')
  serverMenu.splice(indexOfBiz, 0, {
    menuId: 'devider',
    menuNm: '|',
    lv: 1
  })
  const treeServerMenu = vmutil.listToTree<Menu>(serverMenu, 'menuId', 'prMenuId', 'child')

  // 샘플 메뉴는 menuId, lv가 없음. lv, menuId 임의 생성
  addIdLvToSampleMenu(sampleMenu)
  // 샘플 메뉴는 트리로 작성했는데 VmTree에는 list로 넘기려고 변환
  // const sampleMenuList = vmutil.treeToList<Menu>(sampleMenu)

  menuList.value = [
    ...treeServerMenu,
  ]
  if ( import.meta.env.DEV) {
    menuList.value.push(...sampleMenu)
  }
  openMenu(homeMenu)
  loadStorage()
}

/**
 * @param menu
 * @param menuIndex
 * 
 * @return void
 */
async function openMenu(menu: Menu, menuIndex?: number) {
  if (!menu) return
  try {
    // // 이미 열린 탭이면 선택하고
    // const foundTab = openedMenuList.value.find((t) => t.menuId === menu.menuId)
    // if (!foundTab) {
    //   openedMenuList.value.push(menu)
    // }
    // openedMenu.value = menu

    if (menu.menuTp === MenuTp.PROGRAM) {
      const foundMenu = openedMenuList.value.find(m => m.menuId === menu.menuId)
      if (!foundMenu) {
        openedMenuList.value.push(menu)
        // const foundComponent = menu?.componentName ? importComponent[menu.componentName] : undefined
        // Layout.vue:47 [Vue warn]: Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`. 
        // menu.component = foundComponent ? markRaw(foundComponent) : undefined
      }
      openedMenu.value = menu

    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * 메뉴탭 닫기.
 * 닫은 후에 직전탭 선택
 * @param menu
 * @return menu
 */
function closeMenu(menu: Menu): Menu {
  const fi = openedMenuList.value.findIndex((t) => t.menuId === menu.menuId)
  openedMenuList.value.splice(fi, 1)

  const len = openedMenuList.value.length
  let ni = 0

  if (len - 1 < fi) {
    ni = len - 1
  } else if (fi === 0 || len == 1) {
    ni = 0
  } else {
    ni = fi
  }
  openedMenu.value = openedMenuList.value[ni]
  return openedMenu.value
}




// TODO async
/**
 * storage에 저장된 메뉴id 목록으로 open한다.
 */
function loadStorage() { //: Promise<string | null> {
  const openedMenuIds = storage.get<string[]>('openedMenuIds')
  console.log('openedMenuIds', openedMenuIds);
  
  if (openedMenuIds) {
  //   // const menuTabsMenuIdArray = menuTabs.value.map(m => m.menuId)
  //   // openedMenuIds
  //   //   .forEach((mid: any) => {
  //   //     treeRef.value.traverse(treeRef.value.innerTreeData, async (m: Menu) => {
  //   //       if (!menuTabsMenuIdArray.includes(mid) && m.menuId === mid) {
  //   //         menuTabs.value.push(m)
  //   //       }
  //   //     })
  //   //   })
  openedMenuIds.forEach( mi => {
    const rawMenuList = toRaw(menuList.value)
    const found = vmutil.findRecursive(rawMenuList, 'menuId', mi)
    // console.log(menuList.value[8].child[0].child[0] === found);
    
    console.log('raw', mi, rawMenuList === menuList.value, rawMenuList, found);
    openMenu(found)
  })

  //   // 이전에 열렸던 메뉴가 현재 메뉴리스트에 있으면 탭추가
  //   // openedMenuIds?.forEach(menuId => {
  //   //   const fm = menuList.value?.find(menu => menu.menuId === menuId)
  //   //   fm && openMenu(fm)
  //   // })
  //   // menuList.value.forEach(menu => menuTabsMenuIdArray)
  }

  const currentMenuId = storage.get<string>('currentMenuId')
  if (currentMenuId) {
    const cm = openedMenuList.value.find(om => om.menuId === currentMenuId)
    cm && openMenu(cm)
  // // treeRef.value.traverse(treeRef.value.innerTreeData, (m: Menu) => {
  // //   if (m.menuId === currentMenuId) {
  // //     currentTab.value = m
  // //     treeRef.value.focusNode(m)
  // //   }
  // // })
  }
  // return currentMenuId
}
/** 
 * 열린 프로그램에 변경이 생길 때마다 localstorage에 저장
 * 새로고침시 그대로 열리도록.
 */
function storeOpenedMenu() {
  const openedMenuIdString = openedMenuList.value
    // .filter(m =>  m.menuId)
    .map(m => m.menuId)
  storage.set('openedMenuIds', openedMenuIdString)
  storage.set('currentMenuId', openedMenu.value?.menuId)
}

/**
 * 트리 구조의 데이터에 'lv'와 'id' 속성을 추가한다.
 * @param menuTree
 * @param arent
 * @param keyChild 
 */
function addIdLvToSampleMenu(menuTree: Menu[]) {
  const idHelper = {
    id: 0
  }
  const level = 1
  // console.log('addIdLvToSampleMenu start.  tree = ', menuTree)

  _addIdLvRecursive(menuTree, idHelper, level)
}

function _addIdLvRecursive(menuTree: Menu[], idHelper: any, level: number, prId?: string) {
  // console.log('_convert', tree, idHelper, level, _prId);
  for (let i = 0; i < menuTree.length; i++) {
    idHelper.id++
    const id = 'M' + idHelper.id
    const menu = menuTree[i]
    menu.lv = level
    menu.menuId = id
    menu.prMenuId = prId

    if (menu.programUrl && !menu.child) {
      if (!menu.menuTp) {
        menu.menuTp = MenuTp.PROGRAM
      }
      _registComponentNameToMenu(menu)
    } else {
      // 프로그램url이 없고 child도 없으면 '메뉴그룹'으로 설정
      menu.menuTp = menu.menuTp ?? MenuTp.GROUP
      if (menu.child) {
        _addIdLvRecursive(menu.child, idHelper, level + 1, id)
      }
    }
  }
}

/**
 * menu에 dynamic loading을 위햔 componentName 등록
 */
function _registComponentNameToMenu(menu: Menu | null, app?: AppContext) {
  if (!menu || !menu.programUrl ) return
  const url = menu.programUrl
  const componentName = url.split('/').pop()?.replace('.vue', '')
  // const fileName = url?.substring(url.lastIndexOf('/') + 1, url.length - 4)
  // const componentName = fileName // _.kebabCase(fileName)
  // if (!componentName) console.warn('메뉴트리의 프로그램 componentName', componentName)
  if ( componentName ) {
    menu.componentName = componentName
    menu.componentExists = app ? app.components.hasOwnProperty(componentName) : true
  }
  // console.log('_registComponentNameToMenu 222', menu);
}

// globalShortcutKey(currentTab)

/**
 * 메뉴 데이터를 공유하기위한 hook
 * @Param _treeRef 새로고침했을때 열린 탭을 유지하기 위해 
 */
export function useMenu() {
  return {
    homeMenu,
    menuList,
    openedMenuList,
    openedMenu,
    loadMenu,
    openMenu,
    closeMenu,
    loadStorage
  }
}

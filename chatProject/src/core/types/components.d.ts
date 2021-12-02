// https://github.com/johnsoncodehk/volar/tree/master/extensions/vscode-vue-language-features
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // RouterLink: typeof import('vue-router')['RouterLink']
    // RouterView: typeof import('vue-router')['RouterView']
    
    // container
    VmContainer: typeof import('@/core/components/cell/VmContainer.vue')['default']
    VmCell: typeof import('@/core/components/cell/VmCell.vue')['default']
    VmDevider: typeof import('@/core/components/cell/VmDevider.vue')['default']

    // form
    VmSearch: typeof import('@/core/components/form/VmSearch.vue')['default']


    // grid
    VmGrid: typeof import('@/core/components/grid/VmGrid.vue')['default']
    
  }
}

export { }
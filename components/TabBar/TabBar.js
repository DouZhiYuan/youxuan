// components/TabBar/TabBar.js
Component({
  properties: {
    tabs:{
      type:Array,
      default:[]
    }
  },
  methods: {
    handleItemTap(e){
      // 获取当前点击项的下标
      const {index} = e.currentTarget.dataset;
      this.triggerEvent('changeCurrentindex',{index})
    }
  }
})

(function () {
  $.fn.dateInputInit = function (options) {
    let scope = this

    let _options = {
      format: options && options.format ? options.format : 'xxxx年xx月xx日'
    }

    let dp = new displayObj(_options.format, $(this)[0])

    let tab = false
    // 先展示  display  再做事件监听
    dp.display().off().on('focus', function (e) {   // table切换的使用
      if (tab) {
        e.target.setSelectionRange(e.target.disIns.now, e.target.disIns.now)
      } else {
        e.target.blur()
      }
    }).on('click', function (e) {
      tab = true
      e.target.focus()
      tab = false
    }).on('keydown', function (e) {
      if ((e.which < 106 && e.which > 95) || (e.which < 58 && e.which > 47)) {
        e.target.disIns.numHandler(e.key)
      }
      if (e.which === 8) {  // delete 键值
        e.target.disIns.deleteHandler()
      }
      return false
    })
  }

  /**
   *
   * @param {number} format -- 格式
   * @param {Dom} dom -- 绑定的dom
   *
   */
  function displayObj (format, dom) {
    let _this = this
    _this.length = format.match(/[x]/g).length
    this.val = format
    this.realIndex = []  // 表示 数值应该在  format中位置
    this.now = 0

    for (let i = 0; i < format.length; i++) {  // 构造realIndex
      if (format[i] === 'x') {
        this.realIndex.push(i)
      }
    }

    for (let i = 0; i < this.length; i++) {  // 构造val  展示的数值代表
      Object.defineProperty(_this, i, {
        get: function () {
          return i
        },
        set: function (value) {
          i = value.toString()
          _this.display(value)
        }
      })
    }
    this.$dom = $(dom)
    this.$dom[0].disIns = this

    this.display = function (value) {  // 最终展示的是val   所以每次展示前  根据  已修改的数据重新构造val的值
      if (isDef(value)) {
        _this.reloadVal(value)
      }
      _this.$dom.val(_this.val)
     // _this.$dom[0].focus()
      if (_this.isNumber(value)) {   // 判断是否为数值  代表两种行为  数值为按了数值键   否则为del键   两个的光标放置的方向不一样
        _this.$dom[0].setSelectionRange(_this.realIndex[_this.now] + 1, _this.realIndex[_this.now] + 1)
      } else {
        _this.$dom[0].setSelectionRange(_this.realIndex[_this.now], _this.realIndex[_this.now])
      }

      return _this.$dom
    }
    this.reloadVal = function (value) {  // 重新构造val的值
      _this.val = _this.val.slice(0, this.realIndex[_this.now]) + value + _this.val.slice(this.realIndex[_this.now] + 1, _this.val.length)
    }

    this.deleteHandler = function () {
      if (_this.now >= 0) {
        if (_this.now >= _this.length) {
          _this.now --
        }
        _this[_this.now] = 'x'
        _this.now --
      }
    }
    this.numHandler = function (key) {    // 改变val 的值     且改变后  会触发display
      for (let i = _this.now; _this.now < _this.length; i++) {
        if (_this.isNumber(_this[_this.now])) {
          _this.now ++
        } else {
          _this[_this.now] = key
          break
        }
      }
    }
    /**
     * @description
     * @param {all} val --
     */
    this.isNumber = function (val) {
      return !isNaN(parseInt(val))
    }
    for (let i = 0; i < this.length; i++) {  // 所有的数字变成 x
      _this[i] = 'x'
    }
  }
  /**
   * 判断数值是否为undefined
   * @param {*} val
   */
  function isDef (val) {
    return typeof val !== 'undefined'
  }
})()

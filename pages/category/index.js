var app = getApp();
Page({
  data: {
    // types: null,
    typeTree: {}, // 数据缓存
    currType: 0,
    // 当前类型
    "types": [
    ],
    typeTree: [],
    goods:[],
    pageNo:1,
    pageSize:10,
    hasMore:true
  },
  onLoad: function (option) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code==0){
          var list=res.data.data
          
          that.setData({
            types: list,
            currType:list[0].id
          });

          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
            method: 'post',
            data: { categoryId: that.data.currType,page:that.data.pageNo,pageSize:that.data.pageSize },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.code == 0) {
                that.setData({
                  goods: res.data.data,
                });
              } else {
                that.setData({
                  hasMore:false,
                  goods:[]
                })
              }
            },
            error: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000,
              });
            }
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
          });
        }
        console.info(res);

      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

    });
  },
  tapType: function (e) {
    var that = this;
    const currType = e.currentTarget.dataset.typeId;

    that.setData({
      currType: currType,
      pageNo:1
    });
    console.log(currType);
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      method: 'post',
      data: { categoryId: currType,page:that.data.pageNo,pageSize:that.data.pageSize },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            goods: res.data.data,
          });
        } else {
          that.setData({
            hasMore:false,
            goods:[]
          })
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      }
    });
  },
  loadMore: function(e) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      method: 'post',
      data: { categoryId: that.data.currType,page:++that.data.pageNo,pageSize:that.data.pageSize },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hasMore:true
          })
          var gs=that.data.goods.concat(res.data.data)
          that.setData({
            goods: gs,
          });
        } else {
          that.setData({
            hasMore:false
          })
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      }
    });
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
});
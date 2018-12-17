$(function () {

    queryCart();
    var page=1;

    // 下拉刷新和上啦加载购物车
    mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            // height:50,//可选,默认50.触发下拉刷新拖动距离,
            // auto: true,//可选,默认false.首次加载自动下拉刷新一次
            // contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            // contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            // contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback :function(){
                setInterval(function(){
                    queryCart()
                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                     // 11. 下拉结束后重置上拉加载的效果
                     mui('#refreshContainer').pullRefresh().refresh(true);
                     // 12. 把page也要重置为1
                     page = 1;
                },1000);
            }
          },
          up:{
            callback :function(){
                // 只是为了模拟实际的请求延迟而已,实际不需要!!!
                setInterval(function(){
                    page++;
                    // 请求page++了之后的更多的数据
                    $.ajax({
                        data: {
                            // page要刷新所以就写page的请求数据!!!
                            page: page,
                            pageSize: 4
                        },
                        url: "/cart/queryCartPaging",
                        success:function( data ){
                            
                            console.log(data);
                
                            if(data.error){
                                location = 'login.html?returnUrl=' + location.href;
                               }else{
                                console.log(data instanceof Array);
                                // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                                if (data instanceof Array) {
                                    data = {
                                        data: data
                                    }
                                }
                                if (data.data.length > 0){
                                var html = template('cartListTpl', data);
                                // 数据要刷新所以就写追加append到购物车的列表!!!
                                $('.cart-list').append(html);
                                // 结束上啦加载效果免得转圈圈
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                            }else{
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            }
                            }               
                        }
                    });
                },1000);
            }
          }
        }
      });
    //   封装一个购物车商品数据函数
      function queryCart(){

        $.ajax({
            data: {
                page: 1,
                pageSize: 4
            },
            url: "/cart/queryCartPaging",
            success:function( data ){
                
                console.log(data);
    
                if(data.error){
                    location = 'login.html?returnUrl=' + location.href;
                   }else{
                   
                    var html = template('cartListTpl', data);
                    $('.cart-list').html(html);
                   }
    
            }
        });
        // __________________________分割线_____________________________
      }
})
$(function () {

    queryCart();
    var page=1;

        // 功能!!!下拉刷新和上啦加载购物车------------------------------分割线------------------------------------------
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
                setTimeout(function(){
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
                setTimeout(function(){
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
                            
                            // console.log(data);
                
                            if(data.error){
                                location = 'login.html?returnUrl=' + location.href;
                               }else{
                                // console.log(data instanceof Array);
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

    //   功能!!!图片下方的多选框的选定,可以计算总价格的功能-------------------分割线------------------------------------------
      $('.cart-list').on('change','.choose',function(){
        var checkeds=$('.choose:checked');
        var sum=0;
        checkeds.each(function(index,value){
            var price = $(value).data('price');
            var num = $(value).data('num');
            var count=price * num;
            sum+=count;
        });
        sum=sum.toFixed(2);
        $('.order-total span').html(sum);
      });
      
    //  功能!!! 侧滑出来后的删除商品按钮------------------------------分割线------------------------------------------
      $('.cart-list').on('tap','.btn-delete',function(){
        // 点击当前a存储他~ 因为在第二个函数内要用,但是第二个元素内直接用this是只能获取到window调用而获取不到a标签了
        // this只能获取第一层function的this,第二层包裹着的都是window,所以需要var一个that来存储↓
        var that=this;
        mui.confirm( '你是认真删除我吗?','弱弱提示', ['确定','取消'], function(e){        
            // console.log(e);
            // e.index==0 是确定,e.index==1就是取消
            if(e.index==0){
                var id =$(that).data('id');

                $.ajax({
                    url: "/cart/deleteCart",
                    data: {id:id},
                    success: function (data) {
                        if(data.success){
                            queryCart();
                        }
                    }
                });
                
            }else if(e.index==1){
                // 侧滑列表回去
                // var handle=$(that).parent().next();
                // // console.log(handle);
                // handle.css({
                //     transform:'none'
                // });
                // MUI官方提供函数  是MUI调用 参数是a的父元素的父元素 dom对象
                mui.swipeoutClose(that.parentNode.parentNode);
                // 下面这样写↓ :parent()强行转成Zepto对象所以要取下标0
                // mui.swipeoutClose($(that).parent().parent()[0]);
            }
        });
      });


    //   功能!!!编辑商品------------------------------分割线------------------------------------------
    $('.cart-list').on('tap','.btn-edit',function(){
        var that=this;
        var product=$(this).data('product');
        var min=product.productSize.split('-')[0]-0;
        var max=product.productSize.split('-')[1];
        product.productSize=[];
        for(var i = min;i<=max;i++){ 
            product.productSize.push(i);
         };
         var html=template('editCarTpl',product);
        //  去除空格换行 ↓
         html=html.replace(/[\r\n]/g,"");
         console.log(html);
        mui.confirm( html,'编辑商品', ['确定','取消'], function(e){    
            if(e.index==0){
                $.ajax({
                    url: "/cart/updateCart",
                    data: {id:product.id,
                        size:$('.btn-size.active').data('size'),
                        num:nui('.mui-numbox').numbox().getValue()},
                    success: function (data) {
                        if(data.success){
                            queryCart();
                        }
                    }
                });
            }else{
                mui.swipeoutClose($(that).parent().parent()[0]);
            }
        });
        // 7. 数字框也是动态添加要手动初始化 
        mui('.mui-numbox').numbox().setValue(product.num);
        // 8. 尺码默认也是不能点击的手动初始化
        $('.btn-size').on('tap', function() {
            $(this).addClass('active').siblings().removeClass('active');
        });
    });


      //   封装一个购物车商品数据函数 ------------------------------分割线------------------------------------------
      function queryCart(){

        $.ajax({
            data: {
                page: 1,
                pageSize: 4
            },
            url: "/cart/queryCartPaging",
            success:function( data ){
                
                // console.log(data);
    
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
$(function(){
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    $.ajax({
        url: '/category/queryTopCategory',
        success: function(data) {
            console.log(data);
            var html = template('categoryLeftTpl', data);
            // var html = template('categoryLeftTpl',{list:data.rows});
            $('.category-left ul').html(html);
        }
    });
    $('.category-left ul').on('tap','li a',function(){
        var id =$(this).data('id');
        // 用来专门获取自定义属性的函数
        querySecondCategory(id);
        // 6. 切换当前active类名 给当前点击a父元素添加active 其他兄弟删掉
        $(this).parent().addClass('active').siblings().removeClass('active');
    });
    querySecondCategory(1);
    function querySecondCategory(id){
        $.ajax({
            url:'/category/querySecondCategory',
            data:{id:id},
            success:function(data){
                var html=template('categoryRightTpl',data);
                $('.category-right ul').html(html);
            }
        });
    }
});
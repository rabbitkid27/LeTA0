$(function(){
    var search = decodeURI(location.search.split('=')[1]);
    $.ajax({
        url:' /product/queryProduct',
        data:{page:1,pageSize:4,proName:search},
        success:function(data){
            var html= template('productlistTpl',data);
            $('.product-list .content ul').html(html);
        }
    });
})
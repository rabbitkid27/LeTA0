$(function(){
    // 添加搜索记录的功能代码
    $('.btn-search').on('tap', function() {
        var search = $('.input-search').val();
        // console.log(search);
        if (!search.trim()) {
            alert('请输入要搜索的商品');
            return;
        }
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // console.log(historyData);
        

        if (historyData.indexOf(search) != -1){
            historyData.splice(historyData.indexOf(search),1);
        }
        historyData.unshift(search);
        localStorage.setItem('searchHistory', JSON.stringify(historyData));
        queryHistory();
        location = 'productlist.html?search='+search;
    });

    // 查询搜索记录的代码

    queryHistory();
    function queryHistory() {
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        historyData = { rows: historyData };
        // console.log(historyData);
        var html = template('searchListTpl', historyData);
        $('.search-history .mui-table-view').html(html);
    }

    // 删除搜素记录的代码
    $('.search-history .mui-table-view').on('tap', '.btn-delete', function(){
        var index=$(this).data('index');
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        historyData.splice(index,1);
        localStorage.setItem('searchHistory', JSON.stringify(historyData));
        queryHistory();

    });
    // 清空搜索记录的代码
    $('.btn-clear').on('tap', function() {
        localStorage.removeItem('searchHistory');
        queryHistory();
    });
});
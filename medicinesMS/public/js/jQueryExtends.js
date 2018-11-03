+ function ($) {
    $.fn.extend({
        addTips: function () {
            //this代表的是选择器
            $(this).each(function (index, item) {
                var text = $(this).parent().prev().text().trim();
                if (text == "" || text == null || text == undefined) {
                    text = $(item).data("label").trim();
                }
                $(item).attr("placeholder", "请输入" + text);
            });
        },
        valDate: function () {

            let now = new Date().toLocaleString('chinese', {
                hour12: false
            })
            $(this).each(function (index, item) {
                $(item).val(now);
            })
        }
    });

    $(".btn-submit-loading").click(function () {
        layer.load({
            shade: [0.4, "#000"]
        }); //弹出一个加载层
    });

    $("[data-toggle='ckAll']").click(function () {
        var flag = $(this).prop("checked");
        console.log(this);
        $(this).parentsUntil("table").find("[name='ck']").prop("checked", flag);
    })

    //报错提示
    $('.btn-warn').click(function () {
        layer.open({
            title: '提示',
            content: '谢谢您的提示，我们会尽快更正的！'
        });
    })
    //多选报错提示
    $(".btn-warn-checked").click(function () {
        //看是否有选中项
        if ($("input[name='ck']:checked").length > 0) {
            layer.open({
                title: '提示',
                content: '谢谢您的提示，我们会尽快更正的！'
            });
        } else {
            layer.open({
                title: '提示',
                content: '还未选中信息！！！'
            });
        }

    });

}(jQuery)
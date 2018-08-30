var featureData = {"features":[{"client":"A","description":"","id":22,"priority":1,"product_area":"Policies","target_date":"Fri, 28 Sep 2018 00:00:00 GMT","title":"Mega New Feature 3 !!!"},{"client":"C","description":"","id":4,"priority":2,"product_area":"Policies","target_date":"Sat, 29 Sep 2018 00:00:00 GMT","title":"Different Client C"},{"client":"A","description":"Trigger Communication Events","id":16,"priority":2,"product_area":"Reports","target_date":"Thu, 30 Aug 2018 00:00:00 GMT","title":"Mega New Feature !!!"},{"client":"B","description":"","id":18,"priority":4,"product_area":"Claims","target_date":"Fri, 28 Sep 2018 00:00:00 GMT","title":"Some Extra Function 2"}]}


function Feature(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.client = data.client;
    this.area = data.product_area;
    this.priority = data.priority;
    this.target = data.target_date;
}

var featureModel = {
    features : ko.observableArray([]),
    sortBy : ko.observable('asc'),
    id : ko.observable(""),
    title : ko.observable(""),
    description : ko.observable(""),
    clientValues : [
        {name: "Client A", id: "A"},
        {name: "Client B", id: "B"},
        {name: "Client C", id: "C"}
    ],
    selectedClient : ko.observable(1),
    priority : ko.observable(1),
    target : ko.observable(moment().format("YYYY-MM-DD")),
    areaValues : [
        {name: "Policies", id: "Policies"},
        {name: "Billings", id: "Billings"},
        {name: "Claims", id: "Claims"},
        {name: "Reports", id: "Reports"}
    ],
    selectedArea : ko.observable('policy'),
    load: function(data) {
        $('#hiddenId').val(data.id);
        $('#inputTitle').val(data.title);
        $('#inputDescription').val(data.description);
        $('#client').val(data.client);
        $('#inputPriority').val(data.priority);
        var inputDate = new Date(data.target);
        var inputDay = ("0" + inputDate.getDate()).slice(-2);
        var inputMonth = ("0" + (inputDate.getMonth() + 1)).slice(-2);
        var ymdDate = inputDate.getFullYear()+"-"+(inputMonth)+"-"+(inputDay);
        $('#inputTargetDate').val(ymdDate);
        $('#productArea').val(data.area);
        featureModel.show();
    },
    save : function(formElement) {
        // If the form data is valid, post the serialized form data to the web API.
        $(formElement).validate();
        if ($(formElement).valid()) {
            if (moment($('#inputTargetDate').val()) < moment()) {
                $('#inputTargetDate').addClass('is-invalid');
            } else {
                $.ajax({
                    url: '/features',
                    data: $(formElement).serialize(),
                    type: 'POST',
                    success: function(response) {
                        featureModel.refresh();
                        featureModel.hide();
                        $('#alertSuccess').show();
                        //window.location = "/";
                    },
                    error: function(error) {
                        $('#alertWarning').show();
                        console.log(error);
                    }
                });
            }
        }
    },
    delete: function(data) {
        $.ajax({
            url: '/features/'+ data.id,
            type: 'DELETE',
            success: function(response) {
                featureModel.refresh();
                $('#alertSuccess').show();
                //window.location = "/";
            },
            error: function(error) {
                $('#alertWarning').show();
                console.log(error);
            }
        });
    },
    show: function() {
        $('#addButton').hide();
        $('#editFeature').attr( "style", "display: block !important;");
        var offset = $('#saveButton').offset(); 
        $('html, body').animate({
            scrollTop: offset.top,
            scrollLeft: offset.left
        });
    },
    hide: function() {
        $('#addButton').show()
        $('#editFeature').attr( "style", "display: none");
        $('#hiddenId').val('');
        $('#inputTitle').val('');
        $('#inputDescription').val('');
        $('#client').val('');
        $('#inputPriority').val('');
        $('#inputTargetDate').val('');
        $('#inputTargetDate').removeClass('is-invalid');
        $('#productArea').val('');
    },
    refresh: function() {
        $.getJSON('/features', function(obj) {
            var t = $.map(obj.features, function(item) {
                return new Feature(item);
            });
            featureModel.features(t);
        }); 
        featureModel.features.valueHasMutated();
    },
    sort: function(order) {
        sortBy = ko.unwrap(featureModel.sortBy());
        if (sortBy=='asc') {
            featureModel.sortBy('desc') 
        } else {
            featureModel.sortBy('asc')
        }
        $.getJSON('/features?order='+order+'&dir='+sortBy, function(obj) {
            var t = $.map(obj.features, function(item) {
                return new Feature(item);
            });
            featureModel.features(t);
        }); 
        featureModel.features.valueHasMutated();
    }
};

$(function() {
    featureModel.refresh();
    ko.applyBindings(featureModel);
});
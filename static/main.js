function Feature(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.client = data.client;
    this.area = data.product_area;
    this.priority = data.priority;
    this.target = data.target_date;
    /*
    this.id = ko.observable(data.id);
    this.title = ko.observable(data.title);
    this.description = ko.observable(data.description);
    this.client = ko.observable(data.client);
    this.area = ko.observable(data.product_area);
    this.priority = ko.observable(data.priority);
    this.target = ko.observable(data.target_date);
    */
}

var featureModel = {
    features : ko.observableArray([]),
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
    edit: function(data) {
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
    }
};

$(function() {
    ko.applyBindings(featureModel);
    featureModel.refresh();
});
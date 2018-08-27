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
    create : function(formElement) {
        // If the form data is valid, post the serialized form data to the web API.
        $(formElement).validate();
        if ($(formElement).valid()) {
            if (moment(this.target()) < moment()) {
                $('#inputTargetDate').addClass('is-invalid');
            } else {
                $.ajax({
                    url: '/features',
                    data: $(formElement).serialize(),
                    type: 'POST',
                    success: function(response) {
                        window.location = "/";
                    },
                    error: function(error) {
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
                window.location = "/";
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
};

$(function() {
    $.getJSON('/features', function(obj) {
        var t = $.map(obj.features, function(item) {
            return new Feature(item);
        });
        featureModel.features(t);
    });
    $('#addButton').bind( "click", function() {
      $('#addButton').hide();
      $('#createFeature').attr( "style", "display: block !important;");
    });
    ko.applyBindings(featureModel);
});
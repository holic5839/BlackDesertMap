define('createViewModel', [
    'jquery',
    'knockout',
    'newFormFieldViewModel',
    'formField',
    'helperFunctions',
    'formFieldsEditorViewModel'
], function($, ko, NewFormFieldViewModel, FormField, helper, FormFieldsEditor) {

    return function (viewModel) {
        var self = this;

        self.newObjTypeName = ko.observable();
        self.formFieldsEditor = ko.observable(new FormFieldsEditor(viewModel));
        
        self.changeNewObjType = function (data, event) {
            self.formFieldsEditor().changeType(self.newObjTypeName());
        };

        self.cancel = function () {
            viewModel.mode("view");
        };

        self.save = function () {
            var typeName = self.newObjTypeName();
            if (typeName == '' || typeName == null){
                alert('Vor dem Speichern muss ein Typ ausgewählt sein.');
                return;
            }
            var layer = viewModel.createdLayer();
            if (layer == null){
                alert('Vor dem Speichern muss eine Markierung mit einem der Tools (linker Rand der Karte) erstellt werden.');
                return;
            }

            var mapObj = helper.createMapObjectFromLayer(layer, typeName);

            var formData = self.formFieldsEditor().getFormData();
            console.log(formData);

            helper.insertFormData(mapObj, formData);

            console.log(type);
            helper.saveMapObjToDatabase(mapObj, true, function(data){
                helper.removeLayer(layer);
                var mapObj = JSON.parse(data);
                helper.addDatabaseObject(viewModel, mapObj);
            });

            viewModel.createdLayer(null);
            viewModel.hideDrawControl();
            viewModel.mode('view');
        };

        self.saveCreate = function(){
            var typeName = self.newObjTypeName();
            if (typeName == '' || typeName == null){
                alert('Vor dem Speichern muss ein Typ ausgewählt sein.');
                return;
            }
            var layer = self.createdLayer();
            if (layer == null){
                alert('Vor dem Speichern muss eine Markierung mit einem der Tools (linker Rand der Karte) erstellt werden.');
                return;
            }

            var type = types[typeName];

            helper.saveLayerToDatabase(self, layer, type, function(data){
                bdomap.drawnItems.removeLayer(layer);
                var mapObj = JSON.parse(data);
                helper.addDatabaseObject(self, mapObj);
            });

            self.createdLayer(null);
            self.mode('view');
            self.hideDrawControl();
        };
    };

});
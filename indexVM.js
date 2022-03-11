const pqOptions = {
    width: "auto",
    height: 500,
    showTitle: false,
    showHeader: true,
    showTop: true,
    showToolbar: false,
    showBottom: true,
    wrap: true,
    hwrap: false,
    sortable: false,
    editable: false,
    resizable: false,
    collapsible: false,
    draggable: true, dragColumns: { enabled: true },
    scrollModel: { autoFit: true },
    numberCell: { show: true, resizable: true, title: "S.N.", minWidth: 30 },
    pageModel: { curPage: 1, rPP: 10, type: "local" },
    columnTemplate: { wrap: true, editable: false, dataType: "string", halign: "center", hvalign: "center", resizable: true, styleHead: { 'font-weight': "bold" } },
};

function IndexVM() {
    const self = this;

    var isNullOrEmpty = function (str) {
        if (str === undefined || str === null) {
            return true;
        } else if (typeof str === "string") {
            return (str.trim() === "");
        } else {
            return false;
        }
    };

    const models = {
        MyModel: function (item) {
            item = item || {};
            this.Name = ko.observable(item.Name || "");
            this.Age = ko.observable(item.Age || 1);
            this.GenderId = ko.observable(item.GenderId || "");
            this.GenderName = ko.observable(item.GenderName || "");
        },
        UiElements: function () {
            self.MyModel = ko.observable(new models.MyModel());
            self.DataList = ko.observableArray([]);
            self.selectedTransaction = ko.observable();
            self.GenderList = ko.observableArray([
                { Text: 'Male', Value: '1' },
                { Text: 'Female', Value: '0' }]);
        },
    };

    self.SaveInformation = function () {

        if (UiEvents.validate.SaveValidation()) {
            UiEvents.functions.Save();
        }
    };

    self.deleteRow = function (id) {
        UiEvents.functions.Delete(id);
    };
	
	self.editRow = function(id)
	{
		self.MyModel(new models.MyModel());
		var RowId= id;
		var selectItem = $("#demoGrid").pqGrid("getRowData", {rowIndxPage:Number(RowId)});
		self.selectedTransaction (RowId);
		self.MyModel().Name(selectItem.Name);
		self.MyModel().Age(selectItem.Age);
		//self.MyModel().Age(selectItem.Age);
		self.MyModel().GenderId(selectItem.GenderId);
		
    };
		

    const UiEvents = {
        validate: {
            SaveValidation: function (item) {
                if (isNullOrEmpty(self.MyModel().Name())) {
                    alert("Warning! - Name cannot be empty...!!!");
                    return false;
                }
                else if (isNullOrEmpty(self.MyModel().Age()) || (parseInt(self.MyModel().Age()) <= 0)) {
                    alert("Warning! - Age Must be greater than 0...!!!");
                    return false;
                }
                else if (isNullOrEmpty(self.MyModel().GenderId())) {
                    alert("Warning! - Gender cannot be empty...!!!");
                    return false;
                }
                else {

                    self.MyModel().GenderName((self.GenderList().find(X => X.Value == self.MyModel().GenderId()) || {}).Text);
					
					if (isNullOrEmpty(self.selectedTransaction())){
						alert('new');				
						self.DataList.push(ko.toJS(self.MyModel()));
					
					}
					else { // update 
						alert('old');
						self.DataList.splice(self.selectedTransaction(),1);
						self.DataList.push(ko.toJS(self.MyModel()));
						self.selectedTransaction('');
					}
					 self.MyModel (new models.MyModel());
					
					 return true;
					 
					
               }
			}
        },
        clear: {
            ResetAll: function () {
                self.MyModel(new models.MyModel());
                self.DataList([]);
            },
        },
        functions: {
            Save: function () {

                if ($("#demoGrid").pqGrid("instance")) {
                    $("#demoGrid").pqGrid('option', 'dataModel.data', ko.toJS(self.DataList()));
                    $("#demoGrid").pqGrid('refreshDataAndView');
                }
                else {
                    const options = Object.assign({}, pqOptions);
                    options.colModel = [
                        { title: "Full Name", align: "center", dataIndx: "Name", width: "40%" },
                        { title: "Age", align: "center", dataIndx: "Age", width: "25%" },
                        { title: "Gender", align: "center", dataIndx: "GenderName", width: "15%" },
                        {
                            title: "Action", align: "left", render: function (ui) {
                                return `<button type='button' title='Delete' onclick='obj.deleteRow("${ui.rowIndx}")'>Delete</button>   <button type='button' title='Edit' onclick='obj.editRow("${ui.rowIndx}")'>Edit</button>
								`


                            }, width: "20%"
                        },

                    ];
                    options.dataModel = { data: ko.toJS(self.DataList()) };
                    $("#demoGrid").pqGrid(options);
                }
            },
            Delete: function (index) {
                self.DataList.splice(index, 1);
                UiEvents.functions.Save(); 
            },
        },

    };

    function Init() {
        models.UiElements();
        UiEvents.clear.ResetAll();
        UiEvents.functions.Save();
    }
    Init();
}

var obj;

$(document).ready(function () {
    obj = new IndexVM();
    ko.applyBindings(obj);

});
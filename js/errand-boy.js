var application = angular.module('furgatErrandBoy', ['ngCookies']);
var appversion = '1.0.Atomic';

application.controller('errandBoy', function($scope, $cookies) {
    
    //==============================================================================================
    // initialization of data :
    //==============================================================================================
    // declare our errands array
    // errands are formatted as follows
    // [
    //      {
    //          'name' : 'string',
    //          'desc' : 'string',
    //          'status' : boolean
    //      }
    // ]
    $scope.errands = [];
    
    // declare our reports
    // reports are formatted as follows
    // [
    //      {
    //          'message' : 'string',
    //          'color' : 'string'
    //      }
    // ]
    $scope.reports = [];
    
    // initialize form array
    $scope.errandForm = {};
    
    // set form to hidden
    $scope.adding = false;
    
    
    // attempt to load previous errands from cookies
    var lastErrands = $cookies.getObject('furgatErrandBoyErrands');
    
    // if cookie errands exist, from a previous session, load them now
    if ( lastErrands !== undefined )
        $scope.errands = lastErrands;
    
    //==============================================================================================
    // saveErrands :
    // helper function, saves out the array of errands into a cookie using $cookies
    //==============================================================================================
    $scope.saveErrands = function () {
        // wrap in a try-catch block?
        // save to cookies
        $cookies.putObject('furgatErrandBoyErrands', $scope.errands);    
        // display success message
    };
    
    //==============================================================================================
    // toggleAdd :
    // called from the toggle frontend button, enables/disables the errand form
    //==============================================================================================
    $scope.toggleAdd = function() {
        var tempBool = $scope.adding;
        $scope.adding = !tempBool;
    }
    
    //==============================================================================================
    // addErrand : 
    // called from the form button, takes filled in data to add a new errand
    //==============================================================================================
    $scope.addErrand = function(obj) {
        // temporary variable to store user input
        var temps = [$scope.errandForm.name, $scope.errandForm.desc];
        
        if ( temps[0] == undefined || temps[0] == '' ) { // reject blank name input, blank description is fine
            $scope.report('You must at least enter a Name for your errand,', 'pink');
        } else {
            // should report on success state as well
            $scope.errands.push({
                'name' : $scope.errandForm.name,
                'desc' : $scope.errandForm.desc,
                'status' : false
            }); // add the errand, defaulted to incomplete
            
            // reset the form so that user cannot repeat-submit the same errand
            $scope.errandForm.name = '';
            $scope.errandForm.desc = '';

            // report success
            $scope.report('New Errand created successfully!', 'green');
            
            $scope.saveErrands(); // save after adding a new task
        }
    };
    
    //==============================================================================================
    // editErrands :
    // called from ng-dblclick, allows errand names, descs to be edited with contenteditable
    //==============================================================================================
    $scope.editErrand = function(index, kind) {
        var editValue = event.target.contentEditable; // we don't need to constantly refer to event

        // set the value to the opposite, it's expecting a string though
        editValue = editValue == 'false' ? 'true' : 'false';
     
        if (editValue == 'false') {
            var tempString = event.target.innerHTML; // the edited contents of the element
            
            // only name is required on addition, but we don't want people to zero out their
            // descriptions at this point either,, so catch any blank input
            if ( tempString == undefined || tempString == '' ) {
                editValue = 'true'; // force editing to continue
                // report error
                $scope.report('Warning: Please insert a value for Name,,', 'pink');
                // placeholder so that the user doesn't lose the box
                event.target.innerHTML = '[Insert ' + kind + ']';
            } else {
                if ( kind == 'Name') { // find out where we should store this
                    $scope.errands[index].name = tempString;
                } else {
                    $scope.errands[index].desc = tempString;
                }
                
                $scope.saveErrands(); // save errands after storing the new input
            }
        }
        
        event.target.contentEditable = editValue; // alter content editable on the element
    };
    
    //==============================================================================================
    // editEnter :
    // processes 'enter' keypress when editing, calls editErrand to close and save
    // the reason for re-using editErrand is that it can still be called on ng-dbclick even
    // when open, so we want both dblclick and enter presses to behave properly
    //==============================================================================================
    $scope.editEnter = function(index, kind) {
        if (event.which == 13) {
            $scope.editErrand(index, kind)
        }
    };
    
    //==============================================================================================
    // statusUpdate :
    // called from checkbox click, forces a save (the checkbox itself updates e.status)
    //==============================================================================================
    $scope.statusUpdate = function(index) {
        $scope.saveErrands();
    }
    
    //==============================================================================================
    // delErrand :
    // called from the individual trash buckets, deletes the task that trash bucket is on
    //==============================================================================================
    $scope.delErrand = function(index) {
        $scope.errands.splice(index, 1); // remove at [index] length 1
        $scope.saveErrands(); // save after removing a task
    };
    
    //==============================================================================================
    // report :
    // internally used to add a new report to the ticker
    //==============================================================================================
    $scope.report = function(msg, color) {
        $scope.reports.push({
            'message' : msg,
            'color' : color
        });
    }
    
    //==============================================================================================
    // delReport :
    // called from the close button in the ui to remove a report from the ticker
    //==============================================================================================
    $scope.delReport = function(index) {
        $scope.reports.splice(index, 1);
    }
    
    //==============================================================================================
    // clearAllData :
    // called from the clear button, removes all tasks and resets the cookie
    //==============================================================================================
    $scope.clearAllData = function () {
        // delete everything from the errands list
        $scope.errands = [];
        // completely empty the cookie by saving the empty list
        $scope.saveTasks();
    };
    
    // welcome the user
    $scope.report('Welcome to Errand-Boy (ver. ' + appversion + ')', 'green');
});
var application = angular.module('furgatErrandBoy', ['ngCookies']);

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
    $scope.errandForm = {};
    
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
        console.log($scope.errands);
        // wrap in a try-catch block?
        // save to cookies
        $cookies.putObject('furgatErrandBoyErrands', $scope.errands);    
        // display success message
    };
    
    //==============================================================================================
    // addErrand : 
    // called from the form button, takes filled in data to add a new errand
    //==============================================================================================
    $scope.addErrand = function(obj) {
        // report progress indicator to user somehow
        // temporary variable to store user input
        var temps = [$scope.errandForm.name, $scope.errandForm.desc];
        
        if ( temps[0] == undefined ) { // reject blank name input, blank description is fine
            // better fail state reporting later
            console.log('failed, please add descriptive text,,');
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
            
            if ( kind == 'name') { // find out where we should store this
                $scope.errands[index].name = tempString;
            } else {
                $scope.errands[index].desc = tempString;
            }
                
            $scope.saveErrands(); // save errands after storing the new input
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
    // delErrand :
    // called from the individual trash buckets, deletes the task that trash bucket is on
    //==============================================================================================
    $scope.delErrand = function(index) {
        $scope.errands.splice(index, 1); // remove at [index] length 1
        $scope.saveErrands(); // save after removing a task
    };
    
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
});
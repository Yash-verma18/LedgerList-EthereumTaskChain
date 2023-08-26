pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string content, bool completed);

    constructor() public {
        createTask("Check out dappuniversity.com");
    }

    /* 
    solidity allows us to create events that are triggered anytime you know something happens inside of a smart contract and external consumers can subscribe to these events to know uh whenever the event happened and events are really useful because you know whatever we call this create task function we don't always know when you know the transaction actually completed we don't always know when it was mined and things like that and it can be really useful to listen to those events uh in order to you know know that it was finished so we can create an event in solidity before we call it here we need to actually declare it inside of our smart contract we'll just do it like this we'll go below this mapping we'll say event we'll say task created and notice that's capitalized all right here's a semicolon here and we'll just add some arguments to this event we'll say uint id this will be the id the task that was created a string this is the content and the completed property so boolean completed all right so that's how we create an event inside of solidity right this just means that you know the task created event is available to us inside of the smart contract and i'll show you how we can actually call it we do like this we use the emit keyword emit task created and we pass in the arguments so the id here is the task count and the content which is passed in from the function and false because it's a new task and we haven't completed it yet and that's pretty easy that's how you trigger events inside of solidity and we can subscribe to these events you know inside the client-side application or you know anywhere that can listen to events on a smart contract all right while we're here i'm going to go ahead and actually write the tests for creating the to-do item so i'll open the test file over here do*/

    // creat a function to create a tasks
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }
}

App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account

    App.account = await web3.eth.getAccounts();
    App.account = App.account[0];
    console.log("app.account", App.account);
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON("TodoList.json");

    App.contracts.TodoList = await TruffleContract(todoList);
    App.contracts.TodoList.setProvider(window.web3.currentProvider);
    console.log("todoList", todoList);

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed();
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }

    try {
      // Update app loading state
      App.setLoading(true);

      // Render Account
      $("#account").html(App.account);

      // Render Tasks
      await App.renderTasks();

      // App.setLoading(false);
    } catch (error) {
      console.error("Error during rendering:", error);
    } finally {
      // Update loading state
      App.setLoading(false);
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const content = $("#newTask").val();
    console.log("content", content);

    try {
      await App.todoList.createTask(content, { from: App.account });
    } catch (error) {
      console.error("Error during creating task:", error);
    } finally {
      App.setLoading(false);
    }

    window.location.reload();
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    console.log("taskId", taskId);

    try {
      await App.todoList.toggleCompleted(taskId, { from: App.account });
    } catch (error) {
      console.error("Error during toggling task:", error);
    } finally {
      App.setLoading(false);
    }

    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount();
    console.log("taskCount", taskCount.toNumber());
    const $taskTemplate = $(".taskTemplate");

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      console.log("task", task);

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);

      // Put the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // Show the task
      $newTaskTemplate.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});

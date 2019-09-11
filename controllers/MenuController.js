const inquirer = require('inquirer');
const ContactController = require("./ContactController");

module.exports = class MenuController {
  constructor(){
    this.mainMenuQuestions = [
        {
         type: "list",
          name: "mainMenuChoice",
          message: "Please choose from an option below: ",
          choices: [
            "Add new contact",
            "View all contacts",
            "Get time",
            "Search for a contact",
            "Exit"
          ]
        }
      ];
      this.book = new ContactController();
  }
  
  main(){
    console.log(`Welcome to AddressBloc!`);
    inquirer.prompt(this.mainMenuQuestions).then((response) => {
      switch(response.mainMenuChoice){
        case "Add new contact":
          this.addContact();
          break;
        case "View all contacts":
          this.getContacts();
          break
        case "Exit":
          this.exit();
        default:
          console.log("Invalid input");
          this.main();
        case "Search for a contact":
          this.search();
          break;
        case 'Get time':
          this.getTime();
          break;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  clear(){
    console.log("\x1Bc");
  }
  addContact(){
    this.clear();
    inquirer.prompt(this.book.addContactQuestions).then((answers) => {
      this.book.addContact(answers.name, answers.phone).then((contact) => {
        console.log("Contact added successfully!");
        this.main();
      }).catch((err) => {
        console.log(err);
        this.main();
      });
    });
  }

   getContactCount(){
       console.log(this.contacts.length);
       this.main();
       return this.contacts.length;
     }

    getContacts(){
       this.clear();
       this.book.getContacts().then((contacts) => {
         for(let contact of contacts) {
          this._printContact(contact);
				}
        this.main();
      }).catch((err) => {
        console.log(err);
        this.main();
      });
    }

    search(){
      inquirer.prompt(this.book.searchQuestions).then((target) => {
        this.book.search(target.name).then((contact) => {
          if(contact === null){
            this.clear();
            console.log("Contact not found");
            this.search();
          } else {
            this.showContact(contact);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        this.main();
      });
    }

    showContact(contact){
      this._printContact(contact);
    inquirer.prompt(this.book.showContactQuestions)
    .then((answer) => {
      switch(answer.selected){
        case "Delete contact":
          this.delete(contact);
          break;
        case "Main menu":
          this.main();
          break;
        default:
          console.log("Something went wrong.");
          this.showContact(contact);
      }
    })
    .catch((err) => {
      console.log(err);
      this.showContact(contact);
    });
    }

    _printContact(contact){
      console.log(`
      name: ${contact.name}
      phone: ${contact.phone}
      email: ${contact.email}
      ---------------------`
    );
    }

    delete(contact){
      inquirer.prompt(this.book.deleteConfirmQuestions)
      .then((answer) => {
        if(answer.confirmation){
          this.book.delete(contact.id);
          console.log("contact deleted!");
          this.main();
        } else {
          console.log("contact not deleted");
          this.showContact(contact);
        }
      })
      .catch((err) => {
        console.log(err);
        this.main();
      });
    }

  exit(){
    console.log("Thanks for using AddressBloc!");
    process.exit();
  }
	getTime() {
		function addZero(i) {
			if (i < 10) {
				i = '0' + i;
			}
			return i;
		}
		var currentDate = new Date();
		var hours = addZero(currentDate.getHours());
		var minutes = addZero(currentDate.getMinutes());
		var seconds = addZero(currentDate.getSeconds());
		var date = addZero(currentDate.getDate());
		var month = addZero(currentDate.getMonth() + 1);
		var year = currentDate.getFullYear();
		var dateString = 'It\'s ' + hours + ':' + minutes + ':' + seconds + ' on ' + month + '/' + date + '/' + year;
		console.log(dateString);
		this.main();
		return dateString;
	}
};
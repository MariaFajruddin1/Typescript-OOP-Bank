import { BankAccount } from "./account.js";
export class Customer {
    name;
    userId;
    age;
    contactNumber;
    pin;
    bankAccount;
    constructor(name, age, contactNumber, pin, userId) {
        this.name = name;
        this.age = age;
        this.contactNumber = contactNumber;
        this.pin = pin;
        this.userId = userId;
        this.bankAccount = new BankAccount();
    }
}

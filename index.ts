#!/usr/bin/env node
                //import packages
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
                //import file
import { DisplayInfo, ShowAccountBalance, Credit, Debit ,TransactionHistory} from "./customerOption.js";
import { Customer } from "./customer.js";
const sleep = () => new Promise((r) => setTimeout(r, 2000))

console.log(gradient.rainbow(figlet.textSync("My  OOP  Bank")));


let customers: Customer[] = []



async function Choice() {
    const { option }: { option: 'C' | 'S' } = await inquirer.prompt([{
        name: "option",
        message: 'What Would You Like To Do ?',
        type: 'list',
        choices: [{ name: 'Create New Account', value: 'C' }, { name: 'Sign In', value: 'S' }]
    }])
    return option
}

async function CreateNewAccount() {
    enum Names {
        Name = 'Name',
        Age = 'Age',
        ContactNumber = 'Contact Number',
        Pin = 'Pin',
        UserID = 'UserID'
    }
    async function Inputs(name: Names, type: string) {
        while (true) {
            const { input } = await inquirer.prompt([{
                name: 'input',
                message: `Enter Your ${name} : `,
                type: type
            }])
            if (!input) {
                continue
            }
            if (name === Names.ContactNumber) {
                let numRegex = /^(\+92|0|92)[0-9]{10}$/
                if (!numRegex.test(input)) {
                    console.log(chalk.red(`  Use Pakistani Number`))
                    continue
                }
            }
            if (name === Names.UserID) {
                let customer = customers.filter((val) => val.userId === input)
                if (customer.length) {
                    console.log(chalk.red(`  This UserID Is Already Taken Try Different`))
                    continue
                }
            }
            return input
        }
    }
    let name = await Inputs(Names.Name, 'string')
    let age = await Inputs(Names.Age, 'number')
    let contactNumber = await Inputs(Names.ContactNumber, 'string')
    let pin = await Inputs(Names.Pin, 'number')
    let userId = await Inputs(Names.UserID, 'string')
    let customer = new Customer(name, age, contactNumber, pin, userId)
    let spinner = createSpinner('Creating Account').start()
    await sleep()
    customers.push(customer)
    spinner.success({ text: gradient.rainbow('Successfully Created Account') })
}



async function SignIn() {
    const { userID, pin }: { userID: string, pin: number } = await inquirer.prompt([
        {
            name: 'userID',
            message: "Enter Your UserID : ",
        },
        {
            name: 'pin',
            message: 'Enter Your Pin : ',
            type: 'number'
        }
    ])
    let customer = customers.find((val) => val.userId === userID)

    let spinner = createSpinner('Signing In').start()
    await sleep()

    if (!customer) {
        spinner.error({ text: chalk.red(` No Customer With This UserID`) })
        return
    }
    else {
        if (customer.pin !== pin) {
            spinner.error({ text: chalk.red(` Incorrect PIN`) })
            return
        }
        spinner.success({ text: chalk.green('Signed In Successfully') })
        while (true) {
            const { userChoice }: {
                userChoice: 'Show Profile' | 'Debit' | 'Credit' | 'Account Balance' | 'Transaction History'
            } = await inquirer.prompt([{
                name: 'userChoice',
                message: 'Make Your Choice',
                type: 'rawlist',
                choices: ['Show Profile', 'Debit', 'Credit', 'Account Balance', 'Transaction History']
            }])

            switch (userChoice) {
                case 'Show Profile':
                    DisplayInfo(customer)
                    break;
                case 'Account Balance':
                    ShowAccountBalance(customer)
                    break;
                case 'Credit':
                    await Credit(customer)
                    break;
                case 'Debit':
                    await Debit(customer)
                    break;
                case 'Transaction History':
                    TransactionHistory(customer)
                    break
                default:
                    break;
            }

            const { choice }: { choice: 'Perform Another Task' | 'Sign Out' } = await inquirer.prompt([
                {
                    name: 'choice',
                    message: 'Select One: ',
                    type: "list",
                    choices: ['Perform Another Task', 'Sign Out']
                }
            ])
            if (choice === 'Sign Out') {
                console.log(gradient.rainbow(`\nThanks To Sign Out\n`))
                break;
            }
            else {
                console.log(chalk.whiteBright(`\n*************************************\n`))
                continue
            }

        }
    }
}



while (true) {

    let choice = await Choice()
    if (choice === 'C') {
        await CreateNewAccount()
    }
    else if (choice === 'S') {
        await SignIn()
    }

    // EXIT PROGRAM CHOICE
    const input = await inquirer.prompt([
        {
            name: chalk.rgb(255, 255, 160)(`Do You Want To Exit?`),
            type: "confirm",
            default: false
        }
    ])
    let value: boolean = await input['\x1B[38;2;255;255;160mDo You Want To Exit?\x1B[39m']
    if (value) {
        break;
    }
    console.log(gradient.rainbow('\nTHANKS TO PLAY AGAIN :)'))
}
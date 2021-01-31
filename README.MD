# Walleto

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/NguyenVuNhan/walleto-be">
    <img src="src/assets/icon/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Cooking blog</h3>
</p>

<!-- Table of content -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Walleto is an application that allows users to keep track of their expenses.
By default, a user will have three wallets: Global, Loan, and saving.
The global wallet keeps track of the total amount of cost.
Loans wallet will show the dept and loans.
The saving wallet will act as your saving account.
Each wallet will show their income and outcome and provide a report on the activity of each wallet.
Base on user demand, they can create a custom wallet.

When adding a new transaction, the user has to choose their wallet and the transaction category.
When a new transaction is submitted, wallets are updated accordingly to that transaction.

<!-- GETTING STARTED -->
## Getting Started
This is an example of how you may give instructions on setting up this project locally.
To make it up and running follow these simple step

### Prerequisites

It is required to install docker using this application, the instalation process can be found in [docker official page](https://docs.docker.com/engine/install/).
If you are using Linux, it needs to install docker-compose. The instruction can be found [here](https://docs.docker.com/compose/install/)

### Installation

After install docker and docker-compose, you can run this command to build the project

> docker-compose build

<!-- USAGE EXAMPLES -->
## Usage

To make the application up and running, simply type:

> docker-compose up

Or to run it in background (detach mode):

> docker-compose up -d

The server is now up and running at [localhost:5000](localhost:5000).
A handy tool like Postman will needed to test out the api.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Nhan Vu Nguyen - email@example.com

Project Link: [https://github.com/NguyenVuNhan/walleto-be](https://github.com/NguyenVuNhan/walleto-be)

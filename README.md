# README: Customer International Payments Portal

**Demo video** :https://youtu.be/QQQBiNAYGkw?feature=shared 

## Overview

This project focuses on building a secure **Customer International Payments Portal** for an internal banking system. Our application  is called Money Gold International which is a  portal that  will manage sensitive customer data, international payments, and bank transactions with a strong emphasis on security and compliance. The solution includes a **React** or **Angular** frontend and a backend **API** that ensures secure customer interaction and seamless processing of payments through **SWIFT**.

### Purpose

The portal allows customers to register and execute international payments, while employees can review and process these payments for **SWIFT** transfers. The primary objective is to maintain high levels of security, ease of use, and regulatory compliance throughout the system.

---

## Key Features

### Customer Features

1. **Home page**:
   - The first interface is a homepage and it explains what money gold is about.
   - The users has the options to register if they are not a user or to sign in to the application .
     
![image](https://github.com/user-attachments/assets/90447503-d820-4539-9acc-5198e77fc295)


2. **About page**:
   - This is were users will be able to read and get to know what the application is about and the process of the application.

  ![image](https://github.com/user-attachments/assets/a9bff9d1-22f3-4e64-85b2-1a0a662b5397)
     

2. **Registration**:
   - Customers must provide their full name, ID number, account number, and password to register.
   - Passwords are securely hashed and salted to safeguard against unauthorized access.
     
 ![image](https://github.com/user-attachments/assets/3f0ecffe-637f-48e6-a7bc-efbf0ab32a98)
 

3. **Login**:
   - Customers log in using their username, account number, and password.
   - **RegEx**-based input validation ensures that only valid data is accepted.
     ![image](https://github.com/user-attachments/assets/e0c399ff-f0d6-4899-826a-378a56557d9c)



4.**Payment**:
- Users will there after have the access to do a payment after logging in .
![image](https://github.com/user-attachments/assets/8b2241e5-d09a-40d7-9423-de1ac3bbf16b)


5. **Payment progress**
   - Once payment it would be updates on the progress page ,users can click on the progress page and see the progress of their payment . to the payment progress page ,it will also show users the details of the paid user's username ,provide,timestamp and status .
     ![image](https://github.com/user-attachments/assets/bea64614-c5a8-4adf-943c-dd6686931c33)
     
  
6. **Employee login**
   - Employee log in using their employeeID, email, and password.
   - No self-registration process: only employees can add other employees  and cannot register themselves through the portal.
   - **RegEx**-based input validation ensures that only valid data is accepted.
   - Password hashing and salting: Passwords must be securely hashed and salted using an industry-standard method to protect user credentials.
   - Default employee details:
      "fullName" : "Default Employee"
      "employeeID": "EMP001"
      "email": "default@gmail.com"
      "role":"admin"
      "password": "DefaultEmployeePass123!"

![image](https://github.com/user-attachments/assets/1ead4733-e3cb-4c89-8a35-64d3168cb896)



 7. **Employee data page**
        - Wmployees can see the users username ,account number ,amount (usd),the currency ,the swift code ,provider ,timestamp,status and an action button to approve payment.
        -Employees will approve payment of details are correct and they will be redircted to the verfication page .In this time the status will go from progress to approved .
![image](https://github.com/user-attachments/assets/cbb87fdf-612b-4ac4-962d-232411e3a559)

 8.**Payment verified page**
 -The payment verfication page will have the important sent to swift and will verified that the payment has been verified .

![image](https://github.com/user-attachments/assets/95f749b4-5882-42b6-b479-30e706a02f52)


9.**Add Employee page**
-Only an admin can add an employee.The admin will have to add the new employees such as full name ,employee ID,email ,password and role (Admin/employee).
- **RegEx**-based input validation ensures that only valid data is accepted.

![image](https://github.com/user-attachments/assets/318c5bf3-3c0c-4a83-91fd-27be4cbb5181)

  
     
## How It Works
1. **Logging In**
- Before you can access the payment features, you must be logged into your account
- Already registered? 
- You only need to sign in with your user name and password.
- New user?
- In order to continue, please, sign up for an account.
- After that, you will be able to perform payments after logging in to the application.

2. **Payment Process**
- Navigate to the Payment Page
- Once logged in click on the Payment tab in the application.

## Enter Payment Details
- To complete a payment, provide the following details:
- Username: Your registered username.
- Account Number: Your special ten digits account number.
- Amount: The quantity desired to be paid (must be greater than zero).
- Currency: Type in the 3-letter world ISO code (USD, EUR, GBP, etc.).
- SWIFT Code: The SWIFT code of your bank – an 8-to-11-digit code.

## Submit Payment
- After duplicating all the information needed fields appear hit the blue button named Submit Payment.
- It will then check your details and make payment on the application that you provided identifies.

3. **Confirmation** 
- Which are important statements that are issued to reflect final approval of the credit given to a customer.
- You will receive a confirmation message after your payment processes are completed.
-This message includes:
-  A successful payment
- The Amount Paid, specified in any currency selected.

4. **Error Handling**
- If your payment failed to be processed you will receive a message indicating the kind of error that has occurred. 
- Common error messages may include:
- Earlier, the username attribute was mandatory, as well as the fact that it had to be at least 3 characters long.
•	‘Account number’ is mandatory and must be an integer of 10 digits long.”
•	“an acceptable value can be given in the form of the payment amount and that payment amount is supposed to be a positive value.”
•	It’s a mandatory field and it should be a valid ISO 3 alphabetic code.
•	‘It should be a proper SWIFT code, containing no more than 11 and no less than 8 characters.

---

## Technologies Used

### Frontend:
- **React** or **Angular** for the customer and employee interfaces.
- **HTML5** and **CSS3** for structure and design.
- **Bootstrap** or **Material UI** for responsive and accessible design.

### Backend API:
- **Node.js** with **Express.js** for handling server-side logic and API requests.
- **MongoDB** for customer and transaction data storage.

### Security:
- **Password Hashing and Salting**: Passwords are secured using **bcrypt** or similar hashing libraries.
- **Regex Validation**: All input fields are whitelisted using **RegEx** patterns to prevent invalid or harmful data.
- **SSL/TLS Encryption**: All communication between the client and server is encrypted.
- **JWT (JSON Web Tokens)** are used for secure authentication and session management.

---

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Khatija-Essa/APDS_POE


2. Install Dependencies: After cloning the repository, navigate to the frontend and backend directories to install all necessary dependencies.

cd frontend
npm install

cd ../backend
npm install


3. Configure Environment Variables: Create a .env file in both the frontend and backend directories to store sensitive configuration values such as:

Database credentials:
API keys
JWT secret
SSL certificate paths


4. Run the Application:
Start the frontend:
cd frontend
npm start

Start the backend:

cd backend
npm start

---

API Endpoints

Customer API:

POST /api/register - Register a new customer by providing the necessary personal information.

POST /api/login - Log in to the portal with a username, account number, and password.

---

Security Best Practices

1. Password Handling:

Passwords are hashed and salted before storage using bcrypt or a similar library to ensure data security.

2. Data Validation:
All user inputs are validated using RegEx patterns, protecting against SQL injection, cross-site scripting (XSS), and other malicious data entry.

3. Encryption:
All communications between the frontend and backend are encrypted using SSL/TLS, ensuring that no sensitive data is transmitted in plain text.
Sensitive data such as payment information is encrypted when stored in the database to comply with data protection regulations.

4. Session Management:
JWT (JSON Web Tokens) are used to securely manage user authentication and sessions, ensuring that unauthorized users cannot access the portal.


---

Testing and Deployment

1. Unit Testing:

Implement unit tests for both frontend and backend components using testing frameworks such as Jest or Mocha to ensure the reliability and integrity of the system.



# Contact:
- Thabani Shabalala
- Nkosinomusa Hadebe
- Naledi Malunga
- Khatija Essa
- Sherel Davaraj



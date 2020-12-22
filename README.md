# profileManager
This website includes basic authentication system and email sending service when user register, login and deletes his/her account.
This website is finally deployed on heroku.
Link is as follows:- https://vimal-profile-manager.herokuapp.com

Steps to configure this project and run on your local machine:-

Step1:- Clone this project on your machine.

Step2:- Run "npm install" command(without quotes) from your terminal which should be directed to root of the project.

Step3:- Create a folder named as "config" (without quotes) at root of your project.

Step4:- Inside config folder create a file named as dev.env.

Step5:- In this file you have to declare following environment variables:-
        
        PORT=3000
        
        DBURL=mongodb://127.0.0.1:27017/database_name
        
        JWT_SECRET=yourjwtsecretkey
        
        EMAIL=Your email for sending emails to user
        
        PASSWORD=The password of that email

With these 5 steps you are good to go. You can visit the website by running "npm run dev" command(without quotes). The website will be available on port 3000.

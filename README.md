# Mitron - A MERN Stack Twitter Clone

## Description
Mitron is a full-fledged Twitter Clone built with the powerful **MERN stack** (MongoDB, Express.js, React.js, Node.js). The application provides all core social media functionalities such as creating posts (tweets), liking and commenting, following/unfollowing users, updating user profiles, and more — all backed with secure authentication and an elegant UI.

This project is crafted to showcase the seamless integration of frontend and backend technologies, offering a real-world, scalable social media experience with modern development tools and libraries.

## Features

### 1. **🔐 Secure Authentication**

* JWT-based login and signup

* Cookie-based session management
  
  **Login Endpoint tested with Postman** -

  <img width="1412" alt="Screenshot 2025-04-08 at 2 33 14 PM" src="https://github.com/user-attachments/assets/9645fabf-28f5-45f9-935e-8ab508356e96" />


### 2. **📝 Post Functionality**

* Create, read, like, comment on posts

* Real-time UI updates with React Query

**Posts , likes and commenting functionality properly working**:- 

  <img width="1461" alt="Screenshot 2025-04-22 at 12 15 58 AM" src="https://github.com/user-attachments/assets/75180646-2298-460f-bc0b-c4cb7aacd25a" />


### 3. **🧑‍🤝‍🧑 User Interactions**

* Follow and unfollow users

* View and update user profiles
  

**Follow and unFollow profiles functionality** :- 


<img width="398" alt="Screenshot 2025-04-22 at 12 18 06 AM" src="https://github.com/user-attachments/assets/67c1bad0-2f5e-438a-86b3-2cd03a02932b" />


**Updating User profile functionality**:-


<img width="1470" alt="Screenshot 2025-04-22 at 12 21 05 AM" src="https://github.com/user-attachments/assets/5275099c-478b-454d-a640-d50b3f8d3803" />




### 4. **💬 Notifications & Feedback**

* Toast notifications for actions

* Interactive UI with responsive design

**Notifications tab with like and follow upadtes**:-

<img width="548" alt="Screenshot 2025-04-22 at 12 23 31 AM" src="https://github.com/user-attachments/assets/0018f900-d549-4024-97d5-e1a8380cb96a" />


### 5. **📷 Image Support**

* Upload profile pictures and post images using Cloudinary

**profile pic updating**:-

<img width="500" alt="Screenshot 2025-04-22 at 12 40 03 AM" src="https://github.com/user-attachments/assets/ce291180-9132-4cbb-bd0e-588feca269a2" />


## Tech Stack

### Frontend

* React.js (v18.2.0) – Main frontend framework

* Vite – Build tool and development server

* React Router DOM (v6.21.3) – For client-side routing

* TailwindCSS (v3.4.1) – Utility-first styling

* DaisyUI – UI component library built on TailwindCSS

* React Query (@tanstack/react-query) – For fetching and caching server state

* React Hot Toast – Toast notification library

* React Icons – For rich iconography

### Backend

* Node.js – Runtime environment

* Express.js – Web framework for building REST APIs

* MongoDB – NoSQL database

* Cloudinary – Cloud-based image storage and processing

* Cookie Parser – Middleware to parse cookies

* Dotenv – Load environment variables

### Development Tools

* ESLint – JavaScript code linting

* PostCSS – CSS transformation tool

* Autoprefixer – Adds vendor prefixes to CSS

### Setup Instructions

#### Frontend Setup

Step1 : git clone https://github.com/your-username/mitron.git

Step2: cd mitron/client

Step3: npm install

Step4: npm run dev


Reference: 

<img width="676" alt="Screenshot 2025-04-21 at 11 08 16 PM" src="https://github.com/user-attachments/assets/e366ea51-74b8-4095-85dd-7df9f3c67e12" />



#### Backend Setup

Step1: cd mitron/server

Step2: npm install

Step3: npm start


Reference: 

<img width="495" alt="Screenshot 2025-04-21 at 11 07 30 PM" src="https://github.com/user-attachments/assets/76f8f590-5d6c-4c58-b90d-8c724f9e7736" />

(Create a .env file and add required environment variables:  MONGO_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)


## Video References :

**Here are the tutorials and video guides that helped shape this project. All credit to these amazing creators**

1. Build and Deploy a Full Stack Twitter Clone | MERN Stack Tutorial – Code with Ayan

2. React Query Crash Course – The Net Ninja

3. Tailwind CSS + DaisyUI Crash Course – Traversy Media

4. Secure Auth with JWT in Node.js – Web Dev Simplified

5. Cloudinary Upload Integration – PedroTech

6. React + Express Starter with Vite – Laith Academy

🔗 These videos served as the backbone and reference points during various stages of development. Many thanks to the creators for their valuable content!


## Screenshots: 



### Testing Login endPoint on **POSTMAN**

 <img width="1412" alt="Screenshot 2025-04-09 at 1 10 06 PM" src="https://github.com/user-attachments/assets/76b7345b-e505-463a-8abd-9e8b075f72b3" />


### Here is my create post controller


<img width="675" alt="Screenshot 2025-04-22 at 12 27 29 AM" src="https://github.com/user-attachments/assets/d0436c18-fc5b-4fa4-a851-977c3209a77a" />

### Here is my backend controller for follow and unfollow functionality

  
<img width="1082" alt="Screenshot 2025-04-22 at 12 28 53 AM" src="https://github.com/user-attachments/assets/d6542576-ee83-427d-a76a-931ffe01a6f7" />


## Deployed link
https://mitron.onrender.com/


## Conclusion
Mitron is more than just a clone — it’s a foundational project that demonstrates the power of the MERN stack in building modern, real-time, and user-interactive applications. It bridges core concepts of full-stack development such as secure authentication, cloud integrations, RESTful APIs, responsive frontend UIs, and scalable backend design.

Whether you're a developer looking to learn full-stack app development or a recruiter assessing skills in action — this project reflects hands-on experience with today's industry-relevant technologies.

Feel free to fork it, build upon it, or even turn it into something entirely new.







---
title: Pawfect
subtitle: 
date: 2025-03-18
tags:
  - web-dev
comments: true
draft: 
enableToc: true
---
# Full-stack web-app

> [!INFO] Tech Stack
> - ReactJS
> - ShadCN
> - Tailwind
> - NodeJs
> - ExpressJs (On top of NodeJs)
> - MongoDB  
> The website is hosted on an ubuntu cloud server and tunneled through cloudflare argo tunnels.

### Live at : https://paws.shivang.dev
- Adopter : `adopter@gmail.com : 092004`
- Rehomer : `rehomer@gmail.com : 092004`
### Github : https://github.com/shivangjhalani/paws
### Guided tour
#### Home
![[Pasted image 20250318193617.png]]

#### Signup
![[Pasted image 20250318193659.png]]

#### Login

> [!NOTE] LOGIN DEMO : https://paws.shivang.dev

- Adopter : `adopter@gmail.com : 092004`
- Rehomer : `rehomer@gmail.com : 092004`

![[Pasted image 20250318193712.png]]

#### Adopter Explore pets
![[Pasted image 20250318193831.png]]

#### Adopter Liked pets
![[Pasted image 20250318193901.png]]

#### Rehomer List pets
![[Pasted image 20250318193938.png]]

![[Pasted image 20250318193947.png]]


---
### Paws: Bridging the Gap Between Pets and Forever Homes

As a child, I remember the excitement of wanting to adopt a dog, but struggling to find a reliable and centralized platform. That experience sparked the idea behind "Paws," a full-stack web application designed to connect pets with loving homes. While initially conceived as a college project, "Paws" evolved into a personal passion, addressing a real-world need.

**The Problem and Solution**

The core problem "Paws" solves is the fragmented and often inefficient process of pet adoption. Potential adopters often face challenges in finding available pets, while shelters and individuals struggle to reach a wider audience. "Paws" acts as a centralized hub, simplifying the adoption journey for both parties.

**Key Features**

- **User-Friendly Platform:** "Paws" functions like a pet-focused online marketplace, similar to OLX, enabling individuals, shelters, and sellers to list pets for adoption or rehoming.
- **Customization and Ease of Use:** The platform prioritizes user experience, offering intuitive navigation and extensive customization options for both adopters and rehomers.
- **Detailed Pet Listings:** Rehomers can create comprehensive profiles for their pets, including photos, descriptions, and essential information, ensuring transparency for potential adopters.
- **Robust User Management:** Separate sign-up processes for adopters and rehomers, with tailored dashboards and functionalities.

**Technology Stack**

- **Frontend: React.js:** I chose React for its ability to build dynamic and responsive Single Page Applications (SPAs), providing a seamless user experience.
- **UI Components: Shadcn:** Shadcn's beautiful and accessible pre-built components allowed me to focus on core functionality rather than spending excessive time on UI design.
- **Backend: Express.js (Node.js):** Leveraging my existing knowledge of Node.js and Express.js, I built a robust and scalable backend to handle API requests and data management.
- **Database: MongoDB:** MongoDB's flexible and dynamic schema capabilities were ideal for managing diverse pet and user data. I designed detailed schemas to ensure data integrity.

**Development Challenges and Learnings**

Developing "Paws" presented several challenges, particularly in designing a scalable database schema and implementing secure user authentication. Overcoming these hurdles reinforced my problem-solving skills and deepened my understanding of full-stack development.

```
❯ tree -I "node_modules|dist|coverage|.git|.cache|*.png"
.
├── client
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.app.json
│   ├── jsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── about.webp
│   │   ├── sampledogs
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   │   ├── FilterDialog.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PetImages.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui
│   │   │       ├── accordion.jsx
│   │   │       ├── alert.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── checkbox.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── navigation-menu.jsx
│   │   │       ├── select.jsx
│   │   │       ├── separator.jsx
│   │   │       ├── slider.jsx
│   │   │       ├── switch.jsx
│   │   │       ├── table.jsx
│   │   │       ├── tabs.jsx
│   │   │       └── textarea.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── index.css
│   │   ├── lib
│   │   │   └── utils.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditPet.jsx
│   │   │   ├── ExplorePets.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LikedPets.jsx
│   │   │   ├── ListPets.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManagePets.jsx
│   │   │   └── Signup.jsx
│   │   └── services
│   │       ├── api.jsx
│   │       └── petapi.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── server
    ├── models
    │   ├── index.js
    │   ├── pet.js
    │   ├── user
    │   │   ├── adopter.js
    │   │   └── rehomer.js
    │   └── user.js
    ├── package.json
    ├── package-lock.json
    ├── server.js
    └── uploads
        ├── image1.png
        └── ...
```
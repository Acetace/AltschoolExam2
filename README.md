# AltschoolExam2
# 🌐 AltSchool Web Server Deployment (Ubuntu + Nginx + SSL)

This project demonstrates how to set up a **production-ready web server** on an Ubuntu instance using Nginx, secure it with SSL via Let's Encrypt, deploy, and push all configurations to GitHub from a remote terminal.

---

#Project Contents

- `README.md` – Project documentation
- Nginx and SSL setup for HTTPS suppor


- ## 1. Server Setup
- Created an EC2 instance on AWS using Ubuntu 22.04 LTS.
- Ubuntu instance (`ubuntu@ip-172-31-40-73`)
- Connected using an SSH key (`.pem`)
- Opened ports 22 (SSH) - From anywhere (0.0.0.0)
-  80 (HTTP) - From anywhere (0.0.0.0)
-  and 443 (HTTPS).
  

 ## 2. Web Server
- Installed **Nginx**.
  sudo apt update && sudo apt upgrade -y
  sudo apt install nginx -y
- Configured Nginx to serve the landing page.
# (Bonus) Set up Nginx as a reverse proxy for a simple Node.js app.
To improve the structure and scalability of the application, i configured Nginx to act as a reverse proxy that forwards HTTP requests to a Node.js server running on port 3000.
This setup is commonly used in production environments for better performance, security, and SSL termination.
# I installed Node.js and npm on the Ubuntu server:
  sudo apt update
  sudo apt install nodejs npm -y
# Inside the home directory, i created a new folder for the app:
  mkdir myapp && cd myapp
  nano server.js
# I added this minimal Node.js code in server.js:
  const http = require('http');
  const port = 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Node.js behind Nginx!</h1>');
}).listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
# Then i started the app using
  node server.js
# to configure Nginx as a Reverse Proxy i opened the nginx default site config
 sudo nano /etc/nginx/sites-available/default
then replaced the content with

server {
    listen 80;
    www.domainmerchants.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Kept the server running using PM2 (Process Manager 2)
sudo npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
Which ensures the node app runs in the baackground and starts automatically on reboot

# Then restarted Nginx to apply changes
  sudo systemctl restart nginx
# To test the Reverse Proxy i visited the server's public IP and domain in the browser



## 3. Landing Page
- Built a responsive landing page using HTML, Tailwind CSS, and animations.
- Page includes:
  - Name & Role
  - Project Title: "The Future of Smart Agriculture"
  - Pitch about innovation
  - Professional bio



# To connect a custom domain, i registered the domain domainmerchants.online at namecheap
Then set DNS Records on the registrar's settings by pointing the records to my public IP
Type: A  
Name: @ or www  
Value: 51.20.6.12 (your server's IP)
TTL: 30 mins or default
- Waited a few minutes for propagation then confirmed it with 
   ping www.domainmerchants.online
  which then returned my servers's public IP
  
  # Then i Updated Nginx Server Block by editing Nginx config to include domain
  server {
    listen 80;
    server_name domainmerchants.online www.domainmerchants.online;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
# Then i reloaded nginx
sudo nginx -t
sudo systemctl reload nginx

 
## 4. Secured the Site with HTTPS Using Let’s Encrypt & Certbot
# To protect traffic between the browser and the server, I installed a free SSL certificate using Let’s Encrypt and automated it with Certbot.
# Install Certbot and Nginx plugin:
 sudo apt update
 sudo apt install certbot python3-certbot-nginx
# Obtain and install SSL certificate:
- sudo certbot --nginx -d domainmerchants.online -d www.domainmerchants.online

## 5. Git Initialization & GitHub Integration
 # I initialized git locally
 -cd ~/myapp
  - git init
 # Added and commit files
 - git add .
 - git commit -m "Initial commit with HTML and server setup"
 # Created a remote repository
 i created a new repository on GitHub: https://github.com/Acetace/AltschoolExam2
 # Linked the remote
 -  git remote add origin https://github.com/Acetace/AltschoolExam2.git
# Pull to merge history (since the remote had a README or existing commits)
 - git pull origin main --allow-unrelated-histories --no-rebase
# Authenticate and Push (Since GitHub removed password-based authentication, i used a Personal Access Token (PAT) in place of a password)
 - git push -u origin main





####
Public IP: 51.20.6.12

Domain: https://www.domainmerchants.online











# 🌐 AltSchool Web Server Deployment (Ubuntu + Nginx + SSL)

This project showcases a fully deployed and secure web server, featuring:
- Cloud-hosted Ubuntu server on AWS EC2
- Nginx reverse proxy for a Node.js app
- SSL encryption via Let’s Encrypt
- Custom domain integration
- GitHub deployment tracking

---

## 📁 Project Contents
- `server.js` – Node.js HTTP server
- `README.md` – Project documentation
- Nginx and Certbot configuration for HTTPS

---

## 🖥️ 1. Server Setup

- Provisioned an **EC2 instance** with **Ubuntu 22.04 LTS**.
- Connected via SSH using a `.pem` private key:
  ```bash
  ssh -i your-key.pem ubuntu@your-ec2-ip
  ```
- Opened inbound ports:
  - `22` (SSH) - from anywhere (0.0.0.0)
  - `80` (HTTP) - from anywhere (0.0.0.0)
  - `443` (HTTPS)

---

## 2. Web Server
- Installed **Nginx**:
  ```bash
  sudo apt update && sudo apt upgrade -y
  sudo apt install nginx -y
  ```
- Configured Nginx to serve the landing page.

### (Bonus) Set up Nginx as a reverse proxy for a simple Node.js app
To improve the structure and scalability of the application, Nginx was configured to act as a reverse proxy that forwards HTTP requests to a Node.js server running on port 3000.
This setup is commonly used in production environments for better performance, security, and SSL termination.

- Installed Node.js and npm:
  ```bash
  sudo apt update
  sudo apt install nodejs npm -y
  ```
- Created Node.js app:
  ```bash
  mkdir myapp && cd myapp
  nano server.js
  ```
- Added this code in `server.js`:
  ```js
  const http = require('http');
  const port = 3000;

  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Hello from Node.js behind Nginx!</h1>');
  }).listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  ```
- Started the app using:
  ```bash
  node server.js
  ```

- Installed PM2 to keep Node.js running in the background:
  ```bash
  sudo npm install -g pm2
  pm2 start server.js
  pm2 save
  pm2 startup
  ```

- Restarted Nginx to apply changes:
  ```bash
  sudo systemctl restart nginx
  ```

- Tested by visiting public IP and domain in the browser.

---

## 2b. 🌐 Connecting Domain to Static Landing Page

After configuring Nginx and setting up your Node.js reverse proxy, we connected the domain to serve our **HTML + Tailwind CSS** landing page directly from the Ubuntu server.

### 🛠 Steps to Serve Static Landing Page at Root (`/`)

1. **DNS Configuration**  
   The domain `domainmerchants.online` was registered on Namecheap and DNS was pointed to the EC2 server’s public IP:
   - Type: `A`  
   - Name: `@` and `www`  
   - Value: `51.20.6.12`
  Verified with:
  ```bash
  ping domainmerchants.online
  ```
     
2. **Placed Static Files in Nginx Web Root**
   ```bash
   sudo mv ~/index.html /var/www/html/
   sudo chown www-data:www-data /var/www/html/index.html
   ```

3. **Updated Nginx Configuration**  
   Edited `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name domainmerchants.online www.domainmerchants.online;

       root /var/www/html;
       index index.html;

       # Serve static files at root
       location / {
           try_files $uri $uri/ =404;
       }

       # Reverse proxy to Node.js app at /api
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Reloaded Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Result**
   - `https://domainmerchants.online/` now shows the **custom landing page**.
   - `https://domainmerchants.online/api` serves the **Node.js response**: _“Hello from Node.js behind Nginx!”_

---

## 💻 3. Landing Page

- Created a responsive page with HTML + Tailwind CSS
- Content includes:
  - **Name & Role**
  - **Project Title**: *“The Future of Smart Agriculture”*
  - **2–3 sentence innovation pitch**
  - **Professional bio** (skills, education, projects)

---

## 4. Networking & Security
- Allowed inbound traffic on Port 80 and 443.
- (Bonus) Used Let’s Encrypt with Certbot to install free SSL certificate (HTTPS).

### 🔧 Steps:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domainmerchants.online -d www.domainmerchants.online
```

Verified with:
```bash
sudo certbot renew --dry-run
```

---

## 5. Git Initialization & GitHub Integration
- Initialized git locally:
  ```bash
  cd ~/myapp
  git init
  ```
- Added and committed files:
  ```bash
  git add .
  git commit -m "Initial commit with HTML and server setup"
  ```
- Created a remote repository:
  [GitHub Repo](https://github.com/Acetace/AltschoolExam2)
- Linked the remote:
  ```bash
  git remote add origin https://github.com/Acetace/AltschoolExam2.git
  ```
- Pulled to merge history:
  ```bash
  git pull origin main --allow-unrelated-histories --no-rebase
  ```
- Pushed to GitHub using Personal Access Token:
  ```bash
  git push -u origin main
  ```

> ⚠️ Used a **GitHub Personal Access Token** for authentication instead of a password.

---

## 🚀 Final Output

- **Public IP**: `51.20.6.12`
- **Live Site**: [https://www.domainmerchants.online](https://www.domainmerchants.online)
- [screenshot](ALTScreenshot.JPG)


  

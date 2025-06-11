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
  - `22` (SSH)
  - `80` (HTTP)
  - `443` (HTTPS)

---

## 🌐 2. Web Server: Nginx + Node.js Reverse Proxy

### ✅ Installed Nginx
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx -y
```

### ✅ Installed Node.js and npm
```bash
sudo apt install nodejs npm -y
```

### ✅ Created a Simple Node.js App
```bash
mkdir ~/myapp && cd ~/myapp
nano server.js
```

Paste this code into `server.js`:
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

Start the app:
```bash
node server.js
```

Or use PM2 to keep it running in the background:
```bash
sudo npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

### ✅ Configure Nginx as Reverse Proxy

Edit the default Nginx config:
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the content with:
```nginx
server {
    listen 80;
    server_name domainmerchants.online www.domainmerchants.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 💻 3. Landing Page

- Created a responsive page with HTML + Tailwind CSS
- Content includes:
  - **Name & Role**
  - **Project Title**: *“The Future of Smart Agriculture”*
  - **2–3 sentence innovation pitch**
  - **Professional bio** (skills, education, projects)

---

## 🌍 4. Domain & DNS Configuration

- Registered domain: `domainmerchants.online` via Namecheap
- Updated DNS records to point to server's public IP:

| Type | Name | Value (IP)    | TTL     |
|------|------|---------------|---------|
| A    | @    | 51.20.6.12     | Default |
| A    | www  | 51.20.6.12     | Default |

Verified with:
```bash
ping domainmerchants.online
```

---

## 🔒 5. HTTPS with Let’s Encrypt & Certbot

Secured the website using **Let’s Encrypt** SSL certificate.

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

## 🔗 6. GitHub Deployment

### ✅ Initialized Git and Linked Repository
```bash
cd ~/myapp
git init
git add .
git commit -m "Initial commit with HTML and server setup"
git remote add origin https://github.com/Acetace/AltschoolExam2.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

> ⚠️ Used a **GitHub Personal Access Token** for authentication instead of a password.

---

## 🚀 Final Output

- **Public IP**: `51.20.6.12`
- **Live Site**: [https://www.domainmerchants.online](https://www.domainmerchants.online)
  
![Screenshot](screenshot.jpg)

---
